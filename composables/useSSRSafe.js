/**
 * SSR-safe composable to prevent hydration mismatches
 */
export const useSSRSafe = () => {
  const isClient = process.client
  const isHydrated = ref(false)

  onMounted(() => {
    isHydrated.value = true
  })

  /**
   * Get current timestamp in a way that's consistent between server and client
   */
  const getTimestamp = () => {
    if (!isHydrated.value) {
      return 0 // Default value for SSR
    }
    return Date.now()
  }

  /**
   * Get formatted date in a way that's consistent between server and client
   */
  const getFormattedDate = (date = null) => {
    if (!isHydrated.value) {
      return '' // Default value for SSR
    }
    const targetDate = date || new Date()
    return targetDate.toLocaleDateString('ru-RU')
  }

  /**
   * Get formatted time in a way that's consistent between server and client
   */
  const getFormattedTime = (date = null) => {
    if (!isHydrated.value) {
      return '' // Default value for SSR
    }
    const targetDate = date || new Date()
    return targetDate.toLocaleTimeString('ru-RU')
  }

  /**
   * Generate deterministic "random" values based on a seed
   */
  const getDeterministicValue = (seed, min = 0, max = 100) => {
    // Simple hash function for deterministic pseudo-random
    const hash = seed.toString().split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0)
      return a & a
    }, 0)
    return Math.abs(hash) % (max - min) + min
  }

  return {
    isClient,
    isHydrated: readonly(isHydrated),
    getTimestamp,
    getFormattedDate,
    getFormattedTime,
    getDeterministicValue
  }
}
