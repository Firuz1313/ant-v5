export default defineNuxtPlugin(() => {
  // Detect if we're running in an iframe
  const isInIframe = window.self !== window.top

  if (isInIframe) {
    // Disable DevTools in iframe to prevent cross-origin errors
    window.__NUXT_DEVTOOLS_DISABLE__ = true
    
    // Add iframe class to body for styling adjustments
    document.body.classList.add('in-iframe')
    
    // Prevent iframe from trying to access parent window
    try {
      // Override console methods to prevent cross-origin access
      const originalConsoleLog = console.log
      console.log = (...args) => {
        try {
          originalConsoleLog.apply(console, args)
        } catch (e) {
          // Silently handle cross-origin console errors
        }
      }
    } catch (e) {
      // Ignore cross-origin access errors
    }
  }

  // Add global error handler for cross-origin issues
  window.addEventListener('error', (event) => {
    if (event.message && event.message.includes('cross-origin')) {
      // Prevent cross-origin errors from bubbling up
      event.preventDefault()
      event.stopPropagation()
      return false
    }
  })

  // Handle unhandled promise rejections from cross-origin issues
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && event.reason.message && event.reason.message.includes('cross-origin')) {
      event.preventDefault()
      return false
    }
  })
})
