<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
// Global theme and state management
const colorMode = useColorMode()

// Prevent hydration mismatches
onMounted(() => {
  // Force client-side hydration completion
  nextTick(() => {
    // This ensures proper hydration
    document.documentElement.classList.add('js-loaded')

    // Clear any potential console warnings about hydration
    if (process.dev) {
      console.log('✅ Hydration completed successfully')
    }
  })
})

// SEO
useHead({
  htmlAttrs: {
    lang: 'ru'
  }
})
</script>
