<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 p-4">
    <div class="max-w-7xl mx-auto">
      <!-- Header with device info -->
      <div class="mb-8">
        <nav class="flex items-center space-x-2 text-sm text-gray-400 mb-4">
          <NuxtLink to="/" class="hover:text-white">Главная</NuxtLink>
          <span>→</span>
          <span class="text-white">{{ deviceInfo?.name || 'Пульт управления' }}</span>
        </nav>
        
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-4xl font-bold text-white mb-2">
              🎮 {{ deviceInfo?.name || 'Устройство' }}
            </h1>
            <p class="text-gray-300">
              {{ deviceInfo?.description || 'Интерактивный пульт управления' }}
            </p>
          </div>
          
          <div class="flex space-x-3">
            <button @click="goToTV" class="btn-primary">
              📺 Открыть ТВ
            </button>
            <button @click="goBack" class="btn-secondary">
              ← Назад
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Remote Control (Left/Center) -->
        <div class="lg:col-span-1 flex justify-center">
          <div class="space-y-6">
            <!-- Device Remote Image (if available) -->
            <div v-if="deviceInfo?.remote_image" class="text-center">
              <img 
                :src="deviceInfo.remote_image" 
                :alt="`Пульт ${deviceInfo.name}`"
                class="max-w-xs mx-auto rounded-lg shadow-lg"
              />
            </div>

            <!-- Interactive Remote Control -->
            <EnhancedRemoteControl
              :device="deviceInfo"
              :highlighted-buttons="highlightedButtons"
              :completed-actions="completedActions"
              @button-press="handleButtonPress"
            />
          </div>
        </div>

        <!-- Control Panel (Right) -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Error Selection -->
          <div class="bg-gray-800 p-6 rounded-xl">
            <h3 class="text-xl font-semibold text-white mb-4">Выбор проблемы</h3>
            <div v-if="errors.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                v-for="error in errors"
                :key="error.id"
                @click="selectError(error)"
                :class="[
                  'p-4 rounded-lg text-left transition-colors',
                  selectedError?.id === error.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                ]"
              >
                <div class="flex items-center space-x-3">
                  <span class="text-2xl">{{ error.icon || '⚠️' }}</span>
                  <div>
                    <h4 class="font-medium">{{ error.title }}</h4>
                    <p class="text-sm opacity-75">{{ error.description }}</p>
                  </div>
                </div>
              </button>
            </div>
            <div v-else class="text-gray-400 text-center py-8">
              Ошибки для этого устройства не найдены
            </div>
          </div>

          <!-- Current Step Info -->
          <div v-if="selectedError" class="bg-gray-800 p-6 rounded-xl">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-semibold text-white">
                Диагностика: {{ selectedError.title }}
              </h3>
              <button 
                @click="startDiagnostic"
                class="btn-primary"
              >
                🚀 Начать решение
              </button>
            </div>
            
            <div class="bg-gray-700 p-4 rounded-lg">
              <p class="text-gray-300 mb-3">{{ selectedError.description }}</p>
              <div class="flex items-center space-x-4 text-sm">
                <span class="text-blue-400">
                  Шагов: {{ steps.length || 0 }}
                </span>
                <span class="text-green-400">
                  Сложность: {{ getSeverityText(selectedError.severity) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Remote Control Simulation -->
          <div class="bg-gray-800 p-6 rounded-xl">
            <h3 class="text-xl font-semibold text-white mb-4">Управление подсветкой</h3>
            
            <!-- Preset combinations -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <button 
                @click="highlightButtons(['menu', 'ok'])"
                class="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                MENU + OK
              </button>
              <button 
                @click="highlightButtons(['up', 'down', 'ok'])"
                class="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                Навигация
              </button>
              <button 
                @click="highlightButtons(['info'])"
                class="p-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
              >
                INFO
              </button>
              <button 
                @click="clearHighlights"
                class="p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Очистить
              </button>
            </div>

            <!-- Manual button selection -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Выберите кнопки для подсветки:
              </label>
              <div class="grid grid-cols-3 md:grid-cols-5 gap-2">
                <label v-for="button in availableButtons" :key="button.id" class="flex items-center space-x-2 text-xs text-gray-300">
                  <input 
                    type="checkbox" 
                    :value="button.id"
                    v-model="selectedButtons"
                    class="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                  />
                  <span>{{ button.label }}</span>
                </label>
              </div>
            </div>

            <button 
              @click="highlightButtons(selectedButtons)"
              class="w-full p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Применить подсветку
            </button>
          </div>

          <!-- Action Log -->
          <div class="bg-gray-800 p-6 rounded-xl">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-semibold text-white">Лог действий</h3>
              <button 
                @click="clearLog"
                class="text-sm text-gray-400 hover:text-white"
              >
                Очистить
              </button>
            </div>
            
            <div class="max-h-48 overflow-y-auto">
              <div v-if="actionLog.length === 0" class="text-gray-400 text-center py-4">
                Действия будут отображаться здесь
              </div>
              <div 
                v-for="(action, index) in actionLog" 
                :key="index"
                class="mb-2 p-3 bg-gray-700 rounded text-sm text-gray-300"
              >
                <div class="flex items-center justify-between">
                  <span class="text-blue-400">{{ formatTime(action.timestamp) }}</span>
                  <span v-if="action.buttonId" class="text-yellow-400 text-xs">
                    {{ action.buttonId.toUpperCase() }}
                  </span>
                </div>
                <div class="mt-1">{{ action.message }}</div>
              </div>
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

// Get device ID from route
const deviceId = computed(() => route.params.deviceId)

// Load device data
const { data: devices } = await useLazyFetch('/api/devices')
const deviceInfo = computed(() => 
  devices.value?.find(device => device.id == deviceId.value)
)

// Load errors for this device
const { data: errors } = await useLazyFetch(`/api/errors/${deviceId.value}`)

// Load steps if error is selected
const steps = ref([])
const selectedError = ref(null)

// Remote control state
const highlightedButtons = ref([])
const completedActions = ref([])
const selectedButtons = ref([])
const actionLog = ref([])

// Available buttons for manual selection
const availableButtons = [
  { id: 'power', label: 'POWER' },
  { id: 'source', label: 'SOURCE' },
  { id: 'menu', label: 'MENU' },
  { id: 'ok', label: 'OK' },
  { id: 'up', label: '↑' },
  { id: 'down', label: '↓' },
  { id: 'left', label: '←' },
  { id: 'right', label: '→' },
  { id: 'back', label: 'BACK' },
  { id: 'info', label: 'INFO' },
  { id: 'exit', label: 'EXIT' },
  { id: 'vol-up', label: 'VOL+' },
  { id: 'vol-down', label: 'VOL-' },
  { id: 'ch-up', label: 'CH+' },
  { id: 'ch-down', label: 'CH-' }
]

// Methods
const selectError = async (error) => {
  selectedError.value = error
  
  // Load steps for this error
  try {
    const stepData = await $fetch(`/api/steps/${deviceId.value}/${error.id}`)
    steps.value = stepData
    logAction(`Выбрана ошибка: ${error.title}`)
  } catch (err) {
    console.error('Failed to load steps:', err)
    steps.value = []
  }
}

const startDiagnostic = () => {
  if (selectedError.value) {
    navigateTo(`/error/${deviceId.value}/${selectedError.value.id}`)
  }
}

const highlightButtons = (buttons) => {
  highlightedButtons.value = [...buttons]
  logAction(`Подсвечены кнопки: ${buttons.join(', ')}`)
}

const clearHighlights = () => {
  highlightedButtons.value = []
  completedActions.value = []
  selectedButtons.value = []
  logAction('Подсветка очищена')
}

const handleButtonPress = (buttonId) => {
  if (!completedActions.value.includes(buttonId)) {
    completedActions.value.push(buttonId)
  }
  logAction(`Нажата кнопка: ${buttonId}`, buttonId)
}

const logAction = (message, buttonId = null) => {
  actionLog.value.unshift({
    message,
    buttonId,
    timestamp: new Date()
  })
  
  // Keep only last 50 actions
  if (actionLog.value.length > 50) {
    actionLog.value = actionLog.value.slice(0, 50)
  }
}

const clearLog = () => {
  actionLog.value = []
}

const formatTime = (timestamp) => {
  return timestamp.toLocaleTimeString('ru-RU', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  })
}

const getSeverityText = (severity) => {
  const severityMap = {
    'high': 'Высокая',
    'medium': 'Средняя',
    'low': 'Низкая'
  }
  return severityMap[severity] || 'Обычная'
}

// Navigation
const goToTV = () => {
  navigateTo(`/tv/${deviceId.value}`)
}

const goBack = () => {
  router.back()
}

// Validate device exists
onMounted(() => {
  if (!deviceInfo.value) {
    throw createError({
      statusCode: 404,
      statusMessage: `Устройство с ID ${deviceId.value} не найдено`
    })
  }
})

// Meta tags
useHead({
  title: computed(() => 
    deviceInfo.value ? `Пульт ${deviceInfo.value.name}` : 'Пульт управления'
  ),
  meta: [
    { 
      name: 'description', 
      content: computed(() => 
        deviceInfo.value 
          ? `Интерактивный пульт управления для ${deviceInfo.value.name}`
          : 'Интерактивный пульт управления'
      )
    }
  ]
})
</script>
