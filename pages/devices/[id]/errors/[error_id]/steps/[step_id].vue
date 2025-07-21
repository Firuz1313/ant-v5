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
          <NuxtLink :to="`/devices/${deviceId}/errors/${errorId}`" class="hover:text-primary-600">{{ error?.title }}</NuxtLink>
          <span>→</span>
          <span class="text-gray-900 dark:text-white">Шаг {{ currentStepIndex + 1 }}</span>
        </nav>
        
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl lg:text-4xl font-poppins font-bold text-gray-900 dark:text-white mb-2">
              {{ currentStep?.title }}
            </h1>
            <p class="text-lg text-gray-600 dark:text-gray-300">
              Шаг {{ currentStepIndex + 1 }} из {{ steps?.length || 0 }}
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
              @click="startFullDiagnostic" 
              class="btn-primary"
            >
              🚀 Полная диагностика
            </button>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="mt-6">
          <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Прогресс диагностики</span>
            <span>{{ Math.round(((currentStepIndex + 1) / (steps?.length || 1)) * 100) }}%</span>
          </div>
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              class="bg-primary-600 h-2 rounded-full transition-all duration-300"
              :style="`width: ${((currentStepIndex + 1) / (steps?.length || 1)) * 100}%`"
            ></div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Step Content -->
        <div class="lg:col-span-2">
          <div v-if="stepsPending" class="card p-8 animate-pulse">
            <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div class="h-64 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
            <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          </div>

          <div v-else-if="stepsError" class="card p-8 text-center">
            <div class="text-red-500 mb-4">
              <svg class="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Ошибка загрузки шага
            </h3>
            <p class="text-gray-600 dark:text-gray-400 mb-4">{{ stepsError.message }}</p>
            <button @click="refreshSteps()" class="btn-primary">
              Попробовать снова
            </button>
          </div>

          <div v-else-if="currentStep" class="space-y-6">
            <!-- Step Content -->
            <div class="card p-8">
              <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                {{ currentStep.title }}
              </h2>

              <!-- Step Image -->
              <div v-if="currentStep.screen_image" class="mb-6">
                <img 
                  :src="currentStep.screen_image" 
                  :alt="currentStep.title"
                  class="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
                >
              </div>

              <!-- Instruction -->
              <div class="prose dark:prose-invert max-w-none mb-6">
                <p class="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  {{ currentStep.instruction }}
                </p>
              </div>

              <!-- Tip -->
              <div v-if="currentStep.tip" class="bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-400 p-4 rounded-r-lg mb-6">
                <div class="flex items-start space-x-3">
                  <svg class="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                  </svg>
                  <div>
                    <h4 class="font-medium text-blue-900 dark:text-blue-100 mb-1">Полезная подсказка</h4>
                    <p class="text-blue-800 dark:text-blue-200">{{ currentStep.tip }}</p>
                  </div>
                </div>
              </div>

              <!-- Button Highlight -->
              <div v-if="currentStep.highlighted_button" class="bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-400 p-4 rounded-r-lg mb-6">
                <div class="flex items-start space-x-3">
                  <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path>
                  </svg>
                  <div>
                    <h4 class="font-medium text-yellow-900 dark:text-yellow-100 mb-1">Кнопка для нажатия</h4>
                    <p class="text-yellow-800 dark:text-yellow-200">Найдите и нажмите кнопку: <strong>{{ currentStep.highlighted_button }}</strong></p>
                  </div>
                </div>
              </div>

              <!-- Audio Player -->
              <div v-if="currentStep.audio_url" class="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg mb-6">
                <div class="flex items-center space-x-3 mb-3">
                  <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"></path>
                  </svg>
                  <h4 class="font-medium text-purple-900 dark:text-purple-100">Аудио-инструкция</h4>
                </div>
                <audio 
                  controls 
                  class="w-full"
                  :src="currentStep.audio_url"
                >
                  Ваш браузер не поддерживает аудио.
                </audio>
              </div>
            </div>

            <!-- Navigation -->
            <div class="card p-6">
              <div class="flex items-center justify-between">
                <div>
                  <button 
                    v-if="currentStepIndex > 0"
                    @click="goToPreviousStep"
                    class="btn-secondary"
                  >
                    ← Предыдущий шаг
                  </button>
                </div>
                
                <div class="text-center">
                  <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Выполнили этот шаг?
                  </p>
                  <div class="space-x-3">
                    <button 
                      @click="markStepComplete(false)"
                      class="px-4 py-2 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                    >
                      ❌ Не помогло
                    </button>
                    <button 
                      @click="markStepComplete(true)"
                      class="px-4 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                    >
                      ✅ Помогло
                    </button>
                  </div>
                </div>

                <div>
                  <button 
                    v-if="currentStepIndex < (steps?.length || 0) - 1"
                    @click="goToNextStep"
                    class="btn-primary"
                  >
                    Следующий шаг →
                  </button>
                  <button 
                    v-else
                    @click="completeDiagnostic"
                    class="btn-primary"
                  >
                    Завершить ✨
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="card p-8 text-center">
            <div class="text-gray-400 mb-4">
              <svg class="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Шаг не найден
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Запрашиваемый шаг диагностики не существует
            </p>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Steps Overview -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Все шаги</h3>
            <div class="space-y-2">
              <div 
                v-for="(step, index) in steps" 
                :key="step.id"
                class="flex items-center space-x-3 p-2 rounded-lg cursor-pointer"
                :class="{
                  'bg-primary-100 dark:bg-primary-900': index === currentStepIndex,
                  'hover:bg-gray-100 dark:hover:bg-gray-800': index !== currentStepIndex
                }"
                @click="goToStep(index)"
              >
                <div 
                  class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold"
                  :class="{
                    'bg-primary-600 text-white': index === currentStepIndex,
                    'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400': index !== currentStepIndex
                  }"
                >
                  {{ index + 1 }}
                </div>
                <span 
                  class="text-sm truncate"
                  :class="{
                    'text-primary-900 dark:text-primary-100 font-medium': index === currentStepIndex,
                    'text-gray-600 dark:text-gray-400': index !== currentStepIndex
                  }"
                >
                  {{ step.title }}
                </span>
              </div>
            </div>
          </div>

          <!-- Remote Control Widget -->
          <div v-if="device" class="card p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Пульт управления</h3>
            <div class="text-center">
              <RemoteControl 
                :device="device" 
                :highlighted-button="currentStep?.highlighted_button"
                class="max-w-48 mx-auto"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Интерактивный пульт для помощи
              </p>
            </div>
          </div>

          <!-- Help Section -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Нужна помощь?</h3>
            <div class="space-y-3">
              <button class="w-full btn-secondary text-left text-sm">
                📞 Связаться с поддержкой
              </button>
              <button class="w-full btn-secondary text-left text-sm">
                💬 Открыть чат
              </button>
              <button class="w-full btn-secondary text-left text-sm">
                📖 Руководство пользователя
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
const stepId = computed(() => route.params.step_id)

// Fetch data
const { data: device } = await useLazyFetch(`/api/devices/${deviceId.value}`)
const { data: error } = await useLazyFetch(`/api/errors/${deviceId.value}`)
const { data: steps, pending: stepsPending, error: stepsError, refresh: refreshSteps } = 
  await useLazyFetch(`/api/steps/${deviceId.value}/${errorId.value}`)

// Find current step
const currentStepIndex = computed(() => {
  if (!steps.value || !stepId.value) return 0
  return steps.value.findIndex(step => step.id == stepId.value)
})

const currentStep = computed(() => {
  if (!steps.value || currentStepIndex.value === -1) return null
  return steps.value[currentStepIndex.value]
})

// Find specific error
const errorInfo = computed(() => {
  if (!error.value || !Array.isArray(error.value)) return null
  return error.value.find(e => e.id == errorId.value)
})

// Methods
const goBack = () => {
  router.back()
}

const startFullDiagnostic = () => {
  navigateTo(`/diagnostic/${deviceId.value}/${errorId.value}`)
}

const goToStep = (index) => {
  if (!steps.value || !steps.value[index]) return
  const step = steps.value[index]
  navigateTo(`/devices/${deviceId.value}/errors/${errorId.value}/steps/${step.id}`)
}

const goToPreviousStep = () => {
  if (currentStepIndex.value > 0) {
    goToStep(currentStepIndex.value - 1)
  }
}

const goToNextStep = () => {
  if (currentStepIndex.value < (steps.value?.length || 0) - 1) {
    goToStep(currentStepIndex.value + 1)
  }
}

const markStepComplete = (success) => {
  console.log(`Step ${currentStepIndex.value + 1} marked as:`, success ? 'successful' : 'failed')
  // Here you would typically save the progress
  
  if (success && currentStepIndex.value < (steps.value?.length || 0) - 1) {
    // Auto-advance to next step if successful
    setTimeout(() => {
      goToNextStep()
    }, 500)
  }
}

const completeDiagnostic = () => {
  console.log('Diagnostic completed')
  // Navigate to completion page or show completion modal
  navigateTo(`/devices/${deviceId.value}/errors/${errorId.value}?completed=true`)
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

if (!currentStep.value && !stepsPending.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Шаг не найден'
  })
}

// Meta tags
useHead({
  title: computed(() => `Шаг ${currentStepIndex.value + 1}: ${currentStep.value?.title} - ${device.value?.name}`),
  meta: [
    { 
      name: 'description', 
      content: computed(() => `Пошаговая инструкция: ${currentStep.value?.instruction}`) 
    }
  ]
})
</script>
