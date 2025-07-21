<template>
  <div class="p-4 bg-green-100 dark:bg-green-900 rounded-lg border border-green-200 dark:border-green-700">
    <h3 class="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
      Hydration Status
    </h3>
    <div class="space-y-2 text-sm">
      <div class="flex items-center space-x-2">
        <div 
          class="w-3 h-3 rounded-full"
          :class="isHydrated ? 'bg-green-500' : 'bg-yellow-500'"
        ></div>
        <span class="text-green-700 dark:text-green-300">
          {{ isHydrated ? 'Hydrated' : 'Not Hydrated' }}
        </span>
      </div>
      <div v-if="isHydrated" class="text-green-600 dark:text-green-400">
        Current time: {{ currentTime }}
      </div>
    </div>
  </div>
</template>

<script setup>
const { isHydrated, getFormattedTime } = useSSRSafe()

const currentTime = ref('')

watch(isHydrated, (hydrated) => {
  if (hydrated) {
    currentTime.value = getFormattedTime()
    // Update time every second
    setInterval(() => {
      currentTime.value = getFormattedTime()
    }, 1000)
  }
})
</script>
