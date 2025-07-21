<template>
  <div class="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div class="bg-white dark:bg-dark-100 rounded-xl shadow-2xl max-w-6xl w-full max-h-screen overflow-y-auto">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            👁️ Предпросмотр диагностики
          </h3>
          <div class="flex items-center space-x-3">
            <button
              @click="toggleOperatorMode"
              :class="[
                'px-3 py-1 rounded text-sm font-medium transition-colors',
                operatorMode 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-gray-200 text-gray-700'
              ]"
            >
              {{ operatorMode ? '👤 Оператор' : '👥 Пользователь' }}
            </button>
            <button
              @click="$emit('close')"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Preview Content -->
      <div class="p-6">
        <!-- Step selector -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Выберите шаг для предпросмотра:
          </label>
          <select
            v-model="selectedStepIndex"
            class="w-full max-w-md px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
          >
            <option 
              v-for="(step, index) in visibleSteps" 
              :key="step.id" 
              :value="index"
              :disabled="step.onlyForOperator && !operatorMode"
            >
              Шаг {{ step.order_index }}: {{ step.title }}
              {{ step.onlyForOperator ? ' 🔒' : '' }}
            </option>
          </select>
        </div>

        <!-- Preview Interface -->
        <div v-if="currentStep" class="border rounded-lg p-6 bg-gray-50 dark:bg-gray-800">
          <!-- Progress indicator -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-600 dark:text-gray-400">
                Шаг {{ selectedStepIndex + 1 }} из {{ visibleSteps.length }}
              </span>
              <span v-if="currentStep.onlyForOperator" class="px-2 py-1 text-xs bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100 rounded-full">
                🔒 Только для оператора
              </span>
            </div>
            <div class="flex space-x-1">
              <div
                v-for="(step, index) in visibleSteps"
                :key="index"
                class="w-3 h-3 rounded-full transition-colors"
                :class="getStepIndicatorClass(index)"
                :title="step.title"
              />
            </div>
          </div>

          <!-- Main content area -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- TV Screen -->
            <div class="tv-screen-container">
              <div class="tv-screen bg-black rounded-lg border-8 border-gray-800 shadow-2xl relative overflow-hidden" style="aspect-ratio: 16/9;">
                <!-- Media content -->
                <div v-if="currentStep.media" class="w-full h-full">
                  <video 
                    v-if="currentStep.media.type === 'video'" 
                    :src="currentStep.media.url" 
                    class="w-full h-full object-cover"
                    controls
                    muted
                  />
                  <img 
                    v-else-if="currentStep.media.type === 'animation'" 
                    :src="currentStep.media.url" 
                    :alt="currentStep.media.description"
                    class="w-full h-full object-cover"
                  />
                  <img 
                    v-else-if="currentStep.media.type === 'image'" 
                    :src="currentStep.media.url" 
                    :alt="currentStep.title"
                    class="w-full h-full object-cover"
                  />
                </div>
                
                <!-- Screen image -->
                <img
                  v-else-if="currentStep.screen_image"
                  :src="currentStep.screen_image"
                  :alt="currentStep.title"
                  class="w-full h-full object-cover"
                />
                
                <!-- Fallback content -->
                <div v-else class="w-full h-full flex items-center justify-center">
                  <div class="text-center text-white">
                    <div class="text-4xl mb-2">📺</div>
                    <p class="text-sm">{{ currentStep.title }}</p>
                  </div>
                </div>
                
                <!-- TV overlay -->
                <div class="absolute top-4 right-4 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                  Preview Mode
                </div>
              </div>
            </div>

            <!-- Remote Control -->
            <div class="remote-container">
              <div class="card p-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
                  Пульт управления
                </h3>
                
                <!-- Action instructions -->
                <div v-if="currentStep.actions && currentStep.actions.length > 0" class="mb-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                  <h4 class="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">Выполните действия:</h4>
                  <ol class="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li v-for="(action, index) in currentStep.actions" :key="index" class="flex items-center space-x-2">
                      <span class="flex-shrink-0 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                        {{ index + 1 }}
                      </span>
                      <span>{{ action.description }}</span>
                    </li>
                  </ol>
                </div>

                <!-- Simplified remote -->
                <div class="bg-gray-900 rounded-2xl p-4 max-w-xs mx-auto">
                  <!-- Power -->
                  <div class="text-center mb-4">
                    <PreviewRemoteButton
                      button-id="power"
                      :highlighted="isButtonHighlighted('power')"
                      class="w-10 h-10 bg-red-600 rounded-full mx-auto"
                    >
                      ⏻
                    </PreviewRemoteButton>
                    <p class="text-white text-xs mt-1">POWER</p>
                  </div>

                  <!-- Navigation -->
                  <div class="relative w-24 h-24 mx-auto mb-4">
                    <PreviewRemoteButton
                      button-id="ok"
                      :highlighted="isButtonHighlighted('ok')"
                      class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center"
                    >
                      <span class="text-white text-xs">OK</span>
                    </PreviewRemoteButton>

                    <PreviewRemoteButton
                      button-id="up"
                      :highlighted="isButtonHighlighted('up')"
                      class="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gray-700 rounded flex items-center justify-center"
                    >
                      ↑
                    </PreviewRemoteButton>

                    <PreviewRemoteButton
                      button-id="down"
                      :highlighted="isButtonHighlighted('down')"
                      class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gray-700 rounded flex items-center justify-center"
                    >
                      ↓
                    </PreviewRemoteButton>

                    <PreviewRemoteButton
                      button-id="left"
                      :highlighted="isButtonHighlighted('left')"
                      class="absolute left-0 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gray-700 rounded flex items-center justify-center"
                    >
                      ←
                    </PreviewRemoteButton>

                    <PreviewRemoteButton
                      button-id="right"
                      :highlighted="isButtonHighlighted('right')"
                      class="absolute right-0 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gray-700 rounded flex items-center justify-center"
                    >
                      →
                    </PreviewRemoteButton>
                  </div>

                  <!-- Menu buttons -->
                  <div class="grid grid-cols-2 gap-2 mb-4">
                    <PreviewRemoteButton
                      button-id="menu"
                      :highlighted="isButtonHighlighted('menu')"
                      class="h-6 bg-purple-600 rounded text-white text-xs flex items-center justify-center"
                    >
                      MENU
                    </PreviewRemoteButton>
                    <PreviewRemoteButton
                      button-id="exit"
                      :highlighted="isButtonHighlighted('exit')"
                      class="h-6 bg-red-500 rounded text-white text-xs flex items-center justify-center"
                    >
                      EXIT
                    </PreviewRemoteButton>
                  </div>

                  <!-- Number pad (simplified) -->
                  <div class="grid grid-cols-3 gap-1">
                    <PreviewRemoteButton
                      v-for="num in 9"
                      :key="num"
                      :button-id="`num-${num}`"
                      :highlighted="isButtonHighlighted(`num-${num}`)"
                      class="h-6 bg-gray-700 rounded text-white text-xs flex items-center justify-center"
                    >
                      {{ num }}
                    </PreviewRemoteButton>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Step instructions -->
          <div class="mt-6 card p-4">
            <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div class="flex-1">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {{ currentStep.title }}
                </h3>
                <p class="text-gray-600 dark:text-gray-400 mb-4">
                  {{ currentStep.instruction }}
                </p>
                
                <!-- Tip -->
                <div v-if="currentStep.tip" class="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-3 mb-4">
                  <div class="flex items-start space-x-2">
                    <svg class="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                    </svg>
                    <p class="text-sm text-blue-800 dark:text-blue-200">
                      {{ currentStep.tip }}
                    </p>
                  </div>
                </div>

                <!-- User confirmation -->
                <div v-if="currentStep.userConfirmation" class="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mb-4">
                  <h4 class="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-3">
                    {{ currentStep.userConfirmation.question }}
                  </h4>
                  <div class="space-y-2">
                    <button
                      v-for="option in currentStep.userConfirmation.options"
                      :key="option.text"
                      class="w-full text-left px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-yellow-300 dark:border-yellow-600 rounded hover:bg-yellow-100 dark:hover:bg-yellow-800 transition-colors"
                    >
                      {{ option.text }}
                    </button>
                  </div>
                </div>

                <!-- Alternative scenario -->
                <div v-if="currentStep.ifNoResult" class="bg-purple-50 dark:bg-purple-900 border border-purple-200 dark:border-purple-700 rounded-lg p-3">
                  <div class="flex items-start space-x-2">
                    <svg class="w-5 h-5 text-purple-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                    </svg>
                    <div>
                      <p class="text-sm font-medium text-purple-800 dark:text-purple-200">
                        Если не помогло:
                      </p>
                      <p class="text-sm text-purple-700 dark:text-purple-300">
                        {{ currentStep.ifNoResult.description }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Navigation buttons -->
              <div class="flex items-center space-x-3 lg:ml-6">
                <button
                  v-if="selectedStepIndex > 0"
                  @click="previousStep"
                  class="btn-secondary"
                >
                  ← Назад
                </button>
                <button
                  v-if="selectedStepIndex < visibleSteps.length - 1"
                  @click="nextStep"
                  class="btn-primary"
                >
                  Далее →
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- No steps message -->
        <div v-else class="text-center py-12 text-gray-500">
          <div class="text-4xl mb-4">📋</div>
          <p>Нет доступных шагов для предпросмотра</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  steps: {
    type: Array,
    default: () => []
  },
  operatorMode: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

// Reactive state
const selectedStepIndex = ref(0)
const localOperatorMode = ref(props.operatorMode)

// Computed properties
const operatorMode = computed({
  get: () => localOperatorMode.value,
  set: (value) => { localOperatorMode.value = value }
})

const visibleSteps = computed(() => {
  return props.steps.filter(step => 
    !step.onlyForOperator || operatorMode.value
  )
})

const currentStep = computed(() => {
  return visibleSteps.value[selectedStepIndex.value] || null
})

// Methods
const toggleOperatorMode = () => {
  operatorMode.value = !operatorMode.value
  // Reset step selection when switching modes
  selectedStepIndex.value = 0
}

const getStepIndicatorClass = (index) => {
  if (index < selectedStepIndex.value) return 'bg-green-500'
  if (index === selectedStepIndex.value) return 'bg-primary-500'
  return 'bg-gray-300 dark:bg-gray-600'
}

const isButtonHighlighted = (buttonId) => {
  if (!currentStep.value) return false
  
  // Check in actions
  if (currentStep.value.actions) {
    return currentStep.value.actions.some(action => action.buttonId === buttonId)
  }
  
  // Check in highlighted_buttons
  if (currentStep.value.highlighted_buttons) {
    return currentStep.value.highlighted_buttons.includes(buttonId)
  }
  
  return false
}

const nextStep = () => {
  if (selectedStepIndex.value < visibleSteps.value.length - 1) {
    selectedStepIndex.value++
  }
}

const previousStep = () => {
  if (selectedStepIndex.value > 0) {
    selectedStepIndex.value--
  }
}

// Watch for prop changes
watch(() => props.operatorMode, (newVal) => {
  operatorMode.value = newVal
})
</script>

<style scoped>
.tv-screen {
  aspect-ratio: 16/9;
}

.remote-container {
  max-width: 300px;
  margin: 0 auto;
}
</style>
