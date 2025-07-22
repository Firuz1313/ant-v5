import { ref, onMounted, nextTick } from 'vue'

export function usePerformance() {
  const isLoading = ref(true)
  const performanceMetrics = ref({})

  // Lazy loading for images
  const lazyLoadImages = () => {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target
            if (img.dataset.src) {
              img.src = img.dataset.src
              img.classList.remove('lazy')
              observer.unobserve(img)
            }
          }
        })
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      })

      // Observe all lazy images
      const lazyImages = document.querySelectorAll('img[data-src]')
      lazyImages.forEach(img => imageObserver.observe(img))

      return () => {
        lazyImages.forEach(img => imageObserver.unobserve(img))
      }
    }
  }

  // Preload critical resources
  const preloadCriticalResources = () => {
    const criticalResources = [
      { href: '/fonts/inter.woff2', as: 'font', type: 'font/woff2' },
      { href: '/fonts/poppins.woff2', as: 'font', type: 'font/woff2' }
    ]

    criticalResources.forEach(resource => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = resource.href
      link.as = resource.as
      if (resource.type) link.type = resource.type
      if (resource.as === 'font') link.crossOrigin = 'anonymous'
      document.head.appendChild(link)
    })
  }

  // Cache management
  const cacheManager = {
    set(key, data, ttl = 3600000) { // 1 hour default
      const item = {
        data,
        timestamp: Date.now(),
        ttl
      }
      try {
        localStorage.setItem(`ant_cache_${key}`, JSON.stringify(item))
      } catch (e) {
        console.warn('Cache storage failed:', e)
      }
    },

    get(key) {
      try {
        const item = localStorage.getItem(`ant_cache_${key}`)
        if (!item) return null

        const parsed = JSON.parse(item)
        const now = Date.now()

        if (now - parsed.timestamp > parsed.ttl) {
          localStorage.removeItem(`ant_cache_${key}`)
          return null
        }

        return parsed.data
      } catch (e) {
        console.warn('Cache retrieval failed:', e)
        return null
      }
    },

    clear(prefix = '') {
      try {
        Object.keys(localStorage)
          .filter(key => key.startsWith(`ant_cache_${prefix}`))
          .forEach(key => localStorage.removeItem(key))
      } catch (e) {
        console.warn('Cache clear failed:', e)
      }
    }
  }

  // Performance monitoring
  const measurePerformance = () => {
    if ('performance' in window) {
      const timing = performance.timing
      const navigation = performance.getEntriesByType('navigation')[0]

      performanceMetrics.value = {
        // Page load times
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        pageLoad: timing.loadEventEnd - timing.navigationStart,
        firstPaint: navigation?.responseStart - navigation?.requestStart || 0,
        
        // Resource timing
        dns: timing.domainLookupEnd - timing.domainLookupStart,
        tcp: timing.connectEnd - timing.connectStart,
        request: timing.responseStart - timing.requestStart,
        response: timing.responseEnd - timing.responseStart,
        
        // Modern metrics (if available)
        fcp: 0, // First Contentful Paint
        lcp: 0, // Largest Contentful Paint
        fid: 0, // First Input Delay
        cls: 0  // Cumulative Layout Shift
      }

      // Measure Core Web Vitals if supported
      if ('PerformanceObserver' in window) {
        // First Contentful Paint
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach(entry => {
            if (entry.name === 'first-contentful-paint') {
              performanceMetrics.value.fcp = entry.startTime
            }
          })
        }).observe({ entryTypes: ['paint'] })

        // Largest Contentful Paint
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          performanceMetrics.value.lcp = lastEntry.startTime
        }).observe({ entryTypes: ['largest-contentful-paint'] })

        // First Input Delay
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach(entry => {
            performanceMetrics.value.fid = entry.processingStart - entry.startTime
          })
        }).observe({ entryTypes: ['first-input'] })

        // Cumulative Layout Shift
        new PerformanceObserver((list) => {
          let cls = 0
          list.getEntries().forEach(entry => {
            if (!entry.hadRecentInput) {
              cls += entry.value
            }
          })
          performanceMetrics.value.cls = cls
        }).observe({ entryTypes: ['layout-shift'] })
      }
    }
  }

  // Resource hints
  const addResourceHints = () => {
    const hints = [
      { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
      { rel: 'dns-prefetch', href: '//fonts.gstatic.com' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true }
    ]

    hints.forEach(hint => {
      if (!document.querySelector(`link[href="${hint.href}"]`)) {
        const link = document.createElement('link')
        Object.assign(link, hint)
        document.head.appendChild(link)
      }
    })
  }

  // Optimize images with WebP fallback
  const optimizeImages = () => {
    const images = document.querySelectorAll('img:not([data-optimized])')
    
    images.forEach(img => {
      const supportsWebP = () => {
        const canvas = document.createElement('canvas')
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
      }

      if (supportsWebP() && img.src && !img.src.includes('.webp')) {
        const webpSrc = img.src.replace(/\.(jpg|jpeg|png)$/i, '.webp')
        
        // Test if WebP version exists
        const testImg = new Image()
        testImg.onload = () => {
          img.src = webpSrc
        }
        testImg.onerror = () => {
          // Keep original if WebP not available
        }
        testImg.src = webpSrc
      }
      
      img.setAttribute('data-optimized', 'true')
    })
  }

  // Reduce layout shifts
  const preventLayoutShift = () => {
    // Add aspect ratio to images without dimensions
    const images = document.querySelectorAll('img:not([width]):not([height])')
    images.forEach(img => {
      img.style.aspectRatio = '16/9'
      img.style.objectFit = 'cover'
    })

    // Reserve space for dynamic content
    const dynamicContainers = document.querySelectorAll('[data-dynamic]')
    dynamicContainers.forEach(container => {
      if (!container.style.minHeight) {
        container.style.minHeight = '200px'
      }
    })
  }

  // Service Worker registration
  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js')
        console.log('Service Worker registered:', registration)
        
        // Update available
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content available, show update notification
              if (confirm('Доступно обновление. Обновить страницу?')) {
                window.location.reload()
              }
            }
          })
        })
      } catch (error) {
        console.error('Service Worker registration failed:', error)
      }
    }
  }

  // Initialize performance optimizations
  const initializePerformance = async () => {
    isLoading.value = true

    try {
      // Add resource hints
      addResourceHints()
      
      // Preload critical resources
      preloadCriticalResources()
      
      // Wait for DOM to be ready
      await nextTick()
      
      // Initialize lazy loading
      lazyLoadImages()
      
      // Optimize images
      optimizeImages()
      
      // Prevent layout shifts
      preventLayoutShift()
      
      // Measure performance
      setTimeout(measurePerformance, 1000)
      
      // Register service worker
      await registerServiceWorker()
      
    } catch (error) {
      console.error('Performance initialization failed:', error)
    } finally {
      isLoading.value = false
    }
  }

  // Cleanup function
  const cleanup = () => {
    // Clear performance observers
    if ('PerformanceObserver' in window) {
      // Performance observers are automatically cleaned up
    }
  }

  return {
    isLoading: readonly(isLoading),
    performanceMetrics: readonly(performanceMetrics),
    cacheManager,
    initializePerformance,
    cleanup,
    lazyLoadImages,
    optimizeImages,
    measurePerformance
  }
}

// Auto-initialize on app load
export function useAutoPerformance() {
  const performance = usePerformance()
  
  onMounted(async () => {
    await performance.initializePerformance()
  })
  
  onUnmounted(() => {
    performance.cleanup()
  })
  
  return performance
}
