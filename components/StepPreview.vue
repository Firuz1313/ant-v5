<template>
  <div class="fixed inset-0 z-50 overflow-hidden bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div class="bg-white dark:bg-dark-100 rounded-xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
            👁️ Предпросмотр диагностики
          </h2>
          <p class="text-gray-600 dark:text-gray-400 mt-1">
            Тестирование пользовательского опыта диагностики
          </p>
        </div>
        
        <div class="flex items-center space-x-4">
          <!-- Mode Toggle -->
          <div class="flex items-center space-x-2">
            <label class="text-sm text-gray-600 dark:text-gray-400">Режим:</label>
            <select
              v-model="previewMode"
              class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 dark:text-white"
            >
              <option value="user">👥 Пользователь</option>
              <option value="operator">👤 Оператор</option>
            </select>
          </div>
          
          <!-- Device Selection -->
          <div class="flex items-center space-x-2">
            <label class="text-sm text-gray-600 dark:text-gray-400">Устройство:</label>
            <select
              v-model="selectedDeviceType"
              class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 dark:text-white"
            >
              <option value="desktop">🖥️ Десктоп</option>
              <option value="mobile">📱 Мобильный</option>
              <option value="tv">📺 Smart TV</option>
            </select>
          </div>
          
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Preview Controls -->
      <div class="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <!-- Step Navigation -->
          <div class="flex items-center space-x-4">
            <button
              @click="previousStep"
              :disabled="currentStepIndex === 0"
              class="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Назад
            </button>
            
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-600 dark:text-gray-400">
                Шаг {{ currentStepIndex + 1 }} из {{ filteredSteps.length }}
              </span>
              
              <!-- Step Selector -->
              <select
                v-model="currentStepIndex"
                class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 dark:text-white"
              >
                <option v-for="(step, index) in filteredSteps" :key="step.id" :value="index">
                  {{ index + 1 }}. {{ step.title }}
                </option>
              </select>
            </div>
            
            <button
              @click="nextStep"
              :disabled="currentStepIndex >= filteredSteps.length - 1"
              class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Далее →
            </button>
          </div>
          
          <!-- Preview Controls -->
          <div class="flex items-center space-x-3">
            <button
              @click="autoPlaySteps"
              :disabled="isAutoPlaying"
              class="btn-secondary text-sm"
            >
              {{ isAutoPlaying ? '⏹️ Стоп' : '▶️ Авто-воспроизведение' }}
            </button>
            
            <button
              @click="resetPreview"
              class="btn-secondary text-sm"
            >
              🔄 Сброс
            </button>
            
            <button
              @click="exportTestResults"
              class="btn-secondary text-sm"
            >
              📊 Экспорт результатов
            </button>
          </div>
        </div>
      </div>

      <!-- Main Preview Area -->
      <div class="flex-1 overflow-hidden">
        <div 
          class="h-full"
          :class="{
            'preview-desktop': selectedDeviceType === 'desktop',
            'preview-mobile': selectedDeviceType === 'mobile',
            'preview-tv': selectedDeviceType === 'tv'
          }"
        >
          <!-- Enhanced Diagnostic Screen Preview -->
          <div class="diagnostic-preview h-full">
            <!-- Progress indicator -->
            <div class="diagnostic-header">
              <div class="flex items-center justify-between">
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  Предпросмотр диагностики
                </div>
                
                <div class="flex items-center space-x-4">
                  <div class="text-center">
                    <span class="text-sm text-gray-600 dark:text-gray-400">
                      Шаг {{ currentStepIndex + 1 }} из {{ filteredSteps.length }}
                    </span>
                  </div>
                  
                  <!-- Progress bar -->
                  <div class="flex items-center space-x-1">
                    <div
                      v-for="(step, index) in filteredSteps.slice(0, 10)"
                      :key="index"
                      class="step-indicator"
                      :class="getStepIndicatorClass(index)"
                      :title="step.title"
                    >
                      <div class="step-number">{{ index + 1 }}</div>
                    </div>
                    <span v-if="filteredSteps.length > 10" class="text-xs text-gray-500">
                      +{{ filteredSteps.length - 10 }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Main diagnostic interface -->
            <div class="diagnostic-main">
              <!-- TV Screen Container -->
              <div class="tv-container">
                <div class="tv-screen">
                  <!-- Current step content -->
                  <div v-if="currentStep.screen_image" class="media-content">
                    <img 
                      :src="currentStep.screen_image" 
                      :alt="currentStep.title"
                      class="media-image"
                    />
                  </div>
                  
                  <!-- Default content -->
                  <div v-else class="default-content">
                    <div class="text-center text-white">
                      <div class="step-icon">{{ getStepIcon(currentStep) }}</div>
                      <p class="step-title">{{ currentStep.title }}</p>
                    </div>
                  </div>
                  
                  <!-- TV overlay information -->
                  <div class="tv-overlay">
                    <div class="device-badge">
                      <span class="device-name">Preview Mode</span>
                      <div class="status-indicator"></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Remote Control Container -->
              <div class="remote-container">
                <div class="remote-card">
                  <div class="remote-header">
                    <h3 class="remote-title">Пульт управления</h3>
                    <div v-if="hasActiveButtons" class="active-indicator">
                      <div class="pulse-dot"></div>
                      <span class="text-xs">��ктивные кнопки</span>
                    </div>
                  </div>
                  
                  <!-- Action instructions -->
                  <div v-if="currentStep.actions && currentStep.actions.length > 0" class="action-instructions">
                    <h4 class="instructions-title">Выполните действия:</h4>
                    <ol class="action-list">
                      <li v-for="(action, index) in currentStep.actions" :key="index" class="action-item">
                        <span class="action-number">{{ index + 1 }}</span>
                        <span class="action-text">{{ action.description }}</span>
                        <div v-if="completedActions.includes(action.buttonId)" class="action-check">
                          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                          </svg>
                        </div>
                      </li>
                    </ol>
                  </div>

                  <!-- Enhanced Remote Control Preview -->
                  <div class="remote-control-wrapper">
                    <EnhancedRemoteControl 
                      :device="{ id: 'preview', name: 'Preview' }"
                      :highlighted-buttons="getHighlightedButtons()"
                      :completed-actions="completedActions"
                      @button-press="handleButtonPress"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Step instructions panel -->
            <div class="step-panel">
              <div class="step-content">
                <div class="step-main">
                  <div class="step-info">
                    <div class="step-header">
                      <h3 class="step-title-main">{{ currentStep.title }}</h3>
                      <div class="step-badges">
                        <span v-if="currentStep.onlyForOperator && previewMode === 'user'" class="severity-badge high">
                          🔒 Только оператор
                        </span>
                        <span v-if="currentStep.critical" class="severity-badge high">
                          ⚠️ Критичный
                        </span>
                      </div>
                    </div>
                    
                    <p class="step-instruction">{{ currentStep.instruction }}</p>
                    
                    <!-- Tip section -->
                    <div v-if="currentStep.tip" class="tip-section">
                      <div class="tip-icon">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                        </svg>
                      </div>
                      <p class="tip-text">{{ currentStep.tip }}</p>
                    </div>

                    <!-- User confirmation section -->
                    <div v-if="currentStep.userConfirmation" class="confirmation-section">
                      <h4 class="confirmation-question">{{ currentStep.userConfirmation.question }}</h4>
                      <div class="confirmation-options">
                        <button
                          v-for="option in currentStep.userConfirmation.options"
                          :key="option.text"
                          @click="handleUserChoice(option)"
                          class="confirmation-button"
                        >
                          {{ option.text }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Navigation controls -->
                <div class="step-navigation">
                  <div class="nav-buttons">
                    <button
                      v-if="currentStepIndex > 0"
                      @click="previousStep"
                      class="nav-button nav-back"
                    >
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                      </svg>
                      <span>Назад</span>
                    </button>
                    
                    <button
                      v-if="canProceedToNext()"
                      @click="nextStep"
                      class="nav-button nav-next"
                      :disabled="!isStepCompleted()"
                    >
                      <span>Далее</span>
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                      </svg>
                    </button>
                    
                    <button
                      v-else-if="isLastStep()"
                      @click="completePreview"
                      class="nav-button nav-complete"
                    >
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                      </svg>
                      <span>Завершить</span>
                    </button>
                  </div>
                  
                  <!-- Progress indicator -->
                  <div class="progress-container">
                    <div class="progress-bar">
                      <div class="progress-fill" :style="{ width: `${progressPercentage}%` }"></div>
                    </div>
                    <span class="progress-text">{{ Math.round(progressPercentage) }}%</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Audio controls -->
            <div v-if="currentStep.audio_url" class="audio-controls">
              <button
                @click="toggleAudio"
                class="audio-button"
                :class="{ 'playing': isPlaying }"
              >
                <svg v-if="isPlaying" class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                </svg>
                <svg v-else class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path>
                </svg>
              </button>
              <audio
                ref="audioPlayer"
                :src="currentStep.audio_url"
                @ended="isPlaying = false"
                @play="isPlaying = true"
                @pause="isPlaying = false"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Analytics Panel -->
      <div class="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <!-- Test Metrics -->
          <div class="text-center">
            <div class="text-2xl font-bold text-primary-600">{{ testMetrics.totalSteps }}</div>
            <div class="text-xs text-gray-600 dark:text-gray-400">Всего шагов</div>
          </div>
          
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">{{ testMetrics.completedSteps }}</div>
            <div class="text-xs text-gray-600 dark:text-gray-400">Пройдено</div>
          </div>
          
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">{{ testMetrics.timeSpent }}с</div>
            <div class="text-xs text-gray-600 dark:text-gray-400">Время теста</div>
          </div>
          
          <div class="text-center">
            <div class="text-2xl font-bold text-purple-600">{{ testMetrics.buttonPresses }}</div>
            <div class="text-xs text-gray-600 dark:text-gray-400">Нажатий кнопок</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  steps: {
    type: Array,
    required: true
  },
  operatorMode: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

// Reactive state
const previewMode = ref(props.operatorMode ? 'operator' : 'user')
const selectedDeviceType = ref('desktop')
const currentStepIndex = ref(0)
const completedActions = ref([])
const isPlaying = ref(false)
const isAutoPlaying = ref(false)
const testStartTime = ref(Date.now())

const testMetrics = ref({
  totalSteps: 0,
  completedSteps: 0,
  timeSpent: 0,
  buttonPresses: 0
})

// Computed properties
const filteredSteps = computed(() => {
  let steps = props.steps || []
  
  // Filter operator-only steps in user mode
  if (previewMode.value === 'user') {
    steps = steps.filter(step => !step.onlyForOperator)
  }
  
  return steps.sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
})

const currentStep = computed(() => {
  return filteredSteps.value[currentStepIndex.value] || {}
})

const hasActiveButtons = computed(() => {
  return getHighlightedButtons().length > 0
})

const progressPercentage = computed(() => {
  if (filteredSteps.value.length === 0) return 0
  return ((currentStepIndex.value + 1) / filteredSteps.value.length) * 100
})

// Methods
const getStepIcon = (step) => {
  if (step.title?.includes('баланс')) return '💳'
  if (step.title?.includes('карту')) return '🎫'
  if (step.title?.includes('антенн')) return '📡'
  if (step.title?.includes('поиск')) return '🔍'
  if (step.title?.includes('сигнал')) return '📶'
  if (step.title?.includes('кабель')) return '🔌'
  if (step.title?.includes('настрой')) return '⚙️'
  return '📺'
}

const getStepIndicatorClass = (index) => {
  if (index < currentStepIndex.value) return 'step-completed'
  if (index === currentStepIndex.value) return 'step-current'
  return 'step-pending'
}

const getHighlightedButtons = () => {
  if (!currentStep.value.actions) {
    return currentStep.value.highlighted_buttons || []
  }
  
  return currentStep.value.actions
    .filter(action => action.buttonId)
    .map(action => action.buttonId)
}

const canProceedToNext = () => {
  return currentStepIndex.value < filteredSteps.value.length - 1 && !currentStep.value.userConfirmation
}

const isLastStep = () => {
  return currentStepIndex.value === filteredSteps.value.length - 1
}

const isStepCompleted = () => {
  if (currentStep.value.actions) {
    const requiredActions = currentStep.value.actions.filter(action => action.buttonId)
    return requiredActions.every(action => 
      completedActions.value.includes(action.buttonId)
    )
  }
  return true
}

const nextStep = () => {
  if (canProceedToNext()) {
    currentStepIndex.value++
    completedActions.value = []
    updateTestMetrics()
  }
}

const previousStep = () => {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--
    completedActions.value = []
  }
}

const handleButtonPress = (buttonId) => {
  testMetrics.value.buttonPresses++
  
  // Add to completed actions if it's a required action
  if (currentStep.value.actions?.some(action => action.buttonId === buttonId)) {
    if (!completedActions.value.includes(buttonId)) {
      completedActions.value.push(buttonId)
    }
  }
  
  // Auto advance if all required actions are completed
  if (isStepCompleted() && !currentStep.value.userConfirmation) {
    setTimeout(() => {
      if (canProceedToNext()) {
        nextStep()
      }
    }, 800)
  }
}

const handleUserChoice = (option) => {
  if (option.action === 'next') {
    nextStep()
  } else if (option.action === 'complete') {
    completePreview()
  }
}

const toggleAudio = () => {
  const player = this.$refs.audioPlayer
  if (isPlaying.value) {
    player.pause()
  } else {
    player.play()
  }
  isPlaying.value = !isPlaying.value
}

const autoPlaySteps = () => {
  if (isAutoPlaying.value) {
    isAutoPlaying.value = false
    return
  }
  
  isAutoPlaying.value = true
  const interval = setInterval(() => {
    if (!isAutoPlaying.value || isLastStep()) {
      clearInterval(interval)
      isAutoPlaying.value = false
      return
    }
    
    // Simulate user actions
    if (currentStep.value.actions) {
      currentStep.value.actions.forEach(action => {
        if (action.buttonId) {
          handleButtonPress(action.buttonId)
        }
      })
    }
    
    setTimeout(() => {
      if (canProceedToNext()) {
        nextStep()
      }
    }, 2000)
  }, 3000)
}

const resetPreview = () => {
  currentStepIndex.value = 0
  completedActions.value = []
  isAutoPlaying.value = false
  testStartTime.value = Date.now()
  testMetrics.value = {
    totalSteps: filteredSteps.value.length,
    completedSteps: 0,
    timeSpent: 0,
    buttonPresses: 0
  }
}

const completePreview = () => {
  updateTestMetrics()
  alert(`Предпросмотр завершен!\n\nСтатистика:\n- Всего шагов: ${testMetrics.value.totalSteps}\n- Пройдено: ${testMetrics.value.completedSteps}\n- Время: ${testMetrics.value.timeSpent}с\n- Нажатий: ${testMetrics.value.buttonPresses}`)
}

const updateTestMetrics = () => {
  testMetrics.value.totalSteps = filteredSteps.value.length
  testMetrics.value.completedSteps = currentStepIndex.value + 1
  testMetrics.value.timeSpent = Math.round((Date.now() - testStartTime.value) / 1000)
}

const exportTestResults = () => {
  const results = {
    testDate: new Date().toISOString(),
    previewMode: previewMode.value,
    deviceType: selectedDeviceType.value,
    metrics: testMetrics.value,
    steps: filteredSteps.value.map((step, index) => ({
      stepIndex: index + 1,
      title: step.title,
      completed: index <= currentStepIndex.value,
      hasMedia: !!step.screen_image,
      hasAudio: !!step.audio_url,
      buttonCount: (step.highlighted_buttons || []).length,
      actionCount: (step.actions || []).length
    }))
  }
  
  const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `preview_test_results_${Date.now()}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Initialize metrics
onMounted(() => {
  resetPreview()
})

// Update metrics periodically
const metricsInterval = setInterval(() => {
  if (testStartTime.value) {
    updateTestMetrics()
  }
}, 1000)

onUnmounted(() => {
  clearInterval(metricsInterval)
})
</script>

<style scoped>
/* Preview device styles */
.preview-desktop {
  @apply p-4;
}

.preview-mobile {
  @apply max-w-sm mx-auto p-2;
}

.preview-tv {
  @apply p-8;
  font-size: 1.125rem;
}

.preview-tv .btn-primary,
.preview-tv .btn-secondary,
.preview-tv .nav-button {
  @apply text-lg py-4 px-8;
}

.preview-tv .step-title-main {
  @apply text-2xl;
}

.preview-tv .step-instruction {
  @apply text-lg;
}

/* Diagnostic preview styles */
.diagnostic-preview {
  @apply flex flex-col h-full;
}

.diagnostic-header {
  @apply flex-shrink-0 p-4 bg-white dark:bg-dark-100 border-b border-gray-200 dark:border-gray-700;
}

.diagnostic-main {
  @apply flex-1 grid gap-6 p-6;
  grid-template-columns: 2fr 1fr;
  min-height: 0;
}

.step-panel {
  @apply flex-shrink-0 bg-white dark:bg-dark-100 border-t border-gray-200 dark:border-gray-700 p-6;
}

/* TV Container */
.tv-container {
  @apply flex items-center justify-center;
  min-height: 0;
}

.tv-screen {
  @apply bg-black rounded-lg border-8 border-gray-800 shadow-2xl relative overflow-hidden;
  aspect-ratio: 16/9;
  width: 100%;
  max-width: 600px;
  max-height: 337px;
}

.media-content {
  @apply w-full h-full;
}

.media-image {
  @apply w-full h-full object-cover;
}

.default-content {
  @apply w-full h-full flex items-center justify-center;
}

.step-icon {
  @apply text-6xl mb-4;
}

.step-title {
  @apply text-lg font-medium mb-4;
}

/* TV Overlay */
.tv-overlay {
  @apply absolute inset-0 pointer-events-none;
}

.device-badge {
  @apply absolute top-4 right-4 bg-black bg-opacity-75 text-white px-3 py-2 rounded flex items-center space-x-2;
}

.device-name {
  @apply text-sm font-medium;
}

.status-indicator {
  @apply w-2 h-2 bg-green-400 rounded-full animate-pulse;
}

/* Remote Container */
.remote-container {
  @apply flex flex-col;
  min-height: 0;
}

.remote-card {
  @apply bg-white dark:bg-dark-100 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 h-full flex flex-col;
}

.remote-header {
  @apply flex items-center justify-between mb-4;
}

.remote-title {
  @apply text-lg font-semibold text-gray-900 dark:text-white;
}

.active-indicator {
  @apply flex items-center space-x-2 text-green-600;
}

.pulse-dot {
  @apply w-2 h-2 bg-green-400 rounded-full animate-pulse;
}

/* Action Instructions */
.action-instructions {
  @apply mb-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg;
}

.instructions-title {
  @apply text-sm font-medium text-blue-800 dark:text-blue-200 mb-2;
}

.action-list {
  @apply space-y-2;
}

.action-item {
  @apply flex items-center space-x-3;
}

.action-number {
  @apply flex-shrink-0 w-6 h-6 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-bold;
}

.action-text {
  @apply flex-1 text-sm text-blue-700 dark:text-blue-300;
}

.action-check {
  @apply flex-shrink-0 text-green-600;
}

.remote-control-wrapper {
  @apply flex-1 flex items-center justify-center;
}

/* Step Panel */
.step-content {
  @apply flex items-center justify-between gap-6;
}

.step-main {
  @apply flex-1;
}

.step-info {
  @apply space-y-4;
}

.step-header {
  @apply flex items-center justify-between;
}

.step-title-main {
  @apply text-xl font-semibold text-gray-900 dark:text-white;
}

.step-badges {
  @apply flex items-center space-x-2;
}

.severity-badge {
  @apply px-2 py-1 text-xs rounded-full font-medium;
}

.severity-badge.high {
  @apply bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100;
}

.step-instruction {
  @apply text-gray-600 dark:text-gray-400 leading-relaxed;
}

.tip-section {
  @apply flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg;
}

.tip-icon {
  @apply flex-shrink-0 text-blue-600;
}

.tip-text {
  @apply text-sm text-blue-800 dark:text-blue-200;
}

.confirmation-section {
  @apply p-4 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg;
}

.confirmation-question {
  @apply text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-3;
}

.confirmation-options {
  @apply space-y-2;
}

.confirmation-button {
  @apply w-full text-left px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-yellow-300 dark:border-yellow-600 rounded hover:bg-yellow-100 dark:hover:bg-yellow-800 transition-colors;
}

/* Navigation */
.step-navigation {
  @apply flex flex-col space-y-4;
}

.nav-buttons {
  @apply flex items-center space-x-3;
}

.nav-button {
  @apply flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200;
}

.nav-back {
  @apply bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white;
}

.nav-next {
  @apply bg-primary-600 hover:bg-primary-700 text-white disabled:opacity-50 disabled:cursor-not-allowed;
}

.nav-complete {
  @apply bg-green-600 hover:bg-green-700 text-white;
}

.progress-container {
  @apply flex items-center space-x-3;
}

.progress-bar {
  @apply flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden;
}

.progress-fill {
  @apply h-full bg-primary-600 transition-all duration-500 ease-out;
}

.progress-text {
  @apply text-sm font-medium text-gray-600 dark:text-gray-400;
}

/* Step Indicators */
.step-indicator {
  @apply relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300;
}

.step-number {
  @apply relative z-10;
}

.step-completed {
  @apply bg-green-500 text-white;
}

.step-current {
  @apply bg-primary-600 text-white ring-4 ring-primary-200 dark:ring-primary-800;
}

.step-pending {
  @apply bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400;
}

/* Audio Controls */
.audio-controls {
  @apply fixed bottom-6 right-6 z-50;
}

.audio-button {
  @apply bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-full shadow-lg transition-all duration-200;
}

.audio-button.playing {
  @apply bg-green-600 hover:bg-green-700;
}

/* Responsive */
@media (max-width: 1024px) {
  .diagnostic-main {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto;
  }
  
  .step-content {
    @apply flex-col space-y-4;
  }
}
</style>
