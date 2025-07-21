<template>
  <button
    :class="[
      'remote-button transition-all duration-200 focus:outline-none',
      {
        'highlighted ring-4 ring-yellow-400 ring-opacity-75': highlighted,
        'button-press': isPressed
      }
    ]"
    @click="handlePress"
    @mousedown="isPressed = true"
    @mouseup="isPressed = false"
    @mouseleave="isPressed = false"
  >
    <slot />
  </button>
</template>

<script setup>
const props = defineProps({
  id: {
    type: String,
    required: true
  },
  highlighted: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['press'])

const isPressed = ref(false)

const handlePress = () => {
  // Visual feedback
  isPressed.value = true
  
  // Emit press event
  emit('press', props.id)
  
  // Reset pressed state
  setTimeout(() => {
    isPressed.value = false
  }, 150)
}

// Watch for highlighted changes to add pulsing effect
watch(() => props.highlighted, (newVal) => {
  if (newVal) {
    // Add pulsing animation when highlighted
    nextTick(() => {
      const element = getCurrentInstance()?.proxy?.$el
      if (element) {
        element.classList.add('animate-pulse')
      }
    })
  }
})
</script>
