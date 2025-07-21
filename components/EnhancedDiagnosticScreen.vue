<template>
  <div class="diagnostic-container">
    <!-- Enhanced Progress indicator with step type icons -->
    <div class="flex items-center justify-between mb-6">
      <button @click="$emit('back')" class="btn-secondary">
        ← Назад к ошибкам
      </button>
      <div class="flex items-center space-x-4">
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-600 dark:text-gray-400">
            Шаг {{ currentStep + 1 }} из {{ steps.length }}
          </span>
          <span v-if="currentStepData.onlyForOperator" class="px-2 py-1 text-xs bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100 rounded-full">
            Для оператора
          </span>
        </div>
        <div class="flex space-x-1">
          <div
            v-for="(step, index) in steps"
            :key="index"
            class="w-3 h-3 rounded-full transition-colors relative"
            :class="getStepIndicatorClass(index)"
            :title="step.title"
          >
            <span v-if="step.onlyForOperator" class="absolute -top-1 -right-1 text-xs text-orange-500">👤</span>
          </div>
        </div>
      </div>
      <button @click="$emit('restart')" class="btn-secondary">
        Начать заново
      </button>
    </div>

    <!-- Main diagnostic interface -->
    <div class="diagnostic-main">
      <!-- Enhanced TV Screen with media support -->
      <div class="tv-screen-container">
        <div class="tv-screen">
          <!-- Media content: image, video, or animation -->
          <div v-if="currentStepData.media" class="w-full h-full">
            <video 
              v-if="currentStepData.media.type === 'video'" 
              :src="currentStepData.media.url" 
              class="w-full h-full object-cover"
              controls
              muted
              autoplay
            />
            <img 
              v-else-if="currentStepData.media.type === 'animation'" 
              :src="currentStepData.media.url" 
              :alt="currentStepData.media.description"
              class="w-full h-full object-cover"
            />
            <img 
              v-else-if="currentStepData.media.type === 'image'" 
              :src="currentStepData.media.url" 
              :alt="currentStepData.title"
              class="w-full h-full object-cover"
            />
          </div>
          
          <!-- Default screen image -->
          <img
            v-else-if="currentStepData.screen_image"
            :src="currentStepData.screen_image"
            :alt="currentStepData.title"
            class="w-full h-full object-cover"
          />
          
          <!-- Fallback content -->
          <div v-else class="w-full h-full flex items-center justify-center">
            <div class="text-center text-white">
              <div class="text-6xl mb-4">{{ getStepIcon(currentStepData) }}</div>
              <p class="text-lg">{{ currentStepData.title }}</p>
            </div>
          </div>
          
          <!-- TV screen overlay for status -->
          <div class="absolute top-4 right-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded text-sm">
            {{ device.name }}
          </div>

          <!-- Signal validation overlay for signal checking steps -->
          <div v-if="currentStepData.validation && showSignalInfo" 
               class="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white p-4 rounded">
            <div class="space-y-2">
              <div v-if="currentStepData.validation.signalLevel">
                Уровень: <span class="font-mono">{{ signalLevel }}%</span>
              </div>
              <div v-if="currentStepData.validation.signalQuality">
                Качество: <span class="font-mono">{{ signalQuality }}%</span>
              </div>
              <div v-if="currentStepData.validation.satellite">
                Спутник: <span class="font-mono">{{ currentStepData.validation.satellite }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced Remote Control with multiple button highlighting -->
      <div class="remote-container">
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
            Пульт управления
          </h3>
          
          <!-- Action instructions for multiple buttons -->
          <div v-if="currentStepData.actions && currentStepData.actions.length > 0" class="mb-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <h4 class="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">Выполните действия:</h4>
            <ol class="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li v-for="(action, index) in currentStepData.actions" :key="index" class="flex items-center space-x-2">
                <span class="flex-shrink-0 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                  {{ index + 1 }}
                </span>
                <span>{{ action.description }}</span>
              </li>
            </ol>
          </div>

          <EnhancedRemoteControl 
            :device="device"
            :highlighted-buttons="getHighlightedButtons()"
            :completed-actions="completedActions"
            @button-press="handleButtonPress"
          />
        </div>
      </div>
    </div>

    <!-- Enhanced step instructions with conditional logic -->
    <div class="card p-6">
      <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div class="flex-1">
          <div class="flex items-center space-x-2 mb-2">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ currentStepData.title }}
            </h3>
            <span v-if="currentStepData.severity" 
                  :class="{
                    'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100': currentStepData.severity === 'high',
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100': currentStepData.severity === 'medium'
                  }"
                  class="px-2 py-1 text-xs rounded-full">
              {{ currentStepData.severity === 'high' ? 'Критичный' : 'Важный' }}
            </span>
          </div>
          
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            {{ currentStepData.instruction }}
          </p>
          
          <!-- Enhanced tip section -->
          <div v-if="currentStepData.tip" class="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-3 mb-4">
            <div class="flex items-start space-x-2">
              <svg class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
              </svg>
              <p class="text-sm text-blue-800 dark:text-blue-200">
                {{ currentStepData.tip }}
              </p>
            </div>
          </div>

          <!-- External link actions -->
          <div v-if="hasLinkActions" class="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-3 mb-4">
            <div v-for="linkAction in getLinkActions()" :key="linkAction.url" class="flex items-center space-x-2">
              <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-1a1 1 0 10-2 0v1H5V7h1a1 1 0 000-2H5z"></path>
              </svg>
              <a :href="linkAction.url" target="_blank" class="text-green-800 dark:text-green-200 hover:underline">
                {{ linkAction.description }}
              </a>
              <span v-if="linkAction.hideIP" class="text-xs text-gray-500">(скрыть IP)</span>
            </div>
          </div>

          <!-- User confirmation options -->
          <div v-if="currentStepData.userConfirmation" class="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mb-4">
            <h4 class="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-3">
              {{ currentStepData.userConfirmation.question }}
            </h4>
            <div class="space-y-2">
              <button
                v-for="option in currentStepData.userConfirmation.options"
                :key="option.text"
                @click="handleUserChoice(option)"
                class="w-full text-left px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-yellow-300 dark:border-yellow-600 rounded hover:bg-yellow-100 dark:hover:bg-yellow-800 transition-colors"
              >
                {{ option.text }}
              </button>
            </div>
          </div>

          <!-- Progress indicator for search operations -->
          <div v-if="currentStepData.progress && isSearching" class="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-4">
            <div class="flex items-center space-x-3">
              <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span class="text-blue-800 dark:text-blue-200">Выполняется поиск каналов...</span>
            </div>
            <div class="mt-2 w-full bg-blue-200 dark:bg-blue-700 rounded-full h-2">
              <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" :style="`width: ${searchProgress}%`"></div>
            </div>
          </div>
        </div>
        
        <!-- Enhanced navigation buttons -->
        <div class="flex flex-col space-y-3 lg:ml-6">
          <button
            v-if="currentStep > 0"
            @click="previousStep"
            class="btn-secondary min-w-[120px]"
          >
            ← Назад
          </button>
          
          <button
            v-if="canProceedToNext()"
            @click="nextStep"
            class="btn-primary min-w-[120px]"
            :disabled="!isStepCompleted()"
          >
            Далее →
          </button>
          
          <button
            v-else-if="isLastStep()"
            @click="completeDiagnostic"
            class="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 min-w-[120px]"
          >
            Завершить
          </button>

          <!-- Alternative path button -->
          <button
            v-if="currentStepData.ifNoResult"
            @click="handleNoResult"
            class="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 text-sm min-w-[120px]"
          >
            Не помогло
          </button>
        </div>
      </div>
    </div>

    <!-- Enhanced completion screen -->
    <div v-if="showCompletion" class="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white dark:bg-dark-100 rounded-xl shadow-2xl max-w-md w-full p-6">
        <div class="text-center">
          <div class="text-6xl mb-4">
            {{ completionData.success ? '✅' : '❗' }}
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {{ completionData.title }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            {{ completionData.description }}
          </p>
          
          <!-- Completion options -->
          <div v-if="completionData.options" class="space-y-3">
            <button
              v-for="option in completionData.options"
              :key="option.text"
              @click="handleCompletionOption(option)"
              class="w-full py-3 px-4 text-left bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {{ option.text }}
            </button>
          </div>
          
          <!-- Submit request action -->
          <div v-else-if="completionData.action">
            <button
              @click="handleSubmitRequest"
              class="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200"
            >
              {{ completionData.action.buttonText }}
            </button>
          </div>
          
          <!-- Default close button -->
          <button
            v-else
            @click="showCompletion = false"
            class="w-full btn-primary"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>

    <!-- Enhanced audio controls -->
    <div v-if="currentStepData.audio_url" class="fixed bottom-4 right-4 z-50">
      <button
        @click="toggleAudio"
        class="bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 relative"
        :title="isPlaying ? 'Остановить озвучку' : 'Воспроизвести озвучку'"
      >
        <svg v-if="isPlaying" class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
        </svg>
        <svg v-else class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path>
        </svg>
        <div v-if="isPlaying" class="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
      </button>
      <audio
        ref="audioPlayer"
        :src="currentStepData.audio_url"
        @ended="isPlaying = false"
        @play="isPlaying = true"
        @pause="isPlaying = false"
      />
    </div>
  </div>
</template>

<script setup>
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

// Enhanced reactive state
const steps = ref([])
const currentStep = ref(0)

// User logging system
const logger = useUserLogger()
const stepStartTime = ref(null)
const isPlaying = ref(false)
const audioPlayer = ref(null)
const completedActions = ref([])
const showCompletion = ref(false)
const completionData = ref({})
const isSearching = ref(false)
const searchProgress = ref(0)
const showSignalInfo = ref(false)
const signalLevel = ref(15)
const signalQuality = ref(35)

// Enhanced computed properties
const currentStepData = computed(() => {
  if (!steps.value || steps.value.length === 0) return {}
  return steps.value[currentStep.value] || {}
})

const hasLinkActions = computed(() => {
  return currentStepData.value.actions?.some(action => action.type === 'link')
})

// Enhanced methods
const getStepIcon = (step) => {
  if (step.title?.includes('Проверить баланс')) return '����'
  if (step.title?.includes('карту')) return '🎫'
  if (step.title?.includes('антенн')) return '📡'
  if (step.title?.includes('поиск')) return '🔍'
  if (step.title?.includes('сигнал')) return '📶'
  if (step.title?.includes('кабель')) return '🔌'
  return '📺'
}

const getStepIndicatorClass = (index) => {
  if (index < currentStep.value) return 'bg-green-500'
  if (index === currentStep.value) return 'bg-primary-500'
  return 'bg-gray-300 dark:bg-gray-600'
}

const getHighlightedButtons = () => {
  if (!currentStepData.value.actions) return currentStepData.value.highlighted_buttons || []
  
  return currentStepData.value.actions
    .filter(action => action.buttonId)
    .map(action => action.buttonId)
}

const getLinkActions = () => {
  return currentStepData.value.actions?.filter(action => action.type === 'link') || []
}

const canProceedToNext = () => {
  return currentStep.value < steps.value.length - 1 && !currentStepData.value.userConfirmation
}

const isLastStep = () => {
  return currentStep.value === steps.value.length - 1
}

const isStepCompleted = () => {
  // Check if all required actions are completed
  if (currentStepData.value.actions) {
    const requiredActions = currentStepData.value.actions.filter(action => action.buttonId)
    return requiredActions.every(action => 
      completedActions.value.includes(action.buttonId)
    )
  }
  return true
}

const nextStep = () => {
  if (currentStepData.value.nextIfSuccess) {
    const nextStepId = currentStepData.value.nextIfSuccess
    if (typeof nextStepId === 'number') {
      currentStep.value = Math.min(nextStepId - 1, steps.value.length - 1)
    } else {
      handleSpecialAction(nextStepId)
    }
  } else if (canProceedToNext()) {
    currentStep.value++
  }
  
  // Reset completed actions for new step
  completedActions.value = []
  
  // Handle progress simulation for search steps
  if (currentStepData.value.progress) {
    simulateSearch()
  }
  
  // Show signal info for validation steps
  if (currentStepData.value.validation) {
    showSignalInfo.value = true
  }
}

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
    completedActions.value = []
    showSignalInfo.value = false
  }
}

const handleButtonPress = (buttonId) => {
  console.log('Button pressed:', buttonId)
  
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
  if (option.action === 'completion_success') {
    showCompletionSuccess()
  } else if (option.action === 'call_master') {
    showMasterCall()
  } else if (typeof option.action === 'number') {
    currentStep.value = option.action - 1
    nextStep()
  } else {
    handleSpecialAction(option.action)
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

const handleSpecialAction = (action) => {
  switch (action) {
    case 'completion_success':
      showCompletionSuccess()
      break
    case 'call_master':
      showMasterCall()
      break
    case 'restart':
      emit('restart')
      break
    case 'select_error':
      emit('back')
      break
    case 'select_device':
      emit('restart')
      break
    default:
      console.log('Unknown action:', action)
  }
}

const showCompletionSuccess = () => {
  completionData.value = {
    success: true,
    title: '✅ Проблема решена',
    description: 'Отлично! Диагностика завершена успешно.'
  }
  showCompletion.value = true
}

const showMasterCall = () => {
  completionData.value = {
    success: false,
    title: '🚫 Требуется мастер',
    description: 'Мы приняли заявку, мастер скоро прибудет.',
    action: {
      type: 'submit_request',
      buttonText: 'Подать заявку',
      endpoint: '/api/master-request'
    }
  }
  showCompletion.value = true
}

const handleCompletionOption = (option) => {
  showCompletion.value = false
  handleSpecialAction(option.action)
}

const handleSubmitRequest = async () => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    completionData.value.description = 'Заявка отправлена! Мастер свяжется с вами в ближайшее время.'
    completionData.value.action = null
  } catch (error) {
    console.error('Failed to submit request:', error)
  }
}

const simulateSearch = () => {
  isSearching.value = true
  searchProgress.value = 0
  
  const interval = setInterval(() => {
    searchProgress.value += 10
    if (searchProgress.value >= 100) {
      clearInterval(interval)
      isSearching.value = false
      searchProgress.value = 0
    }
  }, 500)
}

const completeDiagnostic = () => {
  if (currentStepData.value.completion) {
    if (currentStepData.value.completion.success) {
      completionData.value = currentStepData.value.completion.success
      showCompletion.value = true
    } else if (currentStepData.value.completion.failure) {
      completionData.value = currentStepData.value.completion.failure
      showCompletion.value = true
    }
  } else {
    showCompletionSuccess()
  }
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

// Load enhanced diagnostic steps
onMounted(async () => {
  try {
    const stepsData = await $fetch(`/api/steps/${props.device.id}/${props.error.id}`)
    steps.value = stepsData || []
    
    if (steps.value.length === 0) {
      // Fallback to basic steps if enhanced not available
      steps.value = [
        {
          id: 1,
          title: 'Диагностика начата',
          instruction: `Начинаем диагностику ошибки "${props.error.title}" для ${props.device.name}`,
          tip: 'Следуйте инструкциям на экране',
          highlighted_buttons: [],
          actions: [],
          audio_url: null
        }
      ]
    }
  } catch (error) {
    console.error('Failed to load steps:', error)
    steps.value = []
  }
})

// Meta tags
useHead({
  title: `Диагностика ${props.device.name} - ${props.error.title}`,
})
</script>

<style scoped>
.diagnostic-container {
  @apply min-h-screen p-4 lg:p-6;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 1rem;
}

.diagnostic-main {
  @apply grid gap-6;
  grid-template-columns: 1fr;
}

@media (min-width: 1024px) {
  .diagnostic-main {
    grid-template-columns: 2fr 1fr;
  }
}

.remote-container {
  @apply max-w-xs mx-auto lg:max-w-none;
}

.tv-screen-container {
  @apply w-full max-w-2xl mx-auto;
}

@media (max-width: 1024px) {
  .diagnostic-main {
    @apply space-y-6;
    grid-template-columns: 1fr;
  }
  
  .tv-screen-container {
    @apply order-1;
  }
  
  .remote-container {
    @apply order-2;
  }
}

/* Enhanced animations */
.step-transition-enter-active,
.step-transition-leave-active {
  transition: all 0.3s ease;
}

.step-transition-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.step-transition-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
