import { ref, onMounted, onUnmounted } from 'vue'

export function useSmartTVNavigation() {
  const isSmartTV = ref(false)
  const currentFocusIndex = ref(0)
  const focusableElements = ref([])

  // Detect Smart TV environment
  const detectSmartTV = () => {
    const userAgent = navigator.userAgent.toLowerCase()
    const isLargeScreen = window.screen.width >= 1920 && window.screen.height >= 1080
    const hasTVIndicators = userAgent.includes('tv') || 
                           userAgent.includes('smart') || 
                           userAgent.includes('tizen') || 
                           userAgent.includes('webos') ||
                           userAgent.includes('roku') ||
                           userAgent.includes('opera tv')
    
    return isLargeScreen || hasTVIndicators
  }

  // Get all focusable elements
  const updateFocusableElements = () => {
    const selectors = [
      'button:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      'a[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '.remote-button:not([disabled])',
      '.device-card',
      '.error-card'
    ].join(', ')

    focusableElements.value = Array.from(document.querySelectorAll(selectors))
  }

  // Focus management
  const focusElement = (index) => {
    if (focusableElements.value[index]) {
      focusableElements.value[index].focus()
      currentFocusIndex.value = index
    }
  }

  const focusNext = () => {
    const nextIndex = (currentFocusIndex.value + 1) % focusableElements.value.length
    focusElement(nextIndex)
  }

  const focusPrevious = () => {
    const prevIndex = currentFocusIndex.value - 1 < 0 
      ? focusableElements.value.length - 1 
      : currentFocusIndex.value - 1
    focusElement(prevIndex)
  }

  const focusUp = () => {
    // Smart grid navigation logic
    const currentElement = focusableElements.value[currentFocusIndex.value]
    const currentRect = currentElement?.getBoundingClientRect()
    
    if (!currentRect) return

    // Find element above with similar x position
    let closestElement = null
    let closestDistance = Infinity

    focusableElements.value.forEach((element, index) => {
      if (index === currentFocusIndex.value) return
      
      const rect = element.getBoundingClientRect()
      
      // Check if element is above current element
      if (rect.bottom <= currentRect.top) {
        const distance = Math.abs((rect.left + rect.width / 2) - (currentRect.left + currentRect.width / 2)) +
                        Math.abs(rect.bottom - currentRect.top)
        
        if (distance < closestDistance) {
          closestDistance = distance
          closestElement = index
        }
      }
    })

    if (closestElement !== null) {
      focusElement(closestElement)
    }
  }

  const focusDown = () => {
    // Smart grid navigation logic
    const currentElement = focusableElements.value[currentFocusIndex.value]
    const currentRect = currentElement?.getBoundingClientRect()
    
    if (!currentRect) return

    // Find element below with similar x position
    let closestElement = null
    let closestDistance = Infinity

    focusableElements.value.forEach((element, index) => {
      if (index === currentFocusIndex.value) return
      
      const rect = element.getBoundingClientRect()
      
      // Check if element is below current element
      if (rect.top >= currentRect.bottom) {
        const distance = Math.abs((rect.left + rect.width / 2) - (currentRect.left + currentRect.width / 2)) +
                        Math.abs(rect.top - currentRect.bottom)
        
        if (distance < closestDistance) {
          closestDistance = distance
          closestElement = index
        }
      }
    })

    if (closestElement !== null) {
      focusElement(closestElement)
    }
  }

  const focusLeft = () => {
    // Find nearest element to the left
    const currentElement = focusableElements.value[currentFocusIndex.value]
    const currentRect = currentElement?.getBoundingClientRect()
    
    if (!currentRect) return

    let closestElement = null
    let closestDistance = Infinity

    focusableElements.value.forEach((element, index) => {
      if (index === currentFocusIndex.value) return
      
      const rect = element.getBoundingClientRect()
      
      // Check if element is to the left
      if (rect.right <= currentRect.left && 
          rect.top < currentRect.bottom && 
          rect.bottom > currentRect.top) {
        const distance = currentRect.left - rect.right +
                        Math.abs((rect.top + rect.height / 2) - (currentRect.top + currentRect.height / 2))
        
        if (distance < closestDistance) {
          closestDistance = distance
          closestElement = index
        }
      }
    })

    if (closestElement !== null) {
      focusElement(closestElement)
    }
  }

  const focusRight = () => {
    // Find nearest element to the right
    const currentElement = focusableElements.value[currentFocusIndex.value]
    const currentRect = currentElement?.getBoundingClientRect()
    
    if (!currentRect) return

    let closestElement = null
    let closestDistance = Infinity

    focusableElements.value.forEach((element, index) => {
      if (index === currentFocusIndex.value) return
      
      const rect = element.getBoundingClientRect()
      
      // Check if element is to the right
      if (rect.left >= currentRect.right && 
          rect.top < currentRect.bottom && 
          rect.bottom > currentRect.top) {
        const distance = rect.left - currentRect.right +
                        Math.abs((rect.top + rect.height / 2) - (currentRect.top + currentRect.height / 2))
        
        if (distance < closestDistance) {
          closestDistance = distance
          closestElement = index
        }
      }
    })

    if (closestElement !== null) {
      focusElement(closestElement)
    }
  }

  // Keyboard event handler
  const handleKeyDown = (event) => {
    if (!isSmartTV.value) return

    updateFocusableElements()

    switch (event.code) {
      case 'ArrowUp':
        event.preventDefault()
        focusUp()
        break
      case 'ArrowDown':
        event.preventDefault()
        focusDown()
        break
      case 'ArrowLeft':
        event.preventDefault()
        focusLeft()
        break
      case 'ArrowRight':
        event.preventDefault()
        focusRight()
        break
      case 'Tab':
        event.preventDefault()
        if (event.shiftKey) {
          focusPrevious()
        } else {
          focusNext()
        }
        break
      case 'Enter':
      case 'Space':
        // Allow default behavior for activation
        break
      case 'Escape':
        // Handle back navigation
        const backButton = document.querySelector('[data-action="back"]')
        if (backButton) {
          backButton.click()
        }
        break
      case 'Backspace':
        event.preventDefault()
        // Handle back navigation
        const backBtn = document.querySelector('[data-action="back"]')
        if (backBtn) {
          backBtn.click()
        }
        break
    }
  }

  // Remote control specific handlers
  const handleRemoteControl = (event) => {
    if (!isSmartTV.value) return

    // Map remote control keys to actions
    const remoteKeyMap = {
      'MediaPlayPause': () => {
        const audioButton = document.querySelector('.audio-button')
        if (audioButton) audioButton.click()
      },
      'MediaStop': () => {
        const audioButton = document.querySelector('.audio-button.playing')
        if (audioButton) audioButton.click()
      },
      'ChannelUp': () => focusUp(),
      'ChannelDown': () => focusDown(),
      'VolumeUp': () => {
        const nextButton = document.querySelector('[data-action="next"]')
        if (nextButton && !nextButton.disabled) nextButton.click()
      },
      'VolumeDown': () => {
        const prevButton = document.querySelector('[data-action="previous"]')
        if (prevButton) prevButton.click()
      }
    }

    if (remoteKeyMap[event.code]) {
      event.preventDefault()
      remoteKeyMap[event.code]()
    }
  }

  // Enhanced focus styles for Smart TV
  const addSmartTVStyles = () => {
    if (!isSmartTV.value) return

    const style = document.createElement('style')
    style.textContent = `
      /* Enhanced focus for Smart TV */
      *:focus {
        outline: 3px solid #fbbf24 !important;
        outline-offset: 2px !important;
        box-shadow: 0 0 0 6px rgba(251, 191, 36, 0.3) !important;
      }

      /* Larger interactive areas for TV remote */
      .remote-button {
        min-width: 44px !important;
        min-height: 44px !important;
      }

      /* Enhanced card focus */
      .device-card:focus,
      .error-card:focus {
        transform: scale(1.05) !important;
        z-index: 10 !important;
      }

      /* Smooth transitions for TV */
      * {
        transition: all 0.2s ease !important;
      }

      /* Cursor hiding for TV */
      body {
        cursor: none !important;
      }

      /* Enhanced button states */
      button:focus,
      .btn-primary:focus,
      .btn-secondary:focus {
        transform: scale(1.05) !important;
      }
    `
    document.head.appendChild(style)
  }

  // Initialize Smart TV navigation
  const initializeSmartTV = () => {
    isSmartTV.value = detectSmartTV()
    
    if (isSmartTV.value) {
      // Add Smart TV specific styles
      addSmartTVStyles()
      
      // Set initial focus
      setTimeout(() => {
        updateFocusableElements()
        if (focusableElements.value.length > 0) {
          focusElement(0)
        }
      }, 100)

      // Add event listeners
      document.addEventListener('keydown', handleKeyDown, true)
      document.addEventListener('keydown', handleRemoteControl, true)
      
      // Update focusable elements on DOM changes
      const observer = new MutationObserver(() => {
        updateFocusableElements()
      })
      
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['disabled', 'tabindex']
      })

      return () => {
        document.removeEventListener('keydown', handleKeyDown, true)
        document.removeEventListener('keydown', handleRemoteControl, true)
        observer.disconnect()
      }
    }
  }

  // Lifecycle management
  onMounted(() => {
    const cleanup = initializeSmartTV()
    
    onUnmounted(() => {
      if (cleanup) cleanup()
    })
  })

  return {
    isSmartTV: readonly(isSmartTV),
    focusNext,
    focusPrevious,
    focusUp,
    focusDown,
    focusLeft,
    focusRight,
    updateFocusableElements
  }
}
