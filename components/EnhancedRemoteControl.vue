<template>
  <div class="remote-control">
    <!-- Enhanced Remote Control Body -->
    <div class="bg-gray-900 rounded-3xl p-6 shadow-2xl max-w-xs mx-auto relative">
      <!-- Power Button -->
      <div class="text-center mb-6">
        <EnhancedRemoteButton
          id="power"
          :highlighted="isButtonHighlighted('power')"
          :completed="isButtonCompleted('power')"
          @press="$emit('button-press', 'power')"
          class="w-12 h-12 bg-red-600 hover:bg-red-700 rounded-full mx-auto"
          :class="getButtonClasses('power')"
        >
          <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 012 0v6a1 1 0 11-2 0V7zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V7z" clip-rule="evenodd"></path>
          </svg>
        </EnhancedRemoteButton>
        <p class="text-white text-xs mt-1 font-medium">POWER</p>
      </div>

      <!-- Source/Input Button -->
      <div class="text-center mb-6">
        <EnhancedRemoteButton
          id="source"
          :highlighted="isButtonHighlighted('source')"
          :completed="isButtonCompleted('source')"
          @press="$emit('button-press', 'source')"
          class="w-10 h-8 bg-blue-600 hover:bg-blue-700 rounded mx-auto"
          :class="getButtonClasses('source')"
        >
          <span class="text-white text-xs font-semibold">SRC</span>
        </EnhancedRemoteButton>
        <p class="text-white text-xs mt-1">SOURCE</p>
      </div>

      <!-- Navigation Pad with enhanced highlighting -->
      <div class="relative w-32 h-32 mx-auto mb-6">
        <!-- Center OK button -->
        <EnhancedRemoteButton
          id="ok"
          :highlighted="isButtonHighlighted('ok')"
          :completed="isButtonCompleted('ok')"
          @press="$emit('button-press', 'ok')"
          class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center"
          :class="getButtonClasses('ok')"
        >
          <span class="text-white text-xs font-semibold">OK</span>
        </EnhancedRemoteButton>

        <!-- Up -->
        <EnhancedRemoteButton
          id="up"
          :highlighted="isButtonHighlighted('up')"
          :completed="isButtonCompleted('up')"
          @press="$emit('button-press', 'up')"
          class="absolute top-0 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center"
          :class="getButtonClasses('up')"
        >
          <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd"></path>
          </svg>
        </EnhancedRemoteButton>

        <!-- Down -->
        <EnhancedRemoteButton
          id="down"
          :highlighted="isButtonHighlighted('down')"
          :completed="isButtonCompleted('down')"
          @press="$emit('button-press', 'down')"
          class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center"
          :class="getButtonClasses('down')"
        >
          <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </EnhancedRemoteButton>

        <!-- Left -->
        <EnhancedRemoteButton
          id="left"
          :highlighted="isButtonHighlighted('left')"
          :completed="isButtonCompleted('left')"
          @press="$emit('button-press', 'left')"
          class="absolute left-0 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center"
          :class="getButtonClasses('left')"
        >
          <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path>
          </svg>
        </EnhancedRemoteButton>

        <!-- Right -->
        <EnhancedRemoteButton
          id="right"
          :highlighted="isButtonHighlighted('right')"
          :completed="isButtonCompleted('right')"
          @press="$emit('button-press', 'right')"
          class="absolute right-0 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center"
          :class="getButtonClasses('right')"
        >
          <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
          </svg>
        </EnhancedRemoteButton>
      </div>

      <!-- INFO Button (for signal checking) -->
      <div class="text-center mb-4">
        <EnhancedRemoteButton
          id="info"
          :highlighted="isButtonHighlighted('info')"
          :completed="isButtonCompleted('info')"
          @press="$emit('button-press', 'info')"
          class="w-16 h-8 bg-cyan-600 hover:bg-cyan-700 rounded mx-auto"
          :class="getButtonClasses('info')"
        >
          <span class="text-white text-xs font-semibold">INFO</span>
        </EnhancedRemoteButton>
        <p class="text-white text-xs mt-1">INFO</p>
      </div>

      <!-- Menu Button -->
      <div class="text-center mb-4">
        <EnhancedRemoteButton
          id="menu"
          :highlighted="isButtonHighlighted('menu')"
          :completed="isButtonCompleted('menu')"
          @press="$emit('button-press', 'menu')"
          class="w-16 h-8 bg-purple-600 hover:bg-purple-700 rounded mx-auto"
          :class="getButtonClasses('menu')"
        >
          <span class="text-white text-xs font-semibold">MENU</span>
        </EnhancedRemoteButton>
        <p class="text-white text-xs mt-1">MENU</p>
      </div>

      <!-- Exit Button -->
      <div class="text-center mb-4">
        <EnhancedRemoteButton
          id="exit"
          :highlighted="isButtonHighlighted('exit')"
          :completed="isButtonCompleted('exit')"
          @press="$emit('button-press', 'exit')"
          class="w-16 h-8 bg-red-500 hover:bg-red-600 rounded mx-auto"
          :class="getButtonClasses('exit')"
        >
          <span class="text-white text-xs font-semibold">EXIT</span>
        </EnhancedRemoteButton>
        <p class="text-white text-xs mt-1">EXIT</p>
      </div>

      <!-- Volume Controls -->
      <div class="flex justify-between items-center mb-4">
        <div class="text-center">
          <EnhancedRemoteButton
            id="vol-down"
            :highlighted="isButtonHighlighted('vol-down')"
            :completed="isButtonCompleted('vol-down')"
            @press="$emit('button-press', 'vol-down')"
            class="w-12 h-8 bg-gray-700 hover:bg-gray-600 rounded"
            :class="getButtonClasses('vol-down')"
          >
            <span class="text-white text-xs">VOL-</span>
          </EnhancedRemoteButton>
        </div>
        <div class="text-center">
          <EnhancedRemoteButton
            id="vol-up"
            :highlighted="isButtonHighlighted('vol-up')"
            :completed="isButtonCompleted('vol-up')"
            @press="$emit('button-press', 'vol-up')"
            class="w-12 h-8 bg-gray-700 hover:bg-gray-600 rounded"
            :class="getButtonClasses('vol-up')"
          >
            <span class="text-white text-xs">VOL+</span>
          </EnhancedRemoteButton>
        </div>
      </div>

      <!-- Channel Controls -->
      <div class="flex justify-between items-center mb-4">
        <div class="text-center">
          <EnhancedRemoteButton
            id="ch-down"
            :highlighted="isButtonHighlighted('ch-down')"
            :completed="isButtonCompleted('ch-down')"
            @press="$emit('button-press', 'ch-down')"
            class="w-12 h-8 bg-gray-700 hover:bg-gray-600 rounded"
            :class="getButtonClasses('ch-down')"
          >
            <span class="text-white text-xs">CH-</span>
          </EnhancedRemoteButton>
        </div>
        <div class="text-center">
          <EnhancedRemoteButton
            id="ch-up"
            :highlighted="isButtonHighlighted('ch-up')"
            :completed="isButtonCompleted('ch-up')"
            @press="$emit('button-press', 'ch-up')"
            class="w-12 h-8 bg-gray-700 hover:bg-gray-600 rounded"
            :class="getButtonClasses('ch-up')"
          >
            <span class="text-white text-xs">CH+</span>
          </EnhancedRemoteButton>
        </div>
      </div>

      <!-- Number Pad -->
      <div class="grid grid-cols-3 gap-2 mb-4">
        <EnhancedRemoteButton
          v-for="num in 9"
          :key="num"
          :id="`num-${num}`"
          :highlighted="isButtonHighlighted(`num-${num}`)"
          :completed="isButtonCompleted(`num-${num}`)"
          @press="$emit('button-press', `num-${num}`)"
          class="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm font-semibold flex items-center justify-center"
          :class="getButtonClasses(`num-${num}`)"
        >
          {{ num }}
        </EnhancedRemoteButton>
      </div>

      <!-- 0 Button -->
      <div class="text-center">
        <EnhancedRemoteButton
          id="num-0"
          :highlighted="isButtonHighlighted('num-0')"
          :completed="isButtonCompleted('num-0')"
          @press="$emit('button-press', 'num-0')"
          class="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm font-semibold flex items-center justify-center mx-auto"
          :class="getButtonClasses('num-0')"
        >
          0
        </EnhancedRemoteButton>
      </div>

      <!-- Multi-button highlight indicator -->
      <div v-if="hasMultipleHighlights" class="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-bold animate-pulse">
        {{ highlightedButtons.length }} кнопок
      </div>
    </div>

    <!-- Action sequence indicator -->
    <div v-if="hasSequentialActions" class="mt-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
      <h4 class="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">Последовательность действий:</h4>
      <div class="flex items-center space-x-2 overflow-x-auto">
        <div
          v-for="(buttonId, index) in highlightedButtons"
          :key="buttonId"
          class="flex items-center space-x-1 flex-shrink-0"
        >
          <div 
            class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
            :class="{
              'bg-green-500 text-white': isButtonCompleted(buttonId),
              'bg-yellow-400 text-yellow-900': isButtonHighlighted(buttonId) && !isButtonCompleted(buttonId),
              'bg-gray-300 text-gray-600': !isButtonHighlighted(buttonId) && !isButtonCompleted(buttonId)
            }"
          >
            <svg v-if="isButtonCompleted(buttonId)" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            <span v-else>{{ index + 1 }}</span>
          </div>
          <svg v-if="index < highlightedButtons.length - 1" class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  device: {
    type: Object,
    required: true
  },
  highlightedButtons: {
    type: Array,
    default: () => []
  },
  completedActions: {
    type: Array,
    default: () => []
  }
})

defineEmits(['button-press'])

// Enhanced computed properties
const hasMultipleHighlights = computed(() => {
  return props.highlightedButtons.length > 1
})

const hasSequentialActions = computed(() => {
  return props.highlightedButtons.length > 1
})

// Enhanced methods
const isButtonHighlighted = (buttonId) => {
  return props.highlightedButtons.includes(buttonId)
}

const isButtonCompleted = (buttonId) => {
  return props.completedActions.includes(buttonId)
}

const getButtonClasses = (buttonId) => {
  const classes = []
  
  if (isButtonHighlighted(buttonId)) {
    classes.push('ring-4 ring-yellow-400 ring-opacity-75 animate-pulse')
  }
  
  if (isButtonCompleted(buttonId)) {
    classes.push('ring-4 ring-green-400 ring-opacity-75 bg-green-600')
  }
  
  return classes.join(' ')
}
</script>

<style scoped>
/* Enhanced button animations */
.remote-button {
  transition: all 0.2s ease-in-out;
}

.remote-button:hover {
  transform: scale(1.05);
}

.remote-button.highlighted {
  animation: pulse-glow 2s infinite;
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 5px rgba(255, 255, 0, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(255, 255, 0, 0.8);
  }
}

.remote-button.completed {
  animation: success-flash 0.5s ease-in-out;
}

@keyframes success-flash {
  0% { 
    background-color: rgb(34, 197, 94); 
    transform: scale(1.1);
  }
  100% { 
    transform: scale(1);
  }
}
</style>
