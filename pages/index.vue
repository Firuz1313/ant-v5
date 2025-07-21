<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-dark-300 dark:to-dark-200">
    <div class="container mx-auto px-4 py-12">
      <div class="text-center mb-12">
        <h1 class="text-4xl lg:text-6xl font-poppins font-bold text-gray-900 dark:text-white mb-4">
          Диагностика ТВ-приставок
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Простое и интуитивное решение для диагностики ошибок ТВ-приставок с пошаговыми инструкциями
        </p>
      </div>

      <div class="max-w-4xl mx-auto">
        <!-- Device Selection -->
        <div v-if="!selectedDevice" class="card p-8">
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
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
                <span v-if="device.icon" class="text-3xl">{{ device.icon }}</span>
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
// Load devices from API using useLazyFetch for SSR compatibility
const { data: devices } = await useLazyFetch('/api/devices')

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
}

// Navigation methods
const startDiagnostic = () => {
  if (selectedDevice.value && selectedError.value) {
    navigateTo(`/diagnostics/${selectedDevice.value.id}/${selectedError.value.id}`)
  }
}

const goToTV = () => {
  const query = selectedDevice.value && selectedError.value ?
    { device: selectedDevice.value.name, error: selectedError.value.title } : {}
  navigateTo({ path: '/tv', query })
}

const goToRemote = () => {
  navigateTo('/remote')
}

// Meta tags
useHead({
  title: 'Диагностика ТВ-приставок - Главная',
  meta: [
    { name: 'description', content: 'Интерактивная система диагностики ТВ-приставок с пошаговыми инструкциями' }
  ]
})
</script>
