<template>
  <button
    :class="[
      'remote-button transition-all duration-200 focus:outline-none relative',
      {
        'highlighted': highlighted && !completed,
        'completed': completed,
        'button-press': isPressed
      }
    ]"
    @click="handlePress"
    @mousedown="isPressed = true"
    @mouseup="isPressed = false"
    @mouseleave="isPressed = false"
  >
    <slot />
    
    <!-- Completion indicator -->
    <div v-if="completed" class="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
      <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
      </svg>
    </div>
    
    <!-- Highlight indicator -->
    <div v-if="highlighted && !completed" class="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
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
  },
  completed: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['press'])

const isPressed = ref(false)

const handlePress = () => {
  // Visual feedback
  isPressed.value = true
  
  // Haptic feedback if available
  if (navigator.vibrate) {
    navigator.vibrate(50)
  }
  
  // Emit press event
  emit('press', props.id)
  
  // Reset pressed state
  setTimeout(() => {
    isPressed.value = false
  }, 150)
}

// Watch for highlighted changes to add special effects
watch(() => props.highlighted, (newVal) => {
  if (newVal && !props.completed) {
    // Add special highlighting effect
    nextTick(() => {
      const element = getCurrentInstance()?.proxy?.$el
      if (element) {
        element.classList.add('animate-pulse')
      }
    })
  }
})

// Watch for completion changes
watch(() => props.completed, (newVal) => {
  if (newVal) {
    // Add completion effect
    nextTick(() => {
      const element = getCurrentInstance()?.proxy?.$el
      if (element) {
        element.classList.add('completion-flash')
        setTimeout(() => {
          element.classList.remove('completion-flash')
        }, 500)
      }
    })
  }
})
</script>

<style scoped>
.remote-button {
  @apply relative cursor-pointer transition-all duration-200;
}

.remote-button:hover {
  transform: scale(1.05);
}

.remote-button.highlighted {
  @apply ring-4 ring-yellow-400 ring-opacity-75;
  animation: glow-pulse 2s infinite;
}

.remote-button.completed {
  @apply ring-4 ring-green-400 ring-opacity-75;
}

.remote-button.button-press {
  transform: scale(0.95);
}

.completion-flash {
  animation: completion-flash 0.5s ease-in-out;
}

@keyframes glow-pulse {
  0%, 100% {
    box-shadow: 0 0 10px rgba(255, 255, 0, 0.3);
  }
  50% {
    box-shadow: 0 0 25px rgba(255, 255, 0, 0.6);
  }
}

@keyframes completion-flash {
  0% {
    background-color: rgb(34, 197, 94);
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

/* Button press animation */
@keyframes button-press {
  0% { transform: scale(1); }
  50% { transform: scale(0.95); }
  100% { transform: scale(1); }
}

.button-press {
  animation: button-press 0.3s ease-in-out;
}
</style>
