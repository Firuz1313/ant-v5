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
  })
})

// SEO
useHead({
  htmlAttrs: {
    lang: 'ru'
  }
})
</script>
