<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-dark-300 dark:to-dark-200">
    <div class="container mx-auto px-4 py-12">
      <!-- Header -->
      <div class="text-center mb-12">
        <nav class="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
          <NuxtLink to="/devices" class="hover:text-primary-600">Устройства</NuxtLink>
          <span>→</span>
          <span class="text-gray-900 dark:text-white">{{ device?.name }}</span>
        </nav>
        
        <h1 class="text-4xl lg:text-5xl font-poppins font-bold text-gray-900 dark:text-white mb-4">
          {{ device?.name }}
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Выберите проблему, которая возникла с вашей при��тавкой
        </p>
      </div>

      <!-- Device Info Card -->
      <div v-if="device" class="max-w-4xl mx-auto mb-12">
        <div class="card p-6">
          <div class="flex items-center space-x-6">
            <div class="w-20 h-20 bg-primary-100 dark:bg-primary-900 rounded-xl flex items-center justify-center">
              <span v-if="device.icon" class="text-4xl">{{ device.icon }}</span>
              <svg v-else class="w-10 h-10 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
              </svg>
            </div>
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ device.name }}</h2>
              <p class="text-gray-600 dark:text-gray-400 mb-4">{{ device.description }}</p>
              <div class="flex space-x-4 text-sm">
                <span class="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                  {{ errors?.length || 0 }} проблем доступно
                </span>
                <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                  Поддерживается
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Errors Grid -->
      <div class="max-w-6xl mx-auto">
        <div v-if="errorsPending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="i in 6" :key="i" class="card animate-pulse p-6">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div class="flex-1">
                <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="errorsError" class="text-center py-12">
          <div class="text-red-500 mb-4">
            <svg class="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Ошибка загрузки проблем
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">{{ errorsError.message }}</p>
          <button @click="refreshErrors()" class="btn-primary">
            Попробовать снова
          </button>
        </div>

        <div v-else-if="errors && errors.length > 0" class="space-y-6">
          <!-- Error Categories -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <NuxtLink
              v-for="error in errors"
              :key="error.id"
              :to="`/devices/${device.id}/errors/${error.id}`"
              class="group card p-6 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <div class="flex items-start space-x-4">
                <!-- Error Icon -->
                <div class="flex-shrink-0">
                  <div 
                    class="w-12 h-12 rounded-full flex items-center justify-center"
                    :class="{
                      'bg-red-100 dark:bg-red-900': getSeverityColor(error.severity) === 'red',
                      'bg-yellow-100 dark:bg-yellow-900': getSeverityColor(error.severity) === 'yellow',
                      'bg-orange-100 dark:bg-orange-900': getSeverityColor(error.severity) === 'orange',
                      'bg-gray-100 dark:bg-gray-700': getSeverityColor(error.severity) === 'gray'
                    }"
                  >
                    <span v-if="error.icon" class="text-2xl">{{ error.icon }}</span>
                    <svg v-else class="w-6 h-6 text-current" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                </div>

                <!-- Error Info -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-2 mb-2">
                    <h3 class="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {{ error.title }}
                    </h3>
                    <span 
                      v-if="error.severity"
                      class="px-2 py-1 text-xs rounded-full"
                      :class="{
                        'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100': error.severity === 'high',
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100': error.severity === 'medium',
                        'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100': error.severity === 'low'
                      }"
                    >
                      {{ getSeverityLabel(error.severity) }}
                    </span>
                  </div>
                  <p class="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    {{ error.description }}
                  </p>
                  
                  <!-- Error Stats -->
                  <div class="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                    <span>{{ error.stepsCount || 0 }} шагов</span>
                    <span class="text-primary-600 dark:text-primary-400 font-medium group-hover:underline">
                      Диагностика →
                    </span>
                  </div>
                </div>
              </div>
            </NuxtLink>
          </div>

          <!-- Quick Actions -->
          <div class="mt-12 bg-white dark:bg-dark-100 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Быстрые действия</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button class="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-gray-900 dark:text-white">Общая диагностика</span>
              </button>
              <button class="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"></path>
                </svg>
                <span class="text-gray-900 dark:text-white">Настройки устройства</span>
              </button>
              <button class="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <svg class="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                </svg>
                <span class="text-gray-900 dark:text-white">Связаться с поддержкой</span>
              </button>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12">
          <div class="text-gray-400 mb-4">
            <svg class="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Проблемы не найдены
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            Для этого устройства пока нет доступных диагностик
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const deviceId = computed(() => route.params.id)

// Fetch device info
const { data: device } = await useLazyFetch(`/api/devices/${deviceId.value}`)

// Fetch errors for this device
const { data: errors, pending: errorsPending, error: errorsError, refresh: refreshErrors } = 
  await useLazyFetch(`/api/errors/${deviceId.value}`)

// Helper functions
const getSeverityColor = (severity) => {
  switch (severity) {
    case 'high': return 'red'
    case 'medium': return 'yellow'
    case 'low': return 'green'
    default: return 'gray'
  }
}

const getSeverityLabel = (severity) => {
  switch (severity) {
    case 'high': return 'Критично'
    case 'medium': return 'Средний'
    case 'low': return 'Низкий'
    default: return 'Обычный'
  }
}

// Error handling
if (!device.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Устройство не найдено'
  })
}

// Meta tags
useHead({
  title: computed(() => `${device.value?.name} - Проблемы и диагностика`),
  meta: [
    { 
      name: 'description', 
      content: computed(() => `Диагностика проблем для ${device.value?.name}. Выберите проблему для получения пошаговых инструкций`) 
    }
  ]
})
</script>
