<template>
  <div class="min-h-screen bg-black flex items-center justify-center p-4">
    <div class="max-w-6xl mx-auto w-full">
      <!-- Header Controls -->
      <div class="mb-6 flex items-center justify-between">
        <nav class="flex items-center space-x-2 text-sm text-gray-400">
          <NuxtLink to="/" class="hover:text-white">Главная</NuxtLink>
          <span>→</span>
          <span class="text-white">{{ deviceInfo?.name || 'ТВ экран' }}</span>
        </nav>
        
        <div class="flex space-x-3">
          <button @click="goToRemote" class="btn-primary">
            🎮 Открыть пульт
          </button>
          <button @click="goBack" class="btn-secondary">
            ← Назад
          </button>
        </div>
      </div>

      <!-- Main TV Display -->
      <div class="bg-gray-900 rounded-3xl p-8 shadow-2xl border-8 border-gray-800">
        <!-- TV Screen Header -->
        <div class="flex items-center justify-between mb-6">
          <div class="text-white">
            <h1 class="text-2xl font-bold">{{ deviceInfo?.name || 'ТВ-приставка' }}</h1>
            <p class="text-gray-400 text-sm">{{ deviceInfo?.description || 'Симуляция экрана' }}</p>
          </div>
          
          <!-- Status indicators -->
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span class="text-green-400 text-sm">В сети</span>
            </div>
            <div class="text-white text-sm bg-gray-800 px-3 py-1 rounded">
              HD {{ currentResolution }}
            </div>
          </div>
        </div>

        <!-- Main Screen Content -->
        <div class="bg-black rounded-2xl h-96 lg:h-[500px] flex items-center justify-center relative overflow-hidden">
          <!-- Current Step Display -->
          <div v-if="currentStep && selectedError" class="w-full h-full flex items-center justify-center">
            <!-- Step Image -->
            <div v-if="currentStep.media || currentStep.screen_image" class="w-full h-full">
              <img 
                :src="currentStep.media?.url || currentStep.screen_image" 
                :alt="currentStep.title"
                class="w-full h-full object-cover rounded-xl"
              />
              
              <!-- Step overlay info -->
              <div class="absolute bottom-4 left-4 right-4 bg-black bg-opacity-75 p-4 rounded-lg">
                <h3 class="text-white text-lg font-semibold mb-2">
                  Шаг {{ currentStepIndex + 1 }}: {{ currentStep.title }}
                </h3>
                <p class="text-gray-300 text-sm">
                  {{ currentStep.instruction }}
                </p>
                <div v-if="currentStep.tip" class="mt-2 text-blue-300 text-sm">
                  💡 {{ currentStep.tip }}
                </div>
              </div>
            </div>

            <!-- Text-only step -->
            <div v-else class="text-center text-white space-y-6 px-8">
              <h3 class="text-3xl font-bold">
                Шаг {{ currentStepIndex + 1 }}: {{ currentStep.title }}
              </h3>
              <p class="text-xl text-gray-300">
                {{ currentStep.instruction }}
              </p>
              <div v-if="currentStep.tip" class="bg-blue-900 bg-opacity-50 p-4 rounded-lg">
                <p class="text-blue-200">
                  💡 {{ currentStep.tip }}
                </p>
              </div>
            </div>
          </div>

          <!-- Error Selection Screen -->
          <div v-else-if="selectedError && !currentStep" class="text-center text-white space-y-6">
            <div class="text-6xl mb-4">{{ selectedError.icon || '⚠️' }}</div>
            <h3 class="text-3xl font-bold">{{ selectedError.title }}</h3>
            <p class="text-xl text-gray-300">{{ selectedError.description }}</p>
            <button @click="startSteps" class="btn-primary">
              🚀 Начать диагностику
            </button>
          </div>

          <!-- Default Screen -->
          <div v-else class="text-center text-white space-y-6">
            <div class="text-8xl mb-6">📺</div>
            <h3 class="text-3xl font-semibold">{{ deviceInfo?.name || 'ТВ-приставка' }}</h3>
            <p class="text-xl text-gray-400">Готов к диагностике</p>
            
            <!-- Quick error selection -->
            <div v-if="errors.length > 0" class="space-y-4">
              <p class="text-lg text-gray-300">Выберите проблему:</p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                <button
                  v-for="error in errors"
                  :key="error.id"
                  @click="selectError(error)"
                  class="p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-left"
                >
                  <div class="flex items-center space-x-3">
                    <span class="text-2xl">{{ error.icon || '⚠️' }}</span>
                    <div>
                      <h4 class="font-medium">{{ error.title }}</h4>
                      <p class="text-sm text-gray-400">{{ error.description }}</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- TV Controls and Status -->
        <div class="mt-6">
          <!-- Progress bar for steps -->
          <div v-if="steps.length > 0 && selectedError" class="mb-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-white text-sm">
                Прогресс диагностики
              </span>
              <span class="text-gray-400 text-sm">
                {{ currentStepIndex + 1 }} из {{ steps.length }}
              </span>
            </div>
            <div class="w-full bg-gray-700 rounded-full h-2">
              <div 
                class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                :style="{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }"
              ></div>
            </div>
          </div>

          <!-- Control buttons -->
          <div class="flex justify-center space-x-4">
            <button 
              v-if="currentStepIndex > 0"
              @click="previousStep"
              class="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              ← Назад
            </button>
            
            <button 
              v-if="currentStep && currentStepIndex < steps.length - 1"
              @click="nextStep"
              class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Следующий →
            </button>
            
            <button 
              v-if="currentStep && currentStepIndex === steps.length - 1"
              @click="completeSteps"
              class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              ✅ Завершить
            </button>
            
            <button 
              @click="goToRemote"
              class="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              🎮 Пульт
            </button>
          </div>
        </div>
      </div>

      <!-- Status Information Panel -->
      <div class="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
        <div class="bg-gray-800 p-4 rounded-lg">
          <div class="text-green-400 text-lg font-semibold">Статус</div>
          <div class="text-white">{{ connectionStatus }}</div>
        </div>
        <div class="bg-gray-800 p-4 rounded-lg">
          <div class="text-blue-400 text-lg font-semibold">Устройство</div>
          <div class="text-white">{{ deviceInfo?.name || 'Не выбрано' }}</div>
        </div>
        <div class="bg-gray-800 p-4 rounded-lg">
          <div class="text-yellow-400 text-lg font-semibold">Проблема</div>
          <div class="text-white">{{ selectedError?.title || 'Не выбрана' }}</div>
        </div>
        <div class="bg-gray-800 p-4 rounded-lg">
          <div class="text-purple-400 text-lg font-semibold">Шаг</div>
          <div class="text-white">{{ currentStepIndex + 1 }}/{{ steps.length || 0 }}</div>
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

// State
const selectedError = ref(null)
const steps = ref([])
const currentStepIndex = ref(0)
const connectionStatus = ref('Подключено')
const currentResolution = ref('1080p')

// Computed
const currentStep = computed(() => {
  return steps.value[currentStepIndex.value] || null
})

// Check for query parameters
onMounted(() => {
  const { error: errorId } = route.query
  
  if (errorId && errors.value) {
    const error = errors.value.find(e => e.id == errorId)
    if (error) {
      selectError(error)
    }
  }
})

// Methods
const selectError = async (error) => {
  selectedError.value = error
  
  try {
    const stepData = await $fetch(`/api/steps/${deviceId.value}/${error.id}`)
    steps.value = stepData || []
    currentStepIndex.value = 0
  } catch (err) {
    console.error('Failed to load steps:', err)
    steps.value = []
  }
}

const startSteps = () => {
  if (steps.value.length > 0) {
    currentStepIndex.value = 0
  }
}

const nextStep = () => {
  if (currentStepIndex.value < steps.value.length - 1) {
    currentStepIndex.value++
  }
}

const previousStep = () => {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--
  }
}

const completeSteps = () => {
  // Log completion
  console.log('Диагностика завершена')
  
  // Could send completion event to analytics
  $fetch('/api/analytics', {
    method: 'POST',
    body: {
      type: 'diagnostic_completed',
      deviceId: deviceId.value,
      errorId: selectedError.value?.id,
      stepsCompleted: steps.value.length,
      timestamp: new Date().toISOString()
    }
  }).catch(console.error)
  
  // Reset to start
  currentStepIndex.value = 0
}

// Navigation
const goToRemote = () => {
  const query = selectedError.value ? { error: selectedError.value.id } : {}
  navigateTo({ 
    path: `/remote/${deviceId.value}`,
    query 
  })
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
    deviceInfo.value ? `ТВ ${deviceInfo.value.name}` : 'ТВ экран'
  ),
  meta: [
    { 
      name: 'description', 
      content: computed(() => 
        deviceInfo.value 
          ? `Симуляция экрана ${deviceInfo.value.name}`
          : 'Симуляция экрана ТВ-приставки'
      )
    }
  ]
})
</script>
