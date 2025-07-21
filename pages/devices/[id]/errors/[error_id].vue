<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-dark-300 dark:to-dark-200">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <nav class="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
          <NuxtLink to="/devices" class="hover:text-primary-600">Устройства</NuxtLink>
          <span>→</span>
          <NuxtLink :to="`/devices/${deviceId}/errors`" class="hover:text-primary-600">{{ device?.name }}</NuxtLink>
          <span>→</span>
          <span class="text-gray-900 dark:text-white">{{ error?.title }}</span>
        </nav>
        
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl lg:text-4xl font-poppins font-bold text-gray-900 dark:text-white mb-2">
              {{ error?.title }}
            </h1>
            <p class="text-lg text-gray-600 dark:text-gray-300">
              {{ error?.description }}
            </p>
          </div>
          <div class="flex space-x-4">
            <button 
              @click="goBack" 
              class="btn-secondary"
            >
              ← Назад
            </button>
            <button 
              @click="startDiagnostic" 
              class="btn-primary"
            >
              🚀 Начать диагностику
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Steps List -->
        <div class="lg:col-span-2">
          <div class="card p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                Шаги диагностики ({{ steps?.length || 0 }})
              </h2>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-500 dark:text-gray-400">
                  Примерное время:
                </span>
                <span class="text-sm font-medium text-primary-600 dark:text-primary-400">
                  {{ estimatedTime }} мин
                </span>
              </div>
            </div>

            <div v-if="stepsPending" class="space-y-4">
              <div v-for="i in 5" :key="i" class="animate-pulse">
                <div class="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div class="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div class="flex-1">
                    <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else-if="stepsError" class="text-center py-8">
              <div class="text-red-500 mb-4">
                <svg class="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Ошибка загрузки шагов
              </h3>
              <p class="text-gray-600 dark:text-gray-400 mb-4">{{ stepsError.message }}</p>
              <button @click="refreshSteps()" class="btn-primary">
                Попробовать снова
              </button>
            </div>

            <div v-else-if="steps && steps.length > 0" class="space-y-4">
              <div
                v-for="(step, index) in steps"
                :key="step.id"
                class="flex items-start space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
              >
                <!-- Step Number -->
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 rounded-full flex items-center justify-center font-semibold text-sm">
                    {{ index + 1 }}
                  </div>
                </div>

                <!-- Step Content -->
                <div class="flex-1 min-w-0">
                  <h3 class="font-medium text-gray-900 dark:text-white mb-2">
                    {{ step.title }}
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    {{ step.instruction }}
                  </p>
                  
                  <!-- Step Meta -->
                  <div class="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                    <span v-if="step.screen_image" class="flex items-center space-x-1">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path>
                      </svg>
                      <span>Скриншот</span>
                    </span>
                    <span v-if="step.highlighted_button" class="flex items-center space-x-1">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path>
                      </svg>
                      <span>Кнопка: {{ step.highlighted_button }}</span>
                    </span>
                    <span v-if="step.audio_url" class="flex items-center space-x-1">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"></path>
                      </svg>
                      <span>Аудио</span>
                    </span>
                    <span v-if="step.tip" class="flex items-center space-x-1">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                      </svg>
                      <span>Подсказка</span>
                    </span>
                  </div>
                </div>

                <!-- Step Actions -->
                <div class="flex-shrink-0">
                  <NuxtLink 
                    :to="`/devices/${deviceId}/errors/${errorId}/steps/${step.id}`"
                    class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium"
                  >
                    Подробнее →
                  </NuxtLink>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-8">
              <div class="text-gray-400 mb-4">
                <svg class="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Шаги не найдены
              </h3>
              <p class="text-gray-600 dark:text-gray-400">
                Для этой проблемы пока нет пошаговых инструкций
              </p>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Device Info -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Информация об устройстве</h3>
            <div class="space-y-3">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                  <span v-if="device?.icon" class="text-lg">{{ device.icon }}</span>
                  <svg v-else class="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                  </svg>
                </div>
                <div>
                  <h4 class="font-medium text-gray-900 dark:text-white">{{ device?.name }}</h4>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ device?.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Progress Overview -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Обзор диагностики</h3>
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-gray-600 dark:text-gray-400">Всего шагов:</span>
                <span class="font-semibold text-gray-900 dark:text-white">{{ steps?.length || 0 }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600 dark:text-gray-400">Время выполнения:</span>
                <span class="font-semibold text-gray-900 dark:text-white">{{ estimatedTime }} мин</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600 dark:text-gray-400">Сложность:</span>
                <span class="font-semibold" :class="difficultyColor">{{ difficultyLabel }}</span>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Быстрые действия</h3>
            <div class="space-y-3">
              <button 
                @click="startDiagnostic"
                class="w-full btn-primary text-left"
              >
                🚀 Начать диагностику
              </button>
              <button 
                @click="downloadGuide"
                class="w-full btn-secondary text-left"
              >
                📄 Скачать руководство
              </button>
              <button 
                @click="shareGuide"
                class="w-full btn-secondary text-left"
              >
                📤 Поделиться
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

const deviceId = computed(() => route.params.id)
const errorId = computed(() => route.params.error_id)

// Fetch data
const { data: device } = await useLazyFetch(`/api/devices/${deviceId.value}`)
const { data: error } = await useLazyFetch(`/api/errors/${deviceId.value}`)
const { data: steps, pending: stepsPending, error: stepsError, refresh: refreshSteps } = 
  await useLazyFetch(`/api/steps/${deviceId.value}/${errorId.value}`)

// Find specific error
const errorInfo = computed(() => {
  if (!error.value || !Array.isArray(error.value)) return null
  return error.value.find(e => e.id == errorId.value)
})

// Computed properties
const estimatedTime = computed(() => {
  if (!steps.value) return 0
  return Math.max(steps.value.length * 2, 5) // 2 minutes per step, minimum 5 minutes
})

const difficultyLabel = computed(() => {
  const stepCount = steps.value?.length || 0
  if (stepCount <= 3) return 'Легко'
  if (stepCount <= 7) return 'Средне'
  return 'Сложно'
})

const difficultyColor = computed(() => {
  const stepCount = steps.value?.length || 0
  if (stepCount <= 3) return 'text-green-600 dark:text-green-400'
  if (stepCount <= 7) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-red-600 dark:text-red-400'
})

// Methods
const goBack = () => {
  router.back()
}

const startDiagnostic = () => {
  // Navigate to the full diagnostic page
  navigateTo(`/diagnostic/${deviceId.value}/${errorId.value}`)
}

const downloadGuide = () => {
  // Implementation for downloading guide
  console.log('Download guide')
}

const shareGuide = () => {
  // Implementation for sharing guide
  if (navigator.share) {
    navigator.share({
      title: `Диагностика: ${errorInfo.value?.title}`,
      text: `Пошаговая диагностика для ${device.value?.name}`,
      url: window.location.href
    })
  }
}

// Error handling
if (!device.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Устройство не найдено'
  })
}

if (!errorInfo.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Ошибка не найдена'
  })
}

// Meta tags
useHead({
  title: computed(() => `${errorInfo.value?.title} - ${device.value?.name}`),
  meta: [
    { 
      name: 'description', 
      content: computed(() => `Пошаговая диагностика проблемы "${errorInfo.value?.title}" для ${device.value?.name}`) 
    }
  ]
})
</script>
