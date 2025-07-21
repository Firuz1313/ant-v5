<template>
  <div
    :class="[
      'relative transition-all duration-200 cursor-pointer',
      {
        'ring-4 ring-yellow-400 ring-opacity-75 animate-pulse': highlighted
      }
    ]"
    @click="handleClick"
  >
    <slot />
    
    <!-- Highlight indicator -->
    <div v-if="highlighted" class="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
  </div>
</template>

<script setup>
const props = defineProps({
  buttonId: {
    type: String,
    required: true
  },
  highlighted: {
    type: Boolean,
    default: false
  }
})

const handleClick = () => {
  // In preview mode, just log the button press
  console.log('Preview button pressed:', props.buttonId)
}
</script>

<style scoped>
/* Button highlighting animation */
@keyframes glow-pulse {
  0%, 100% {
    box-shadow: 0 0 10px rgba(255, 255, 0, 0.3);
  }
  50% {
    box-shadow: 0 0 25px rgba(255, 255, 0, 0.6);
  }
}

.highlighted {
  animation: glow-pulse 2s infinite;
}
</style>
