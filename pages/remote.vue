<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center p-4">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-white mb-4">
          🎮 Пульт управления
        </h1>
        <p class="text-gray-300">
          Интерактивный пульт для диагностики ТВ-приставок
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <!-- Remote Control -->
        <div class="flex justify-center">
          <EnhancedRemoteControl
            :device="currentDevice"
            :highlighted-buttons="highlightedButtons"
            :completed-actions="completedActions"
            @button-press="handleButtonPress"
          />
        </div>

        <!-- Control Panel -->
        <div class="space-y-6">
          <!-- Device Selection -->
          <div class="bg-gray-800 p-6 rounded-xl">
            <h3 class="text-xl font-semibold text-white mb-4">Выбор устройства</h3>
            <select 
              v-model="currentDevice"
              class="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500"
            >
              <option v-for="device in devices" :key="device.id" :value="device">
                {{ device.name }}
              </option>
            </select>
          </div>

          <!-- Button Highlighting Control -->
          <div class="bg-gray-800 p-6 rounded-xl">
            <h3 class="text-xl font-semibold text-white mb-4">Управление подсветкой</h3>
            
            <!-- Preset combinations -->
            <div class="grid grid-cols-2 gap-3 mb-4">
              <button 
                @click="highlightButtons(['menu', 'ok'])"
                class="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                MENU + OK
              </button>
              <button 
                @click="highlightButtons(['up', 'down', 'ok'])"
                class="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Навигация
              </button>
              <button 
                @click="highlightButtons(['info'])"
                class="p-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                INFO
              </button>
              <button 
                @click="clearHighlights"
                class="p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Очистить
              </button>
            </div>

            <!-- Manual button selection -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Выберите кнопки для подсветки:
              </label>
              <div class="grid grid-cols-3 gap-2">
                <label v-for="button in availableButtons" :key="button.id" class="flex items-center space-x-2 text-sm text-gray-300">
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
            <h3 class="text-xl font-semibold text-white mb-4">Лог действий</h3>
            <div class="max-h-48 overflow-y-auto">
              <div v-if="actionLog.length === 0" class="text-gray-400 text-center py-4">
                Действия будут отображаться здесь
              </div>
              <div 
                v-for="(action, index) in actionLog" 
                :key="index"
                class="mb-2 p-2 bg-gray-700 rounded text-sm text-gray-300"
              >
                <span class="text-blue-400">{{ formatTime(action.timestamp) }}:</span>
                {{ action.message }}
              </div>
            </div>
            <button 
              @click="clearLog"
              class="mt-4 w-full p-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm"
            >
              Очистить лог
            </button>
          </div>

          <!-- Navigation -->
          <div class="bg-gray-800 p-6 rounded-xl">
            <h3 class="text-xl font-semibold text-white mb-4">Навигация</h3>
            <div class="grid grid-cols-2 gap-3">
              <button 
                @click="goToTV"
                class="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                📺 ТВ экран
              </button>
              <button 
                @click="goHome"
                class="p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                🏠 Главная
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Device data
const { data: devices } = await useLazyFetch('/api/devices')
const currentDevice = ref(devices.value?.[3] || { id: 4, name: 'Openbox GOLD' }) // Default to Openbox GOLD

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
const highlightButtons = (buttons) => {
  highlightedButtons.value = [...buttons]
  logAction(`Подсвечены кнопки: ${buttons.join(', ')}`)
}

const clearHighlights = () => {
  highlightedButtons.value = []
  completedActions.value = []
  logAction('Подсветка очищена')
}

const handleButtonPress = (buttonId) => {
  if (!completedActions.value.includes(buttonId)) {
    completedActions.value.push(buttonId)
  }
  logAction(`Нажата кнопка: ${buttonId}`)
}

const logAction = (message) => {
  actionLog.value.unshift({
    message,
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

// Navigation
const goToTV = () => {
  navigateTo('/tv')
}

const goHome = () => {
  navigateTo('/')
}

// Meta tags
useHead({
  title: 'Пульт управления - Диагностика приставок',
  meta: [
    { name: 'description', content: 'Интерактивный пульт управления для диагностики ТВ-приставок' }
  ]
})
</script>
