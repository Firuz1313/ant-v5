export default defineNuxtConfig({
  devtools: {
    enabled: process.env.NODE_ENV === 'development',
    vscode: {}
  },
  ssr: true,
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],
  colorMode: {
    classSuffix: '',
    preference: 'light',
    fallback: 'light'
  },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'TV Diagnostics System',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Interactive TV Set-top Box Diagnostic System' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap' }
      ]
    }
  },
    runtimeConfig: {
    apiSecret: '123',
    public: {
      apiBase: '/api'
    }
  },
  experimental: {
    payloadExtraction: false
  },
  nitro: {
    experimental: {
      wasm: false
    }
  }
})
