<template>
  <div class="diagnostic-screen">
    <!-- Progress indicator with enhanced step visualization -->
    <div class="diagnostic-header">
      <div class="flex items-center justify-between">
        <button @click="$emit('back')" class="btn-secondary flex items-center space-x-2" data-action="back" :class="{ 'tv-button-enhanced': isSmartTV }">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path>
          </svg>
          <span>Назад к ошибкам</span>
        </button>
        
        <div class="flex items-center space-x-4">
          <div class="text-center">
            <span class="text-sm text-gray-600 dark:text-gray-400">
              Шаг {{ currentStep + 1 }} из {{ steps.length }}
            </span>
            <div class="text-xs text-gray-500 dark:text-gray-500">
              {{ device.name }} - {{ error.title }}
            </div>
          </div>
          
          <!-- Progress bar with step indicators -->
          <div class="flex items-center space-x-1">
            <div
              v-for="(step, index) in steps"
              :key="index"
              class="step-indicator"
              :class="getStepIndicatorClass(index)"
              :title="step.title"
            >
              <div class="step-number">{{ index + 1 }}</div>
              <div v-if="step.severity === 'high'" class="step-priority"></div>
            </div>
          </div>
        </div>
        
        <button @click="$emit('restart')" class="btn-secondary flex items-center space-x-2" :class="{ 'tv-button-enhanced': isSmartTV }">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"></path>
          </svg>
          <span>Начать заново</span>
        </button>
      </div>
    </div>

    <!-- Main diagnostic interface - Fixed height layout -->
    <div class="diagnostic-main">
      <!-- TV Screen Container -->
      <div class="tv-container">
        <div class="tv-screen">
          <!-- Media content display -->
          <div v-if="currentStepData.media" class="media-content">
            <video 
              v-if="currentStepData.media.type === 'video'" 
              :src="currentStepData.media.url" 
              class="media-video"
              controls
              autoplay
              muted
              loop
            />
            <img 
              v-else-if="currentStepData.media.type === 'gif' || currentStepData.media.type === 'animation'" 
              :src="currentStepData.media.url" 
              :alt="currentStepData.media.description || currentStepData.title"
              class="media-image"
            />
            <img 
              v-else-if="currentStepData.media.type === 'image'" 
              :src="currentStepData.media.url" 
              :alt="currentStepData.title"
              class="media-image"
            />
          </div>
          
          <!-- Fallback screen image -->
          <img
            v-else-if="currentStepData.screenImage || currentStepData.screen_image"
            :src="currentStepData.screenImage || currentStepData.screen_image"
            :alt="currentStepData.title"
            class="screen-image"
          />
          
          <!-- Default content with enhanced visuals -->
          <div v-else class="default-content">
            <div class="text-center text-white">
              <div class="step-icon">{{ getStepIcon(currentStepData) }}</div>
              <p class="step-title">{{ currentStepData.title }}</p>
              <div class="signal-indicator">
                <div v-for="n in 4" :key="n" class="signal-bar" :style="{ animationDelay: `${n * 0.1}s` }" />
              </div>
            </div>
          </div>
          
          <!-- TV overlay information -->
          <div class="tv-overlay">
            <div class="device-badge">
              <span class="device-name">{{ device.name }}</span>
              <div class="status-indicator"></div>
            </div>
            
            <!-- Step status overlay -->
            <div v-if="currentStepData.validation" class="validation-overlay">
              <div class="validation-info">
                <div v-if="currentStepData.validation.signalLevel" class="validation-item">
                  <span class="label">Уровень:</span>
                  <span class="value">{{ signalLevel }}%</span>
                  <div class="signal-bar-container">
                    <div class="signal-bar-fill" :style="{ width: `${signalLevel}%` }"></div>
                  </div>
                </div>
                <div v-if="currentStepData.validation.signalQuality" class="validation-item">
                  <span class="label">Качество:</span>
                  <span class="value">{{ signalQuality }}%</span>
                  <div class="signal-bar-container">
                    <div class="signal-bar-fill" :style="{ width: `${signalQuality}%` }"></div>
                  </div>
                </div>
              </div>
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
              <span class="text-xs">Активные кнопки</span>
            </div>
          </div>
          
          <!-- Action instructions -->
          <div v-if="currentStepData.actions && currentStepData.actions.length > 0" class="action-instructions">
            <h4 class="instructions-title">Выполните действия:</h4>
            <ol class="action-list">
              <li v-for="(action, index) in currentStepData.actions" :key="index" class="action-item">
                <span class="action-number">{{ index + 1 }}</span>
                <span class="action-text">{{ action.description }}</span>
                <div v-if="isActionCompleted(action.buttonId)" class="action-check">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                </div>
              </li>
            </ol>
          </div>

          <!-- Enhanced Remote Control -->
          <div class="remote-control-wrapper">
            <EnhancedRemoteControl 
              :device="device"
              :highlighted-buttons="getHighlightedButtons()"
              :completed-actions="completedActions"
              @button-press="handleButtonPress"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Fixed step instructions panel -->
    <div class="step-panel">
      <div class="step-content">
        <div class="step-main">
          <div class="step-info">
            <div class="step-header">
              <h3 class="step-title-main">{{ currentStepData.title }}</h3>
              <div class="step-badges">
                <span v-if="currentStepData.severity === 'high'" class="severity-badge high">
                  Критичный
                </span>
                <span v-else-if="currentStepData.severity === 'medium'" class="severity-badge medium">
                  Важный
                </span>
                <span v-if="currentStepData.estimatedTime" class="time-badge">
                  ~{{ currentStepData.estimatedTime }} мин
                </span>
              </div>
            </div>
            
            <p class="step-instruction">{{ currentStepData.instruction }}</p>
            
            <!-- Enhanced tip section -->
            <div v-if="currentStepData.tip" class="tip-section">
              <div class="tip-icon">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <p class="tip-text">{{ currentStepData.tip }}</p>
            </div>

            <!-- User confirmation section -->
            <div v-if="currentStepData.userConfirmation" class="confirmation-section">
              <h4 class="confirmation-question">{{ currentStepData.userConfirmation.question }}</h4>
              <div class="confirmation-options">
                <button
                  v-for="option in currentStepData.userConfirmation.options"
                  :key="option.text"
                  @click="handleUserChoice(option)"
                  class="confirmation-button"
                  :class="{ 'tv-button-enhanced': isSmartTV }"
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
              v-if="currentStep > 0"
              @click="previousStep"
              class="nav-button nav-back"
              data-action="previous"
              :class="{ 'tv-button-enhanced': isSmartTV }"
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
              data-action="next"
              :class="{ 'tv-button-enhanced': isSmartTV }"
            >
              <span>Далее</span>
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
              </svg>
            </button>
            
            <button
              v-else-if="isLastStep()"
              @click="completeDiagnostic"
              class="nav-button nav-complete"
              :class="{ 'tv-button-enhanced': isSmartTV }"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span>Завершить</span>
            </button>

            <button
              v-if="currentStepData.ifNoResult"
              @click="handleNoResult"
              class="nav-button nav-alternative"
              :class="{ 'tv-button-enhanced': isSmartTV }"
            >
              <span>Не помогло</span>
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

    <!-- Enhanced audio controls -->
    <div v-if="currentStepData.audioUrl || currentStepData.audio_url" class="audio-controls">
      <button
        @click="toggleAudio"
        class="audio-button"
        :class="{ 'playing': isPlaying }"
        :title="isPlaying ? 'Остановить озвучку' : 'Воспроизвести озвучку'"
      >
        <svg v-if="isPlaying" class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
        </svg>
        <svg v-else class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path>
        </svg>
        <div v-if="isPlaying" class="audio-indicator"></div>
      </button>
      <audio
        ref="audioPlayer"
        :src="currentStepData.audioUrl || currentStepData.audio_url"
        @ended="isPlaying = false"
        @play="isPlaying = true"
        @pause="isPlaying = false"
      />
    </div>
  </div>
</template>

<script setup>
// Smart TV navigation support (optional)
let isSmartTV = ref(false)
let updateFocusableElements = () => {}

try {
  const smartTVNavigation = useSmartTVNavigation()
  isSmartTV = smartTVNavigation.isSmartTV
  updateFocusableElements = smartTVNavigation.updateFocusableElements
} catch (error) {
  console.warn('Smart TV navigation not available:', error)
}

const props = defineProps({
  device: {
    type: Object,
    required: true
  },
  error: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['back', 'restart'])

// Reactive state
const steps = ref([])
const currentStep = ref(0)
const isPlaying = ref(false)
const audioPlayer = ref(null)
const completedActions = ref([])
const signalLevel = ref(75)
const signalQuality = ref(85)

// Enhanced computed properties
const currentStepData = computed(() => {
  if (!steps.value || steps.value.length === 0) return {}
  return steps.value[currentStep.value] || {}
})

const hasActiveButtons = computed(() => {
  return getHighlightedButtons().length > 0
})

const progressPercentage = computed(() => {
  if (steps.value.length === 0) return 0
  return ((currentStep.value + 1) / steps.value.length) * 100
})

// Enhanced methods
const getStepIcon = (step) => {
  if (step.title?.includes('Проверить баланс')) return '💳'
  if (step.title?.includes('карту')) return '🎫'
  if (step.title?.includes('антенн')) return '📡'
  if (step.title?.includes('поиск')) return '🔍'
  if (step.title?.includes('сигнал')) return '📶'
  if (step.title?.includes('кабель')) return '🔌'
  if (step.title?.includes('настрой')) return '⚙️'
  if (step.title?.includes('переключ')) return '🔄'
  return '📺'
}

const getStepIndicatorClass = (index) => {
  if (index < currentStep.value) return 'step-completed'
  if (index === currentStep.value) return 'step-current'
  return 'step-pending'
}

const getHighlightedButtons = () => {
  if (!currentStepData.value.actions) {
    return currentStepData.value.highlighted_buttons || []
  }
  
  return currentStepData.value.actions
    .filter(action => action.buttonId)
    .map(action => action.buttonId)
}

const isActionCompleted = (buttonId) => {
  return completedActions.value.includes(buttonId)
}

const canProceedToNext = () => {
  return currentStep.value < steps.value.length - 1 && !currentStepData.value.userConfirmation
}

const isLastStep = () => {
  return currentStep.value === steps.value.length - 1
}

const isStepCompleted = () => {
  if (currentStepData.value.actions) {
    const requiredActions = currentStepData.value.actions.filter(action => action.buttonId)
    return requiredActions.every(action => 
      completedActions.value.includes(action.buttonId)
    )
  }
  return true
}

const nextStep = () => {
  if (canProceedToNext()) {
    currentStep.value++
    completedActions.value = []
    // Update focusable elements after step change
    nextTick(() => updateFocusableElements())
  }
}

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
    completedActions.value = []
    // Update focusable elements after step change
    nextTick(() => updateFocusableElements())
  }
}

const handleButtonPress = (buttonId) => {
  console.log('Button pressed:', buttonId)
  
  // Add button press animation effect
  const button = document.querySelector(`[data-button-id="${buttonId}"]`)
  if (button) {
    button.classList.add('button-press')
    setTimeout(() => button.classList.remove('button-press'), 300)
  }
  
  // Add to completed actions if it's a required action
  if (currentStepData.value.actions?.some(action => action.buttonId === buttonId)) {
    if (!completedActions.value.includes(buttonId)) {
      completedActions.value.push(buttonId)
    }
  }
  
  // Auto advance if all required actions are completed
  if (isStepCompleted() && !currentStepData.value.userConfirmation) {
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
    completeDiagnostic()
  } else if (typeof option.action === 'number') {
    currentStep.value = Math.min(option.action - 1, steps.value.length - 1)
  }
}

const handleNoResult = () => {
  if (currentStepData.value.ifNoResult) {
    const nextStepId = currentStepData.value.ifNoResult.nextStepId
    const foundStep = steps.value.findIndex(step => step.id == nextStepId)
    if (foundStep !== -1) {
      currentStep.value = foundStep
    }
  }
}

const completeDiagnostic = () => {
  alert('Диагностика завершена! Если проблема не решена, обратитесь к специалисту.')
  emit('restart')
}

const toggleAudio = () => {
  if (audioPlayer.value) {
    if (isPlaying.value) {
      audioPlayer.value.pause()
    } else {
      audioPlayer.value.play()
    }
  }
}

// Load diagnostic steps
onMounted(async () => {
  try {
    const stepsData = await $fetch(`/api/steps/${props.device.id}/${props.error.id}`)
    steps.value = stepsData.map(step => ({
      ...step,
      highlightedButton: step.highlighted_button,
      screenImage: step.screen_image,
      audioUrl: step.audio_url
    }))
  } catch (error) {
    console.error('Failed to load steps:', error)
    // Fallback data
    steps.value = [
      {
        id: 1,
        title: 'Проверка подключения',
        instruction: 'Убе��итесь, что все кабели подключены правильно. Нажмите кнопку POWER на пульте.',
        tip: 'Проверьте, что антенный кабель плотно подключен к приставке.',
        highlighted_buttons: ['power'],
        actions: [{ buttonId: 'power', description: 'Нажмите кнопку питания' }],
        audioUrl: null
      },
      {
        id: 2,
        title: 'Проверка сигнала',
        instruction: 'Нажмите кнопку INFO для просмотра информации о сигнале.',
        tip: 'Уровень сигнала должен быть выше 60%.',
        highlighted_buttons: ['info'],
        actions: [{ buttonId: 'info', description: 'Нажмите кнопку INFO' }],
        validation: { signalLevel: true, signalQuality: true },
        audioUrl: null
      },
      {
        id: 3,
        title: 'Завершение диагностики',
        instruction: 'Диагностика завершена. Проблема должна быть решена.',
        tip: 'Если проблема не решена, обратитесь к техподдержке.',
        highlighted_buttons: [],
        actions: [],
        audioUrl: null
      }
    ]
  }
})

// Meta tags
useHead({
  title: `Диагностика ${props.device.name} - ${props.error.title}`,
})
</script>

<style scoped>
/* Main layout - No scroll design */
.diagnostic-screen {
  @apply min-h-screen flex flex-col;
  height: 100vh;
  overflow: hidden;
}

.diagnostic-header {
  @apply flex-shrink-0 p-4 bg-white dark:bg-dark-100 border-b border-gray-200 dark:border-gray-700;
}

.diagnostic-main {
  @apply flex-1 grid gap-6 p-6;
  grid-template-columns: 2fr 1fr;
  min-height: 0; /* Important for flex layout */
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
  max-width: 800px;
  max-height: 450px;
}

.media-content {
  @apply w-full h-full;
}

.media-video,
.media-image,
.screen-image {
  @apply w-full h-full object-cover;
}

.default-content {
  @apply w-full h-full flex items-center justify-center;
}

.step-icon {
  @apply text-6xl mb-4;
  animation: icon-float 3s ease-in-out infinite;
}

.step-title {
  @apply text-lg font-medium mb-4;
}

.signal-indicator {
  @apply flex items-end justify-center space-x-1;
}

.signal-bar {
  @apply w-1 bg-green-400 rounded-t;
  animation: signal-pulse 1.5s ease-in-out infinite;
}

.signal-bar:nth-child(1) { height: 0.5rem; }
.signal-bar:nth-child(2) { height: 1rem; }
.signal-bar:nth-child(3) { height: 1.5rem; }
.signal-bar:nth-child(4) { height: 2rem; }

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

.validation-overlay {
  @apply absolute bottom-4 left-4 bg-black bg-opacity-75 text-white p-4 rounded;
}

.validation-info {
  @apply space-y-3;
}

.validation-item {
  @apply flex items-center space-x-3;
}

.label {
  @apply text-sm text-gray-300;
}

.value {
  @apply text-sm font-mono font-bold;
}

.signal-bar-container {
  @apply w-16 h-2 bg-gray-600 rounded-full overflow-hidden;
}

.signal-bar-fill {
  @apply h-full bg-green-400 transition-all duration-500;
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

.severity-badge.medium {
  @apply bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100;
}

.time-badge {
  @apply px-2 py-1 text-xs bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100 rounded-full;
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

.nav-alternative {
  @apply bg-orange-500 hover:bg-orange-600 text-white text-sm;
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

.step-priority {
  @apply absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full;
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
  @apply bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 relative;
}

.audio-button.playing {
  @apply bg-green-600 hover:bg-green-700;
}

.audio-indicator {
  @apply absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .diagnostic-main {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto;
  }
  
  .step-content {
    @apply flex-col space-y-4;
  }
  
  .step-navigation {
    @apply flex-row items-center justify-between;
  }
  
  .nav-buttons {
    @apply space-x-2;
  }
  
  .nav-button {
    @apply px-3 py-2 text-sm;
  }
}

@media (max-width: 768px) {
  .diagnostic-header {
    @apply p-3;
  }
  
  .diagnostic-main {
    @apply p-3 gap-3;
  }
  
  .step-panel {
    @apply p-3;
  }
  
  .tv-screen {
    border-width: 4px;
  }
  
  .remote-card {
    @apply p-4;
  }
}

@media (min-width: 1920px) {
  .tv-screen {
    border-width: 12px;
    max-width: 1000px;
    max-height: 562px;
  }
  
  .step-icon {
    @apply text-8xl;
  }
}

/* Animations */
@keyframes icon-float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes signal-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Smart TV specific enhancements */
.tv-button-enhanced {
  @apply transform transition-all duration-200;
}

.tv-button-enhanced:focus {
  @apply scale-105;
  outline: 3px solid #fbbf24 !important;
  outline-offset: 2px !important;
  box-shadow: 0 0 0 6px rgba(251, 191, 36, 0.3) !important;
}

/* Smart TV responsive adjustments */
@media (min-width: 1920px) and (min-height: 1080px) {
  .diagnostic-header {
    @apply p-8;
  }

  .diagnostic-main {
    @apply p-8 gap-8;
  }

  .step-panel {
    @apply p-8;
  }

  .remote-card {
    @apply p-8;
  }

  .nav-button {
    @apply text-lg py-4 px-8 min-w-[160px];
  }

  .step-title-main {
    @apply text-2xl;
  }

  .step-instruction {
    @apply text-lg;
  }

  .tip-text {
    @apply text-base;
  }

  .confirmation-question {
    @apply text-base;
  }

  .confirmation-button {
    @apply text-base py-3 px-4;
  }

  .action-text {
    @apply text-base;
  }

  .instructions-title {
    @apply text-base;
  }

  .remote-title {
    @apply text-xl;
  }

  .step-indicator {
    @apply w-12 h-12 text-base;
  }

  .device-badge {
    @apply px-4 py-3 text-base;
  }

  .validation-item {
    @apply text-base;
  }

  /* Enhanced focus for TV remote navigation */
  button:focus,
  .nav-button:focus {
    @apply ring-4 ring-yellow-400 ring-opacity-75;
  }

  /* Cursor hiding for TV */
  * {
    cursor: none !important;
  }

  /* Enhanced visibility for TV viewing */
  .tv-screen {
    border-width: 16px;
    max-width: 1200px;
    max-height: 675px;
  }

  .audio-button {
    @apply w-16 h-16 text-xl;
  }
}

/* 4K TV adjustments */
@media (min-width: 3840px) {
  .diagnostic-header {
    @apply p-12;
  }

  .diagnostic-main {
    @apply p-12 gap-12;
  }

  .step-panel {
    @apply p-12;
  }

  .tv-screen {
    border-width: 24px;
    max-width: 1600px;
    max-height: 900px;
  }

  .nav-button {
    @apply text-xl py-6 px-12 min-w-[200px];
  }

  .step-title-main {
    @apply text-3xl;
  }

  .step-instruction {
    @apply text-xl;
  }

  .audio-button {
    @apply w-20 h-20 text-2xl;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .diagnostic-screen {
    @apply bg-white text-black;
  }

  .card {
    @apply border-2 border-black;
  }

  .tv-screen {
    @apply border-black;
  }

  .nav-button:focus {
    @apply ring-4 ring-black;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .step-icon,
  .signal-bar,
  .status-indicator,
  .pulse-dot,
  .audio-indicator {
    animation: none !important;
  }

  .nav-button,
  .confirmation-button,
  .audio-button {
    transition: none !important;
  }
}
</style>
