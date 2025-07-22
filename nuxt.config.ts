export default defineNuxtConfig({
    devtools: {
    enabled: false
  },
  ssr: true,
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],
  // Performance optimizations
  experimental: {
    payloadExtraction: false,
    inlineSSRStyles: false,
    viewTransition: true
  },
  colorMode: {
    classSuffix: '',
    preference: 'light',
    fallback: 'light'
  },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'ANT - Диагностика ТВ-приставок | Система технической поддержки',
      titleTemplate: '%s | ANT Diagnostics',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'description', content: 'Интерактивная система диагностики ТВ-приставок ANT с пошаговыми инструкциями. Решите проблемы за 3 простых шага. Техподдержка 24/7.' },
        { name: 'keywords', content: 'диагностика ТВ-приставок, ANT, техподдержка, ремонт приставок, настройка ТВ, спутниковое ТВ, цифровое ТВ' },
        { name: 'author', content: 'ANT Diagnostics' },
        { name: 'robots', content: 'index, follow' },
        { name: 'googlebot', content: 'index, follow' },
        { name: 'theme-color', content: '#3b82f6' },
        { name: 'msapplication-TileColor', content: '#3b82f6' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: 'ANT Diagnostics' },
        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'ANT Diagnostics' },
        { property: 'og:title', content: 'ANT - Диагностика ТВ-приставок' },
        { property: 'og:description', content: 'Интерактивная система диагностики ТВ-приставок с пошаговыми инструкциями. Решите проблемы за 3 простых шага.' },
        { property: 'og:image', content: '/og-image.jpg' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: 'ANT Diagnostics - Система диагностики ТВ-приставок' },
        { property: 'og:locale', content: 'ru_RU' },
        // Twitter Cards
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'ANT - Диагностика ТВ-приставок' },
        { name: 'twitter:description', content: 'Интерактивная система диагностики ТВ-приставок с пошаговыми инструкциями.' },
        { name: 'twitter:image', content: '/og-image.jpg' },
        { name: 'twitter:image:alt', content: 'ANT Diagnostics' },
        // Schema.org
        { name: 'application-name', content: 'ANT Diagnostics' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'canonical', href: 'https://diagnostics.ant.tv' }
      ],
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            'name': 'ANT Diagnostics',
            'description': 'Интерактивная система диагностики ТВ-приставок',
            'url': 'https://diagnostics.ant.tv',
            'applicationCategory': 'TechnicalSupport',
            'operatingSystem': 'Any',
            'offers': {
              '@type': 'Offer',
              'price': '0',
              'priceCurrency': 'RUB'
            },
            'provider': {
              '@type': 'Organization',
              'name': 'ANT',
              'url': 'https://ant.tv'
            }
          })
        }
      ]
    }
  },
    runtimeConfig: {
    apiSecret: '123',
    public: {
      apiBase: '/api'
    }
  },

  nitro: {
    experimental: {
      wasm: false
    }
  },
  vite: {
    define: {
      __NUXT_DEVTOOLS_DISABLE__: true
    },
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['vue', 'vue-router'],
            'ui': ['@headlessui/vue', '@heroicons/vue'],
            'utils': ['@vueuse/core', 'pinia']
          }
        }
      }
    },
    optimizeDeps: {
      include: ['vue', 'vue-router', '@vueuse/core']
    }
  },
  // Build optimizations
  build: {
    transpile: ['@headlessui/vue', '@heroicons/vue']
  },
  // Route rules for better caching
  routeRules: {
    '/': { prerender: true, headers: { 'cache-control': 's-maxage=31536000' } },
    '/admin/**': { ssr: false },
    '/api/**': { cors: true, headers: { 'cache-control': 'max-age=300' } }
  },
  // Image optimization
  image: {
    domains: ['localhost'],
    formats: ['webp', 'avif'],
    quality: 80
  },
  // Compression and optimization
  compression: {
    algorithm: 'gzip',
    threshold: 1024
  }
})
