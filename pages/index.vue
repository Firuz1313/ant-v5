<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-dark-300 dark:via-dark-200 dark:to-gray-900 relative overflow-hidden">
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 pointer-events-none">
      <!-- Floating TV Waves -->
      <div class="absolute top-20 left-10 opacity-20 dark:opacity-10">
        <svg class="w-32 h-32 animate-pulse" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="20" stroke="currentColor" stroke-width="2" class="text-blue-400">
            <animate attributeName="r" values="20;40;60;20" dur="4s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="1;0.5;0.2;1" dur="4s" repeatCount="indefinite"/>
          </circle>
          <circle cx="100" cy="100" r="40" stroke="currentColor" stroke-width="1" class="text-blue-300">
            <animate attributeName="r" values="40;60;80;40" dur="4s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.8;0.4;0.1;0.8" dur="4s" repeatCount="indefinite"/>
          </circle>
          <circle cx="100" cy="100" r="60" stroke="currentColor" stroke-width="1" class="text-blue-200">
            <animate attributeName="r" values="60;80;100;60" dur="4s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.6;0.3;0.1;0.6" dur="4s" repeatCount="indefinite"/>
          </circle>
        </svg>
      </div>
      
      <!-- Floating Remote Control -->
      <div class="absolute top-40 right-20 opacity-20 dark:opacity-10">
        <svg class="w-16 h-32 animate-bounce" viewBox="0 0 100 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="10" width="60" height="180" rx="15" fill="currentColor" class="text-gray-400 dark:text-gray-600"/>
          <circle cx="50" cy="40" r="8" fill="currentColor" class="text-red-400"/>
          <circle cx="35" cy="70" r="6" fill="currentColor" class="text-blue-400"/>
          <circle cx="65" cy="70" r="6" fill="currentColor" class="text-green-400"/>
          <circle cx="50" cy="100" r="6" fill="currentColor" class="text-yellow-400"/>
          <rect x="30" y="130" width="40" height="8" rx="4" fill="currentColor" class="text-gray-300"/>
          <rect x="30" y="150" width="40" height="8" rx="4" fill="currentColor" class="text-gray-300"/>
          <rect x="30" y="170" width="40" height="8" rx="4" fill="currentColor" class="text-gray-300"/>
        </svg>
      </div>
      
      <!-- Floating Antenna -->
      <div class="absolute bottom-20 left-20 opacity-20 dark:opacity-10">
        <svg class="w-24 h-24 animate-pulse" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 10 L30 40 L70 40 Z" stroke="currentColor" stroke-width="3" fill="none" class="text-indigo-400"/>
          <line x1="50" y1="40" x2="50" y2="80" stroke="currentColor" stroke-width="3" class="text-indigo-400"/>
          <rect x="45" y="75" width="10" height="15" rx="2" fill="currentColor" class="text-gray-400"/>
          <animateTransform attributeName="transform" type="rotate" values="-5 50 50;5 50 50;-5 50 50" dur="3s" repeatCount="indefinite"/>
        </svg>
      </div>
      
      <!-- More decorative elements -->
      <div class="absolute top-60 left-1/3 opacity-10 dark:opacity-5">
        <div class="w-4 h-4 bg-blue-400 rounded-full animate-ping"></div>
      </div>
      <div class="absolute bottom-40 right-1/3 opacity-10 dark:opacity-5">
        <div class="w-6 h-6 bg-purple-400 rounded-full animate-pulse"></div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-12 relative z-10">
      <!-- Hero Section -->
      <div class="text-center mb-16" v-if="!showDeviceSelection">
        <!-- Logo and Title -->
        <div class="mb-8">
          <div class="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-105 transition-transform duration-300">
            <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
            </svg>
          </div>
          <h1 class="text-4xl lg:text-6xl font-poppins font-bold text-gray-900 dark:text-white mb-4 leading-tight">
            Интерактивная Диагностика
            <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ТВ-приставок
            </span>
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed font-inter">
            Современный инструмент для быстрого решения проблем с ТВ-приставками.<br>
            Пошаговые инструкции с визуальными и звуковыми подсказками для пользователей любого возраста.
          </p>
        </div>
        
        <!-- Start Button -->
        <button 
          @click="showDeviceSelection = true"
          class="btn-primary text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 mb-8"
        >
          🚀 Начать диагностику
        </button>
        
        <!-- Quick Info -->
        <div class="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500 dark:text-gray-400">
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <span>Быстро и просто</span>
          </div>
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Проверенные решения</span>
          </div>
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path>
            </svg>
            <span>Для всех возрастов</span>
          </div>
        </div>
      </div>
      
      <!-- Features Section -->
      <div class="mb-16" v-if="!showDeviceSelection">
        <h2 class="text-3xl font-poppins font-bold text-center text-gray-900 dark:text-white mb-12">
          Возможности системы
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- Feature 1 -->
          <div class="text-center p-6 card hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Пошаговые инструкции</h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm">Четкие указания с визуальными подсказками для каждого этапа решения проблемы</p>
          </div>
          
          <!-- Feature 2 -->
          <div class="text-center p-6 card hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5H6.75a.75.75 0 000 1.5H7.5v4.25c0 3.105 2.395 5.25 5.5 5.25s5.5-2.145 5.5-5.25V12h.75a.75.75 0 000-1.5h-3.5z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Звуковые подсказки</h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm">Голосовые инструкции для пользователей с ограниченными возможностями</p>
          </div>
          
          <!-- Feature 3 -->
          <div class="text-center p-6 card hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Поддержка устройств</h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm">Совместимость с популярными моделями ТВ-приставок</p>
          </div>
          
          <!-- Feature 4 -->
          <div class="text-center p-6 card hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">24/7 Доступность</h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm">Система работает круглосуточно без необходимости обращения в поддержку</p>
          </div>
        </div>
      </div>

      <!-- Call to Action Section (when device selection is not shown) -->
      <div v-if="!showDeviceSelection" class="text-center">
        <div class="card p-12 max-w-2xl mx-auto">
          <h2 class="text-2xl font-poppins font-bold text-gray-900 dark:text-white mb-6">
            Готовы начать диагностику?
          </h2>
          <p class="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            Выберите вашу модель ТВ-приставки и следуйте простым инструкциям для решения технических проблем.
            Наша система поможет вам быстро найти и устранить неисправности.
          </p>
          <button 
            @click="showDeviceSelection = true"
            class="btn-primary text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Выбрать приставку
          </button>
        </div>
        
        <!-- Statistics Section -->
        <div class="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div class="text-center">
            <div class="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">{{ stats.devices }}+</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Поддерживаемых устройств</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">{{ stats.solutions }}+</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Готовых решений</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">{{ stats.success }}%</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Успешных диагностик</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">{{ stats.avgTime }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Среднее время решения</div>
          </div>
        </div>
      </div>

      <div class="max-w-4xl mx-auto" v-if="showDeviceSelection">
        <!-- Back Button -->
        <div class="mb-6">
          <button 
            @click="showDeviceSelection = false"
            class="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd"></path>
            </svg>
            <span>На главную</span>
          </button>
        </div>

        <!-- Device Selection -->
        <div v-if="!selectedDevice" class="card p-8">
          <h2 class="text-2xl font-poppins font-semibold text-gray-900 dark:text-white mb-6 text-center leading-tight">
            Выберите вашу ТВ-приставку
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              v-for="device in devices"
              :key="device.id"
              @click="selectDevice(device)"
              class="device-card cursor-pointer p-6 text-center card hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <div class="w-16 h-16 mx-auto mb-4 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                <img
                  v-if="device.display_icon && device.display_icon.startsWith('/')"
                  :src="device.display_icon"
                  :alt="device.name"
                  class="w-12 h-12 object-contain"
                >
                <span v-else-if="device.display_icon" class="text-3xl">{{ device.display_icon }}</span>
                <svg v-else class="w-8 h-8 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {{ device.name }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ device.description }}
              </p>
            </div>
          </div>
        </div>

        <!-- Error Selection -->
        <div v-else-if="!selectedError" class="card p-8">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
              Выберите проблему: {{ selectedDevice.name }}
            </h2>
            <button
              @click="resetSelection"
              class="btn-secondary"
            >
              Назад
            </button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="error in errors"
              :key="error.id"
              @click="selectError(error)"
              class="error-card cursor-pointer p-4 card hover:shadow-lg transform hover:scale-102 transition-all duration-200"
            >
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 rounded-full flex items-center justify-center"
                     :class="{
                       'bg-red-100 dark:bg-red-900': error.severity === 'high',
                       'bg-yellow-100 dark:bg-yellow-900': error.severity === 'medium',
                       'bg-gray-100 dark:bg-gray-700': !error.severity
                     }">
                  <span v-if="error.icon" class="text-lg">{{ error.icon }}</span>
                  <svg v-else class="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <div class="flex-1">
                  <div class="flex items-center space-x-2">
                    <h3 class="font-medium text-gray-900 dark:text-white">{{ error.title }}</h3>
                    <span v-if="error.severity === 'high'" class="px-2 py-1 text-xs bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100 rounded-full">
                      Высокий приоритет
                    </span>
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ error.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Enhanced Diagnostic Interface for Openbox GOLD -->
        <EnhancedDiagnosticScreen 
          v-else-if="selectedDevice && selectedDevice.id === 4"
          :device="selectedDevice" 
          :error="selectedError"
          @back="selectedError = null"
          @restart="resetSelection"
        />
        
        <!-- Standard Diagnostic Interface for other devices -->
        <DiagnosticScreen 
          v-else
          :device="selectedDevice" 
          :error="selectedError"
          @back="selectedError = null"
          @restart="resetSelection"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
// Import settings store for admin-site synchronization
const settingsStore = useSettingsStore()

// Homepage state
const showDeviceSelection = ref(false)

// Statistics for homepage
const stats = ref({
  devices: 8,
  solutions: 150,
  success: 95,
  avgTime: '5 мин'
})

// Load devices from API using useLazyFetch for SSR compatibility
const { data: devices, refresh: refreshDevices } = await useLazyFetch('/api/devices', {
  key: 'devices',
  default: () => []
})

// Load settings to ensure synchronization
onMounted(async () => {
  await settingsStore.loadSettings()
  // Refresh devices to apply any new settings
  await refreshDevices()
  
  // Update stats from actual data
  if (devices.value && devices.value.length) {
    stats.value.devices = devices.value.length
  }
})

// Load errors when device is selected
const errors = ref([])
const selectedDevice = ref(null)
const selectedError = ref(null)

watch(selectedDevice, async (newDevice) => {
  if (newDevice) {
    try {
      const errorData = await $fetch(`/api/errors/${newDevice.id}`)
      errors.value = errorData
    } catch (error) {
      console.error('Failed to load errors:', error)
      errors.value = []
    }
  }
})

const selectDevice = (device) => {
  selectedDevice.value = device
}

const selectError = (error) => {
  selectedError.value = error
}

const resetSelection = () => {
  selectedDevice.value = null
  selectedError.value = null
  showDeviceSelection.value = true
}

// Navigation methods
const startDiagnostic = () => {
  if (selectedDevice.value && selectedError.value) {
    navigateTo(`/error/${selectedDevice.value.id}/${selectedError.value.id}`)
  }
}

const goToTV = () => {
  if (selectedDevice.value) {
    const query = selectedError.value ? { error: selectedError.value.id } : {}
    navigateTo({
      path: `/tv/${selectedDevice.value.id}`,
      query
    })
  } else {
    navigateTo('/tv/4') // Default to Openbox GOLD
  }
}

const goToRemote = () => {
  if (selectedDevice.value) {
    navigateTo(`/remote/${selectedDevice.value.id}`)
  } else {
    navigateTo('/remote/4') // Default to Openbox GOLD
  }
}

// Meta tags
useHead({
  title: 'Интерактивная диагностика ТВ-приставок - Главная',
  meta: [
    { name: 'description', content: 'Современная система диагностики ТВ-приставок с пошаговыми инструкциями, визуальными и звуковыми подсказками' }
  ]
})
</script>
