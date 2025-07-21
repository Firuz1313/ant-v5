export default defineNuxtPlugin(() => {
  // Completely disable DevTools to prevent cross-origin issues
  if (typeof window !== 'undefined') {
    window.__NUXT_DEVTOOLS_DISABLE__ = true
    window.__NUXT_DEVTOOLS_VIEW__ = false
  }

  // Detect if we're running in an iframe
  let isInIframe = false
  try {
    isInIframe = window.self !== window.top
  } catch (e) {
    // If we can't access window.top, we're likely in an iframe
    isInIframe = true
  }

  if (isInIframe) {
    // Add iframe class to body for styling adjustments
    document.body?.classList.add('in-iframe')
  }

  // Comprehensive error handler for cross-origin and DevTools issues
  window.addEventListener('error', (event) => {
    const message = event.message || ''
    if (
      message.includes('cross-origin') ||
      message.includes('__NUXT_DEVTOOLS_DISABLE__') ||
      message.includes('DevTools') ||
      message.includes('Failed to read a named property')
    ) {
      // Prevent these errors from bubbling up
      event.preventDefault()
      event.stopPropagation()
      return false
    }
  }, true)

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason?.message || event.reason || ''
    if (
      reason.includes && (
        reason.includes('cross-origin') ||
        reason.includes('DevTools') ||
        reason.includes('__NUXT_DEVTOOLS_DISABLE__')
      )
    ) {
      event.preventDefault()
      return false
    }
  })

  // Override any potential DevTools initialization
  if (typeof window !== 'undefined') {
    // Prevent DevTools from initializing
    Object.defineProperty(window, '__NUXT_DEVTOOLS_DISABLE__', {
      value: true,
      writable: false,
      configurable: false
    })
  }
})
