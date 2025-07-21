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

// SEO
useHead({
  htmlAttrs: {
    lang: 'ru'
  }
})
</script>
