// @ts-check
import { fileURLToPath } from 'node:url'
import { defineConfig, envField } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'

/** `content/` — poza rootem Vite, stąd cała potrzeba wtyczki niżej. */
const CONTENT_DIR = fileURLToPath(new URL('../../content/', import.meta.url))

/**
 * Dopina `content/` do watchera dev servera (PLAYBOOK `P-021`).
 *
 * Warstwa treści i mediów stoi na `import.meta.glob(..., { eager: true })`.
 * Vite umie unieważnić taki glob, gdy pasujący plik się pojawi albo zniknie —
 * ale tylko dla plików, które **obserwuje**, a `content/` leży poza rootem
 * (`apps/web`), więc chokidar nigdy nie dostawał stamtąd zdarzeń. Efekt: plik
 * dodany przy działającym `pnpm dev` nie istniał dla globa aż do restartu,
 * a `resolveImage` rzucał „Missing image file" na plik leżący w katalogu.
 *
 * `watcher.add()` załatwia edycje istniejących plików — wbudowane handlery Vite
 * wiszą na tym samym watcherze. Dodanie i usunięcie pliku domykamy sami, bo to
 * jedyny przypadek, w którym musi się przeliczyć **sam glob**, a nie moduł.
 *
 * Właścicieli globów nie wypisujemy z nazwy: szukamy modułów, które importują
 * cokolwiek z `content/`. Dzięki temu trzeci glob nad tym katalogiem zadziała
 * bez dotykania tego pliku.
 */
function watchContentSources() {
  return {
    name: 'stora:watch-content-sources',
    apply: 'serve',
    /** @param {any} server */
    configureServer(server) {
      server.watcher.add(CONTENT_DIR)

      /** @param {string} file */
      const revalidate = (file) => {
        if (!file.startsWith(CONTENT_DIR)) return

        const graphs = Object.values(server.environments ?? {})
          .map((/** @type {any} */ env) => env.moduleGraph)
          .filter(Boolean)

        for (const graph of graphs) {
          for (const mod of graph.idToModuleMap?.values() ?? []) {
            for (const dep of mod.importedModules ?? []) {
              if (dep.file?.startsWith(CONTENT_DIR)) {
                graph.invalidateModule(mod)
                break
              }
            }
          }
        }

        // Astro renderuje stronę przy żądaniu, więc przeładowanie karty jest tym,
        // co każe unieważnionym modułom przejść transform jeszcze raz.
        const hot = server.hot ?? server.ws
        hot?.send({ type: 'full-reload', path: '*' })
      }

      server.watcher.on('add', revalidate)
      server.watcher.on('unlink', revalidate)
    },
  }
}

/**
 * Astro pozostaje statyczne (standard xCloud §6.1). Zero SSR, zero endpointów —
 * jedynym publicznym serwerem jest Nginx, a Payload żyje w prywatnej sieci.
 *
 * `trailingSlash: 'always'` jest polityką projektu i MUSI być spójne z:
 *   – linkami wewnętrznymi (`pagePath()` z @repo/shared),
 *   – canonicalami i sitemapą,
 *   – blokiem `location /` w docker/nginx.conf.
 */
export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || 'http://localhost:4322',
  output: 'static',
  trailingSlash: 'always',

  /**
   * Port jest PROJEKTOWY, nie domyślny (PLAYBOOK P-011, P-012). Domyślne 4321
   * zajmuje sąsiedni projekt Astro na tej samej maszynie, a wtedy `astro preview`
   * i Playwright potrafią po cichu obsłużyć cudzą stronę. Zmiana tej wartości
   * wymaga zmiany w `package.json` (`preview`), `playwright.config.ts` i `.env`.
   */
  server: { port: 4322 },

  build: {
    // Katalog na stronę: /o-nas/index.html — zgodnie z polityką slasha.
    format: 'directory',
    inlineStylesheets: 'auto',
  },

  image: {
    // Obrazy z Payloada (etap 2) są zdalne; astro:assets musi mieć zgodę na host.
    // Domenę bierzemy z publicznego origin, żeby nie hardkodować środowiska.
    domains: process.env.PUBLIC_SITE_URL ? [new URL(process.env.PUBLIC_SITE_URL).hostname] : [],
  },

  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],

  /**
   * Kontrakt zmiennych środowiskowych. `context: 'server'` + `access: 'secret'`
   * gwarantuje, że wartość NIE trafi do klienckiego bundla — to jest mechanizm,
   * który pilnuje, żeby STATIC_BUILD_TOKEN i prywatny adres Payloada nigdy nie
   * wylądowały w HTML (standard xCloud §22).
   */
  env: {
    schema: {
      PUBLIC_SITE_URL: envField.string({
        context: 'client',
        access: 'public',
        default: 'http://localhost:4322',
      }),
      CONTENT_SOURCE: envField.enum({
        context: 'server',
        access: 'public',
        values: ['fixtures', 'payload'],
        default: 'fixtures',
      }),
      PAYLOAD_API_URL: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      STATIC_BUILD_TOKEN: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
    },
  },

  vite: {
    plugins: [tailwindcss(), watchContentSources()],
    server: {
      // Bez tego Vite odmawia serwowania plików spoza roota, a `content/` jest
      // poza nim z założenia — patrz `watchContentSources()`.
      fs: { allow: [fileURLToPath(new URL('../../', import.meta.url))] },
    },
    build: {
      // Budżet perf jest twardy — ostrzeżenie ma się pojawić zanim przekroczymy limit.
      chunkSizeWarningLimit: 60,
    },
  },
})
