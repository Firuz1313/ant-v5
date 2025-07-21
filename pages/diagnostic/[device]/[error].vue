<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
    <!-- Header -->
    <div class="p-4 bg-black bg-opacity-50">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <nav class="flex items-center space-x-2 text-sm text-gray-400">
          <NuxtLink to="/" class="hover:text-white">Главная</NuxtLink>
          <span>→</span>
          <span>{{ deviceInfo?.name || 'Устройство' }}</span>
          <span>→</span>
          <span class="text-white">{{ selectedError?.title || 'Диагностика' }}</span>
        </nav>
        
        <div class="flex space-x-3">
          <button @click="toggleFullscreen" class="btn-secondary text-sm">
            {{ isFullscreen ? '📱 Обычный' : '📺 Полный экран' }}
          </button>
          <button @click="goBack" class="btn-secondary">
            ← Назад
          </button>
        </div>
      </div>
    </div>

    <div class="flex flex-col lg:flex-row min-h-screen">
      <!-- TV Screen Section (Left/Top) -->
      <div 
        class="flex-1 p-6"
        :class="{ 'lg:w-2/3': !isFullscreen, 'w-full': isFullscreen }"
      >
        <!-- TV Frame -->
        <div class="bg-gray-800 rounded-2xl p-6 shadow-2xl border-4 border-gray-700 h-full">
          <!-- TV Info Bar -->
          <div class="flex items-center justify-between mb-4">
            <div class="text-white">
              <h2 class="text-xl font-bold">{{ deviceInfo?.name || 'ТВ-приставка' }}</h2>
              <p class="text-gray-400 text-sm">{{ deviceInfo?.description || 'Интерактивная диагностика' }}</p>
            </div>
            
            <!-- TV Status Indicators -->
            <div class="flex items-center space-x-4">
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span class="text-green-400 text-sm">Подключено</span>
              </div>
              <div class="text-white text-sm bg-gray-700 px-3 py-1 rounded">
                HD 1080p
              </div>
            </div>
          </div>

          <!-- Main TV Screen -->
          <div class="bg-black rounded-xl h-96 lg:h-[500px] flex items-center justify-center relative overflow-hidden border-4 border-gray-900">
            <!-- Current Step Display -->
            <div v-if="currentStep" class="w-full h-full relative">
              <!-- Step Background Image/Video -->
              <div v-if="currentStep.media || currentStep.screen_image" class="w-full h-full">
                <img 
                  v-if="currentStep.media?.type === 'image' || currentStep.screen_image"
                  :src="currentStep.media?.url || currentStep.screen_image" 
                  :alt="currentStep.title"
                  class="w-full h-full object-cover rounded-lg"
                />
                <video 
                  v-else-if="currentStep.media?.type === 'video'"
                  :src="currentStep.media.url" 
                  class="w-full h-full object-cover rounded-lg"
                  autoplay
                  loop
                  muted
                />
                <div 
                  v-else-if="currentStep.media?.type === 'animation'"
                  class="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center"
                >
                  <img 
                    :src="currentStep.media.url" 
                    :alt="currentStep.media.description"
                    class="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>

              <!-- Step Content Overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent">
                <div class="absolute bottom-4 left-4 right-4">
                  <div class="bg-black bg-opacity-80 p-4 rounded-lg backdrop-blur-sm">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-blue-400 text-sm font-medium">
                        Шаг {{ currentStepIndex + 1 }} из {{ steps.length }}
                      </span>
                      <div class="flex items-center space-x-2">
                        <span v-if="currentStep.onlyForOperator" class="px-2 py-1 text-xs bg-orange-600 text-white rounded">
                          🔒 То��ько оператор
                        </span>
                        <span v-if="currentStep.progress" class="px-2 py-1 text-xs bg-blue-600 text-white rounded">
                          ⏳ В процессе
                        </span>
                      </div>
                    </div>
                    
                    <h3 class="text-white text-lg font-semibold mb-2">
                      {{ currentStep.title }}
                    </h3>
                    <p class="text-gray-300 text-sm mb-3">
                      {{ currentStep.instruction }}
                    </p>
                    
                    <div v-if="currentStep.tip" class="bg-blue-900 bg-opacity-50 p-3 rounded">
                      <p class="text-blue-200 text-sm">
                        💡 {{ currentStep.tip }}
                      </p>
                    </div>

                    <!-- User Confirmation -->
                    <div v-if="currentStep.userConfirmation" class="mt-4 space-y-2">
                      <p class="text-yellow-300 text-sm font-medium">
                        {{ currentStep.userConfirmation.question }}
                      </p>
                      <div class="flex space-x-2">
                        <button
                          v-for="option in currentStep.userConfirmation.options"
                          :key="option.text"
                          @click="handleUserConfirmation(option.action)"
                          class="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                        >
                          {{ option.text }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Error Selection -->
            <div v-else-if="!currentStep && selectedError" class="text-center">
              <div class="text-6xl mb-4">{{ selectedError.icon || '⚠️' }}</div>
              <h3 class="text-3xl font-bold mb-4">{{ selectedError.title }}</h3>
              <p class="text-xl text-gray-300 mb-6">{{ selectedError.description }}</p>
              <button @click="startDiagnostic" class="btn-primary">
                🚀 Начать диагностику
              </button>
            </div>

            <!-- Default Screen -->
            <div v-else class="text-center">
              <div class="text-8xl mb-6">📺</div>
              <h3 class="text-3xl font-semibold mb-4">Готов к диагн��стике</h3>
              <p class="text-xl text-gray-400">Выберите проблему для начала</p>
            </div>
          </div>

          <!-- Progress Bar -->
          <div v-if="steps.length > 0" class="mt-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-white text-sm">Прогресс диагностики</span>
              <span class="text-gray-400 text-sm">{{ currentStepIndex + 1 }} / {{ steps.length }}</span>
            </div>
            <div class="w-full bg-gray-700 rounded-full h-2">
              <div 
                class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                :style="{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }"
              ></div>
            </div>
          </div>

          <!-- TV Controls -->
          <div class="mt-4 flex justify-center space-x-4">
            <button 
              v-if="currentStepIndex > 0"
              @click="previousStep"
              class="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
            >
              ← Назад
            </button>
            
            <button 
              v-if="currentStep && currentStepIndex < steps.length - 1"
              @click="nextStep"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Следующий →
            </button>
            
            <button 
              v-if="currentStep && currentStepIndex === steps.length - 1"
              @click="completeSteps"
              class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              ✅ Завершить
            </button>
          </div>
        </div>
      </div>

      <!-- Remote Control Section (Right/Bottom) -->
      <div 
        v-if="!isFullscreen"
        class="lg:w-1/3 p-6 bg-gray-800 bg-opacity-50"
      >
        <div class="sticky top-6 space-y-6">
          <!-- Remote Control -->
          <div class="text-center">
            <h3 class="text-xl font-semibold text-white mb-4">🎮 Пульт управления</h3>
            <EnhancedRemoteControl
              :device="deviceInfo"
              :highlighted-buttons="highlightedButtons"
              :completed-actions="completedActions"
              @button-press="handleButtonPress"
            />
          </div>

          <!-- Current Action Instructions -->
          <div v-if="currentStep && currentStep.actions" class="bg-gray-700 p-4 rounded-lg">
            <h4 class="text-white font-medium mb-3">Что нужно сделать:</h4>
            <div class="space-y-2">
              <div 
                v-for="(action, index) in currentStep.actions.slice(0, 3)"
                :key="index"
                class="flex items-center space-x-3"
              >
                <div class="w-6 h-6 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {{ index + 1 }}
                </div>
                <div class="flex-1">
                  <span 
                    v-if="action.buttonId"
                    class="inline-block px-2 py-1 bg-yellow-400 text-yellow-900 text-xs rounded font-mono mr-2"
                  >
                    {{ action.buttonId.toUpperCase() }}
                  </span>
                  <span class="text-gray-300 text-sm">{{ action.description }}</span>
                </div>
              </div>
              <div v-if="currentStep.actions.length > 3" class="text-center">
                <button 
                  @click="showAllActions = !showAllActions"
                  class="text-blue-400 text-sm hover:text-blue-300"
                >
                  {{ showAllActions ? 'Скрыть' : `Показать еще ${currentStep.actions.length - 3}` }}
                </button>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bg-gray-700 p-4 rounded-lg">
            <h4 class="text-white font-medium mb-3">Быстрые действия:</h4>
            <div class="grid grid-cols-2 gap-2">
              <button 
                @click="highlightButtons(['menu', 'ok'])"
                class="p-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                MENU + OK
              </button>
              <button 
                @click="highlightButtons(['info'])"
                class="p-2 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
              >
                INFO
              </button>
              <button 
                @click="highlightButtons(['exit'])"
                class="p-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                EXIT
              </button>
              <button 
                @click="clearHighlights"
                class="p-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-500"
              >
                Очистить
              </button>
                          <button
                @click="showMasterRequestModal = true"
                class="p-2 bg-orange-600 text-white text-sm rounded hover:bg-orange-700 flex items-center space-x-1"
              >
                <span>🔧</span>
                <span>Вызвать мастера</span>
              </button>
            </div>
          </div>

          <!-- Action Log -->
          <div class="bg-gray-700 p-4 rounded-lg max-h-48 overflow-y-auto">
            <div class="flex items-center justify-between mb-3">
              <h4 class="text-white font-medium">Лог действий:</h4>
              <button 
                @click="clearActionLog"
                class="text-gray-400 text-xs hover:text-white"
              >
                Очистить
              </button>
            </div>
            <div class="space-y-2">
              <div v-if="actionLog.length === 0" class="text-gray-400 text-sm">
                Действия будут отображаться здесь
              </div>
              <div 
                v-for="(action, index) in actionLog.slice(0, 5)" 
                :key="index"
                class="text-sm"
              >
                <div class="flex items-center justify-between">
                  <span class="text-blue-400">{{ formatTime(action.timestamp) }}</span>
                  <span v-if="action.buttonId" class="text-yellow-400 text-xs">
                    {{ action.buttonId.toUpperCase() }}
                  </span>
                </div>
                <div class="text-gray-300">{{ action.message }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Audio Player for step instructions -->
    <audio 
      v-if="currentStep?.audio_url" 
      ref="audioPlayer"
      :src="currentStep.audio_url"
      @ended="onAudioEnded"
        ></audio>

    <!-- Master Request Modal -->
    <div v-if="showMasterRequestModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-xl font-bold text-white mb-4">Вызов мастера</h3>

        <div class="space-y-4">
          <!-- Priority -->
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2">Приоритет</label>
            <select v-model="masterRequest.priority" class="w-full p-2 bg-gray-700 text-white rounded border border-gray-600">
              <option value="low">Низкий (в течение дня)</option>
              <option value="medium">Средний (в течение 2-3 часов)</option>
              <option value="high">Высокий (в течение часа)</option>
            </select>
          </div>

          <!-- Contact -->
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2">Контактный телефон</label>
            <input
              v-model="masterRequest.contact"
              type="tel"
              placeholder="+7 (XXX) XXX-XX-XX"
              class="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
            >
          </div>

          <!-- Additional info -->
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2">Дополнительная информация</label>
            <textarea
              v-model="masterRequest.note"
              rows="3"
              placeholder="Опишите проблему подробнее..."
              class="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
            ></textarea>
          </div>
        </div>

        <div class="flex space-x-4 mt-6">
          <button
            @click="submitMasterRequest"
            :disabled="isSubmittingRequest"
            class="flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white py-2 px-4 rounded font-medium"
          >
            {{ isSubmittingRequest ? 'Отправка...' : 'Вызвать мастера' }}
          </button>
          <button
            @click="showMasterRequestModal = false"
            class="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded font-medium"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>

    <!-- Master Request Success Modal -->
    <div v-if="masterRequestSuccess" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-green-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div class="text-center">
          <div class="text-green-400 text-6xl mb-4">✅</div>
          <h3 class="text-xl font-bold text-white mb-4">Заявка отправлена!</h3>
          <p class="text-green-200 mb-4">
            Ваша заявка № {{ lastRequestId }} принята в работу.
            Мастер свяжется с вами в ближайшее время.
          </p>
          <button
            @click="masterRequestSuccess = false"
            class="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded font-medium"
          >
            Понятно
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()

// Extract route parameters
const deviceParam = computed(() => route.params.device)
const errorParam = computed(() => route.params.error)

// State
const isFullscreen = ref(false)
const showAllActions = ref(false)
const currentStepIndex = ref(0)
const highlightedButtons = ref([])
const completedActions = ref([])
const actionLog = ref([])
const audioPlayer = ref(null)

// Master request state
const showMasterRequestModal = ref(false)
const masterRequestSuccess = ref(false)
const isSubmittingRequest = ref(false)
const lastRequestId = ref('')
const masterRequest = ref({
  priority: 'medium',
  contact: '',
  note: ''
})

// Load device data
const { data: devices } = await useLazyFetch('/api/devices')
const deviceInfo = computed(() => {
  const deviceId = typeof deviceParam.value === 'string' ? 
    devices.value?.find(d => d.name.toLowerCase().replace(/\s+/g, '-') === deviceParam.value.toLowerCase())?.id :
    parseInt(deviceParam.value)
  return devices.value?.find(device => device.id === deviceId)
})

// Load errors for this device
const { data: errors } = await useLazyFetch(() => 
  deviceInfo.value ? `/api/errors/${deviceInfo.value.id}` : null
)

// Find selected error
const selectedError = computed(() => {
  if (!errors.value) return null
  const errorId = typeof errorParam.value === 'string' ?
    errors.value?.find(e => e.title.toLowerCase().replace(/\s+/g, '-') === errorParam.value.toLowerCase())?.id :
    parseInt(errorParam.value)
  return errors.value?.find(error => error.id === errorId)
})

// Load steps for the selected error
const { data: steps } = await useLazyFetch(() =>
  deviceInfo.value && selectedError.value 
    ? `/api/steps/${deviceInfo.value.id}/${selectedError.value.id}`
    : null
)

// Computed properties
const currentStep = computed(() => {
  return steps.value?.[currentStepIndex.value] || null
})

// Watch for current step changes to update remote highlighting
watch(currentStep, (newStep) => {
  if (newStep?.highlighted_buttons) {
    highlightedButtons.value = [...newStep.highlighted_buttons]
  } else if (newStep?.actions) {
    const buttonIds = newStep.actions
      .filter(action => action.buttonId)
      .map(action => action.buttonId)
    highlightedButtons.value = buttonIds
  } else {
    highlightedButtons.value = []
  }
  
  // Play audio instruction
  if (newStep?.audio_url && audioPlayer.value) {
    audioPlayer.value.play().catch(console.error)
  }
}, { immediate: true })

// Methods
const startDiagnostic = () => {
  if (steps.value && steps.value.length > 0) {
    currentStepIndex.value = 0
    logAction('Диагностика начата')
  }
}

const nextStep = () => {
  if (currentStepIndex.value < steps.value.length - 1) {
    currentStepIndex.value++
    logAction(`Переход к шагу ${currentStepIndex.value + 1}`)
  }
}

const previousStep = () => {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--
    logAction(`Возврат к шагу ${currentStepIndex.value + 1}`)
  }
}

const completeSteps = () => {
  logAction('��иагностика завершена')
  
  // Send completion analytics
  $fetch('/api/analytics', {
    method: 'POST',
    body: {
      type: 'diagnostic_completed',
      deviceId: deviceInfo.value?.id,
      errorId: selectedError.value?.id,
      stepsCompleted: steps.value?.length || 0,
      timestamp: new Date().toISOString()
    }
  }).catch(console.error)
  
  // Show completion
  if (currentStep.value?.completion) {
    // Handle completion logic
    console.log('Completion options:', currentStep.value.completion)
  }
}

const handleButtonPress = (buttonId) => {
  if (!completedActions.value.includes(buttonId)) {
    completedActions.value.push(buttonId)
  }
  logAction(`Нажата кнопка: ${buttonId}`, buttonId)
  
  // Check if this completes the current step
  if (currentStep.value?.actions) {
    const requiredButtons = currentStep.value.actions
      .filter(action => action.buttonId)
      .map(action => action.buttonId)
    
    const allCompleted = requiredButtons.every(btnId => 
      completedActions.value.includes(btnId)
    )
    
    if (allCompleted && currentStepIndex.value < steps.value.length - 1) {
      setTimeout(() => {
        nextStep()
      }, 1000)
    }
  }
}

const handleUserConfirmation = (action) => {
  logAction(`Польз��ватель выбрал: ${action}`)
  
  if (action === 'next') {
    nextStep()
  } else if (action === 'completion_success') {
    completeSteps()
  } else if (action === 'alternative') {
    // Handle alternative flow
    if (currentStep.value?.ifNoResult?.nextStepId) {
      const nextStepId = currentStep.value.ifNoResult.nextStepId
      const nextIndex = steps.value.findIndex(step => step.id === nextStepId)
      if (nextIndex !== -1) {
        currentStepIndex.value = nextIndex
      }
    }
  }
}

const highlightButtons = (buttons) => {
  highlightedButtons.value = [...buttons]
  logAction(`Подсвечены кнопки: ${buttons.join(', ')}`)
}

const clearHighlights = () => {
  highlightedButtons.value = []
  completedActions.value = []
  logAction('Подсветка очищен��')
}

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  logAction(`Режим отображения: ${isFullscreen.value ? 'полный экран' : 'с пультом'}`)
}

const logAction = (message, buttonId = null) => {
  actionLog.value.unshift({
    message,
    buttonId,
    timestamp: new Date()
  })
  
  // Keep only last 20 actions
  if (actionLog.value.length > 20) {
    actionLog.value = actionLog.value.slice(0, 20)
  }
}

const clearActionLog = () => {
  actionLog.value = []
}

const formatTime = (timestamp) => {
  return timestamp.toLocaleTimeString('ru-RU', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  })
}

const onAudioEnded = () => {
  logAction('Аудио-инструкция завершена')
}

const goBack = () => {
  router.back()
}

// Validate route parameters
onMounted(() => {
  if (!deviceInfo.value) {
    throw createError({
      statusCode: 404,
      statusMessage: `Устройство "${deviceParam.value}" не найдено`
    })
  }
  
  if (!selectedError.value) {
    throw createError({
      statusCode: 404,
      statusMessage: `Ошибка "${errorParam.value}" не найдена`
    })
  }
})

// Meta tags
useHead({
  title: computed(() => 
    `Д��агностика: ${selectedError.value?.title || 'Проблема'} - ${deviceInfo.value?.name || 'Устройство'}`
  ),
  meta: [
    { 
      name: 'description', 
      content: computed(() => 
        `Интерактивная диа��ностика проблемы "${selectedError.value?.title}" для устройства ${deviceInfo.value?.name}`
      )
    }
  ]
})
</script>

<style scoped>
/* Custom animations */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  transform: translateX(30px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-30px);
  opacity: 0;
}

/* Progress bar animation */
.progress-bar {
  transition: width 0.5s ease-in-out;
}

/* Button press effects */
.button-press-effect {
  animation: buttonPress 0.2s ease-in-out;
}

@keyframes buttonPress {
  0% { transform: scale(1); }
  50% { transform: scale(0.95); }
  100% { transform: scale(1); }
}
</style>
