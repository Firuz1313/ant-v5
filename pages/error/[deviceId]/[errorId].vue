<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 to-black">
    <!-- Header -->
    <div class="bg-gray-800 border-b border-gray-700">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <nav class="flex items-center space-x-2 text-sm text-gray-400 mb-2">
          <NuxtLink to="/" class="hover:text-white">Главная</NuxtLink>
          <span>→</span>
          <NuxtLink :to="`/remote/${deviceId}`" class="hover:text-white">{{ deviceInfo?.name }}</NuxtLink>
          <span>→</span>
          <span class="text-white">{{ errorInfo?.title }}</span>
        </nav>
        
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-white mb-1">
              🔧 {{ errorInfo?.title || 'Диагностика' }}
            </h1>
            <p class="text-gray-300">
              {{ deviceInfo?.name }} • {{ errorInfo?.description }}
            </p>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- Operator mode toggle -->
            <button 
              @click="toggleOperatorMode"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors text-sm',
                operatorMode 
                  ? 'bg-orange-600 text-white hover:bg-orange-700' 
                  : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
              ]"
            >
              {{ operatorMode ? '👤 Оператор' : '👥 Пользователь' }}
            </button>
            
            <!-- Step counter -->
            <div class="text-white bg-gray-700 px-3 py-2 rounded-lg">
              Шаг {{ currentStepIndex + 1 }} / {{ visibleSteps.length }}
            </div>
            
            <button @click="goBack" class="btn-secondary">
              ← Назад
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content: TV + Remote -->
    <div class="max-w-7xl mx-auto p-4">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- TV Screen Section (2 columns) -->
        <div class="lg:col-span-2">
          <div class="bg-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-700">
            <!-- TV Header -->
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold text-white">
                📺 {{ deviceInfo?.name || 'ТВ экран' }}
              </h2>
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span class="text-green-400 text-sm">HD 1080p</span>
              </div>
            </div>

            <!-- Main TV Display -->
            <div class="bg-black rounded-xl h-64 lg:h-80 flex items-center justify-center relative overflow-hidden mb-4">
              <!-- Current Step Content -->
              <div v-if="currentStep" class="w-full h-full">
                <!-- Step Image/Video -->
                <div v-if="currentStep.media || currentStep.screen_image" class="w-full h-full relative">
                  <img 
                    :src="currentStep.media?.url || currentStep.screen_image" 
                    :alt="currentStep.title"
                    class="w-full h-full object-cover rounded-lg"
                  />
                  
                  <!-- Step info overlay -->
                  <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4">
                    <h3 class="text-white text-lg font-semibold mb-1">
                      {{ currentStep.title }}
                    </h3>
                    <p class="text-gray-300 text-sm">
                      {{ currentStep.instruction }}
                    </p>
                  </div>
                </div>

                <!-- Text-only step -->
                <div v-else class="text-center text-white space-y-4 p-8">
                  <h3 class="text-2xl lg:text-3xl font-bold">{{ currentStep.title }}</h3>
                  <p class="text-lg text-gray-300">{{ currentStep.instruction }}</p>
                  <div v-if="currentStep.tip" class="bg-blue-900/50 p-3 rounded-lg">
                    <p class="text-blue-200">💡 {{ currentStep.tip }}</p>
                  </div>
                </div>
              </div>

              <!-- No steps state -->
              <div v-else class="text-center text-white space-y-4">
                <div class="text-6xl">⚠️</div>
                <h3 class="text-2xl font-bold">{{ errorInfo?.title }}</h3>
                <p class="text-gray-300">{{ errorInfo?.description }}</p>
              </div>
            </div>

            <!-- Progress Bar -->
            <div v-if="visibleSteps.length > 0" class="mb-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-white text-sm">Прогресс решения</span>
                <span class="text-gray-400 text-sm">
                  {{ currentStepIndex + 1 }} из {{ visibleSteps.length }}
                </span>
              </div>
              <div class="w-full bg-gray-700 rounded-full h-2">
                <div 
                  class="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  :style="{ width: `${progress}%` }"
                ></div>
              </div>
            </div>

            <!-- Step Navigation -->
            <div class="flex justify-between items-center">
              <button 
                v-if="currentStepIndex > 0"
                @click="previousStep"
                class="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                ← Предыдущий
              </button>
              <div v-else></div>

              <div class="flex space-x-2">
                <!-- Alternative action if step failed -->
                <button 
                  v-if="currentStep?.nextIfFailed"
                  @click="stepFailed"
                  class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  ❌ Не помогло
                </button>
                
                <!-- Next step -->
                <button 
                  v-if="currentStepIndex < visibleSteps.length - 1"
                  @click="nextStep"
                  class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  ✅ Готово
                </button>
                
                <!-- Complete -->
                <button 
                  v-else-if="currentStep"
                  @click="completeSteps"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  🎉 Завершить
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Remote Control Section (1 column) -->
        <div class="lg:col-span-1">
          <div class="bg-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-700">
            <!-- Remote Header -->
            <div class="text-center mb-4">
              <h2 class="text-xl font-semibold text-white mb-2">
                🎮 Пульт управления
              </h2>
              <p class="text-gray-400 text-sm">
                Следуйте подсказкам ниже
              </p>
            </div>

            <!-- Current Step Tip -->
            <div v-if="currentStep?.tip" class="mb-4 p-3 bg-blue-900/30 border border-blue-700 rounded-lg">
              <p class="text-blue-200 text-sm">
                💡 {{ currentStep.tip }}
              </p>
            </div>

            <!-- Enhanced Remote Control -->
            <div class="flex justify-center mb-4">
              <EnhancedRemoteControl
                :device="deviceInfo"
                :highlighted-buttons="currentHighlightedButtons"
                :completed-actions="completedActions"
                @button-press="handleButtonPress"
              />
            </div>

            <!-- Step Actions Info -->
            <div v-if="currentStep?.actions && currentStep.actions.length > 0" class="mb-4">
              <h4 class="text-white font-medium mb-2">Действия:</h4>
              <div class="space-y-2">
                <div 
                  v-for="(action, index) in currentStep.actions" 
                  :key="index"
                  class="p-2 bg-gray-800 rounded text-sm text-gray-300"
                >
                  <div class="flex items-center space-x-2">
                    <span class="text-yellow-400">{{ index + 1 }}.</span>
                    <span>{{ action.description }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="space-y-2">
              <button 
                @click="skipStep"
                class="w-full p-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors text-sm"
              >
                ⏭️ Пропустить шаг
              </button>
              
              <button 
                @click="requestHelp"
                class="w-full p-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors text-sm"
              >
                🆘 Нужна помощь
              </button>
              
              <button 
                @click="restartDiagnostic"
                class="w-full p-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
              >
                🔄 Начать заново
              </button>
            </div>
          </div>

          <!-- Step List -->
          <div v-if="visibleSteps.length > 1" class="mt-4 bg-gray-900 rounded-2xl p-4 border border-gray-700">
            <h3 class="text-white font-medium mb-3">Все шаги:</h3>
            <div class="space-y-2">
              <button 
                v-for="(step, index) in visibleSteps" 
                :key="step.id"
                @click="goToStep(index)"
                :class="[
                  'w-full p-2 rounded text-left text-sm transition-colors',
                  index === currentStepIndex
                    ? 'bg-blue-600 text-white'
                    : index < currentStepIndex
                    ? 'bg-green-700 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                ]"
              >
                <div class="flex items-center space-x-2">
                  <span>{{ index + 1 }}.</span>
                  <span class="truncate">{{ step.title }}</span>
                  <span v-if="index < currentStepIndex" class="ml-auto text-green-400">✓</span>
                  <span v-else-if="index === currentStepIndex" class="ml-auto text-blue-400">▶</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()

// Get route parameters
const deviceId = computed(() => route.params.deviceId)
const errorId = computed(() => route.params.errorId)

// Load data
const { data: devices } = await useLazyFetch('/api/devices')
const deviceInfo = computed(() => 
  devices.value?.find(device => device.id == deviceId.value)
)

const { data: errors } = await useLazyFetch(`/api/errors/${deviceId.value}`)
const errorInfo = computed(() => 
  errors.value?.find(error => error.id == errorId.value)
)

const { data: allSteps } = await useLazyFetch(`/api/steps/${deviceId.value}/${errorId.value}`)

// State
const operatorMode = ref(false)
const currentStepIndex = ref(0)
const completedActions = ref([])

// Computed
const visibleSteps = computed(() => {
  if (!allSteps.value) return []
  
  return allSteps.value.filter(step => {
    // Show all steps for operator, or only non-operator steps for regular users
    return operatorMode.value || !step.onlyForOperator
  })
})

const currentStep = computed(() => {
  return visibleSteps.value[currentStepIndex.value] || null
})

const currentHighlightedButtons = computed(() => {
  return currentStep.value?.highlighted_buttons || []
})

const progress = computed(() => {
  if (visibleSteps.value.length === 0) return 0
  return ((currentStepIndex.value + 1) / visibleSteps.value.length) * 100
})

// Methods
const toggleOperatorMode = () => {
  operatorMode.value = !operatorMode.value
  // Reset to first step when switching modes
  currentStepIndex.value = 0
}

const nextStep = () => {
  if (currentStepIndex.value < visibleSteps.value.length - 1) {
    currentStepIndex.value++
    logStepAction('step_completed')
  }
}

const previousStep = () => {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--
    logStepAction('step_back')
  }
}

const goToStep = (stepIndex) => {
  currentStepIndex.value = stepIndex
  logStepAction('step_jump')
}

const stepFailed = () => {
  logStepAction('step_failed')
  
  // Could implement alternative step logic here
  if (currentStep.value?.nextIfFailed) {
    // Go to alternative step
    nextStep()
  }
}

const skipStep = () => {
  logStepAction('step_skipped')
  nextStep()
}

const requestHelp = () => {
  logStepAction('help_requested')
  
  // Could trigger Telegram notification here
  $fetch('/api/analytics', {
    method: 'POST',
    body: {
      type: 'help_requested',
      deviceId: deviceId.value,
      errorId: errorId.value,
      stepId: currentStep.value?.id,
      timestamp: new Date().toISOString()
    }
  }).catch(console.error)
}

const restartDiagnostic = () => {
  currentStepIndex.value = 0
  completedActions.value = []
  logStepAction('diagnostic_restarted')
}

const completeSteps = () => {
  logStepAction('diagnostic_completed')
  
  // Send completion analytics
  $fetch('/api/analytics', {
    method: 'POST',
    body: {
      type: 'diagnostic_completed',
      deviceId: deviceId.value,
      errorId: errorId.value,
      stepsCompleted: visibleSteps.value.length,
      operatorMode: operatorMode.value,
      timestamp: new Date().toISOString()
    }
  }).catch(console.error)
  
  // Could show success message or redirect
  alert('🎉 Диагностика завершена успешно!')
}

const handleButtonPress = (buttonId) => {
  if (!completedActions.value.includes(buttonId)) {
    completedActions.value.push(buttonId)
  }
  
  logStepAction('button_pressed', { buttonId })
}

const logStepAction = (action, data = {}) => {
  const logData = {
    type: action,
    deviceId: deviceId.value,
    errorId: errorId.value,
    stepId: currentStep.value?.id,
    stepIndex: currentStepIndex.value,
    operatorMode: operatorMode.value,
    timestamp: new Date().toISOString(),
    ...data
  }
  
  // Send to analytics
  $fetch('/api/analytics', {
    method: 'POST',
    body: logData
  }).catch(console.error)
  
  console.log('Step action logged:', logData)
}

// Navigation
const goBack = () => {
  router.back()
}

// Validation
onMounted(() => {
  if (!deviceInfo.value) {
    throw createError({
      statusCode: 404,
      statusMessage: `Устройство с ID ${deviceId.value} не найдено`
    })
  }
  
  if (!errorInfo.value) {
    throw createError({
      statusCode: 404,
      statusMessage: `Ошибка с ID ${errorId.value} не найдена`
    })
  }
})

// Meta tags
useHead({
  title: computed(() => 
    errorInfo.value && deviceInfo.value 
      ? `${errorInfo.value.title} - ${deviceInfo.value.name}`
      : 'Диагностика'
  ),
  meta: [
    { 
      name: 'description', 
      content: computed(() => 
        errorInfo.value 
          ? `Пошаговое решение: ${errorInfo.value.description}`
          : 'Система диагностики ТВ-приставок'
      )
    }
  ]
})
</script>
