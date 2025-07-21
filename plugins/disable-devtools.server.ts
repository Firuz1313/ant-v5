export default defineNuxtPlugin(() => {
  // Ensure DevTools is disabled on server-side as well
  if (process.server) {
    // Set global flag to disable DevTools
    globalThis.__NUXT_DEVTOOLS_DISABLE__ = true
  }
})
