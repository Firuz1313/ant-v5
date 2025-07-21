<template>
  <div class="remote-control">
    <!-- Remote Control Body -->
    <div class="bg-gray-900 rounded-3xl p-6 shadow-2xl max-w-xs mx-auto">
      <!-- Power Button -->
      <div class="text-center mb-6">
        <RemoteButton
          id="power"
          :highlighted="highlightedButton === 'power'"
          @press="$emit('button-press', 'power')"
          class="w-12 h-12 bg-red-600 hover:bg-red-700 rounded-full mx-auto"
        >
          <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 012 0v6a1 1 0 11-2 0V7zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V7z" clip-rule="evenodd"></path>
          </svg>
        </RemoteButton>
        <p class="text-white text-xs mt-1">POWER</p>
      </div>

      <!-- Source/Input Button -->
      <div class="text-center mb-6">
        <RemoteButton
          id="source"
          :highlighted="highlightedButton === 'source'"
          @press="$emit('button-press', 'source')"
          class="w-10 h-8 bg-blue-600 hover:bg-blue-700 rounded mx-auto"
        >
          <span class="text-white text-xs font-semibold">SRC</span>
        </RemoteButton>
        <p class="text-white text-xs mt-1">SOURCE</p>
      </div>

      <!-- Navigation Pad -->
      <div class="relative w-32 h-32 mx-auto mb-6">
        <!-- Center OK button -->
        <RemoteButton
          id="ok"
          :highlighted="highlightedButton === 'ok'"
          @press="$emit('button-press', 'ok')"
          class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center"
        >
          <span class="text-white text-xs font-semibold">OK</span>
        </RemoteButton>

        <!-- Up -->
        <RemoteButton
          id="up"
          :highlighted="highlightedButton === 'up'"
          @press="$emit('button-press', 'up')"
          class="absolute top-0 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center"
        >
          <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd"></path>
          </svg>
        </RemoteButton>

        <!-- Down -->
        <RemoteButton
          id="down"
          :highlighted="highlightedButton === 'down'"
          @press="$emit('button-press', 'down')"
          class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center"
        >
          <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </RemoteButton>

        <!-- Left -->
        <RemoteButton
          id="left"
          :highlighted="highlightedButton === 'left'"
          @press="$emit('button-press', 'left')"
          class="absolute left-0 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center"
        >
          <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path>
          </svg>
        </RemoteButton>

        <!-- Right -->
        <RemoteButton
          id="right"
          :highlighted="highlightedButton === 'right'"
          @press="$emit('button-press', 'right')"
          class="absolute right-0 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center"
        >
          <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
          </svg>
        </RemoteButton>
      </div>

      <!-- Menu Button -->
      <div class="text-center mb-4">
        <RemoteButton
          id="menu"
          :highlighted="highlightedButton === 'menu'"
          @press="$emit('button-press', 'menu')"
          class="w-16 h-8 bg-purple-600 hover:bg-purple-700 rounded mx-auto"
        >
          <span class="text-white text-xs font-semibold">MENU</span>
        </RemoteButton>
      </div>

      <!-- Volume Controls -->
      <div class="flex justify-between items-center mb-4">
        <div class="text-center">
          <RemoteButton
            id="vol-down"
            :highlighted="highlightedButton === 'vol-down'"
            @press="$emit('button-press', 'vol-down')"
            class="w-12 h-8 bg-gray-700 hover:bg-gray-600 rounded"
          >
            <span class="text-white text-xs">VOL-</span>
          </RemoteButton>
        </div>
        <div class="text-center">
          <RemoteButton
            id="vol-up"
            :highlighted="highlightedButton === 'vol-up'"
            @press="$emit('button-press', 'vol-up')"
            class="w-12 h-8 bg-gray-700 hover:bg-gray-600 rounded"
          >
            <span class="text-white text-xs">VOL+</span>
          </RemoteButton>
        </div>
      </div>

      <!-- Channel Controls -->
      <div class="flex justify-between items-center mb-4">
        <div class="text-center">
          <RemoteButton
            id="ch-down"
            :highlighted="highlightedButton === 'ch-down'"
            @press="$emit('button-press', 'ch-down')"
            class="w-12 h-8 bg-gray-700 hover:bg-gray-600 rounded"
          >
            <span class="text-white text-xs">CH-</span>
          </RemoteButton>
        </div>
        <div class="text-center">
          <RemoteButton
            id="ch-up"
            :highlighted="highlightedButton === 'ch-up'"
            @press="$emit('button-press', 'ch-up')"
            class="w-12 h-8 bg-gray-700 hover:bg-gray-600 rounded"
          >
            <span class="text-white text-xs">CH+</span>
          </RemoteButton>
        </div>
      </div>

      <!-- Number Pad -->
      <div class="grid grid-cols-3 gap-2 mb-4">
        <RemoteButton
          v-for="num in 9"
          :key="num"
          :id="`num-${num}`"
          :highlighted="highlightedButton === `num-${num}`"
          @press="$emit('button-press', `num-${num}`)"
          class="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm font-semibold flex items-center justify-center"
        >
          {{ num }}
        </RemoteButton>
      </div>

      <!-- 0 Button -->
      <div class="text-center">
        <RemoteButton
          id="num-0"
          :highlighted="highlightedButton === 'num-0'"
          @press="$emit('button-press', 'num-0')"
          class="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm font-semibold flex items-center justify-center mx-auto"
        >
          0
        </RemoteButton>
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
  highlightedButton: {
    type: String,
    default: null
  }
})

defineEmits(['button-press'])
</script>
