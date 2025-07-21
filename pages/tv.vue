<template>
  <div class="min-h-screen bg-black flex items-center justify-center">
    <div class="max-w-4xl mx-auto p-8">
      <!-- TV Screen Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-white mb-4">
          📺 ТВ Экран
        </h1>
        <p class="text-gray-300">
          Симуляция экрана ТВ-приставки
        </p>
      </div>

      <!-- Main TV Screen -->
      <div class="bg-gray-900 rounded-3xl p-8 shadow-2xl border-8 border-gray-800">
        <!-- TV Screen Content -->
        <div class="bg-black rounded-2xl h-96 flex items-center justify-center relative overflow-hidden">
          <!-- Device Logo/Brand -->
          <div class="absolute top-4 right-4 text-white text-sm bg-gray-800 px-3 py-1 rounded">
            {{ selectedDevice || 'Openbox GOLD' }}
          </div>

          <!-- Main Content Area -->
          <div class="text-center text-white">
            <div v-if="currentStep" class="space-y-6">
              <!-- Step Image -->
              <div v-if="currentStep.media" class="mb-6">
                <img 
                  :src="currentStep.media.url" 
                  :alt="currentStep.title"
                  class="max-w-full max-h-48 mx-auto rounded"
                />
              </div>

              <!-- Step Title -->
              <h2 class="text-2xl font-semibold mb-4">
                {{ currentStep.title }}
              </h2>

              <!-- Step Instruction -->
              <p class="text-lg text-gray-300 mb-6">
                {{ currentStep.instruction }}
              </p>

              <!-- Step Tip -->
              <div v-if="currentStep.tip" class="bg-blue-900 bg-opacity-50 p-4 rounded-lg">
                <p class="text-blue-200">
                  💡 {{ currentStep.tip }}
                </p>
              </div>
            </div>

            <!-- Default Screen -->
            <div v-else class="space-y-4">
              <div class="text-6xl mb-4">📺</div>
              <h3 class="text-2xl font-semibold">Экран готов к диагностике</h3>
              <p class="text-gray-400">Выберите устройство и ошибку для начала</p>
            </div>
          </div>
        </div>

        <!-- TV Controls -->
        <div class="flex justify-center mt-6 space-x-4">
          <button 
            @click="goHome"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            🏠 Главная
          </button>
          <button 
            @click="goToRemote"
            class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            ���� Пульт
          </button>
        </div>
      </div>

      <!-- Status Information -->
      <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div class="bg-gray-800 p-4 rounded-lg">
          <div class="text-green-400 text-lg font-semibold">Статус</div>
          <div class="text-white">{{ connectionStatus }}</div>
        </div>
        <div class="bg-gray-800 p-4 rounded-lg">
          <div class="text-blue-400 text-lg font-semibold">Устройство</div>
          <div class="text-white">{{ selectedDevice || 'Не выбрано' }}</div>
        </div>
        <div class="bg-gray-800 p-4 rounded-lg">
          <div class="text-yellow-400 text-lg font-semibold">Режим</div>
          <div class="text-white">{{ operatorMode ? 'Оператор' : 'Пользователь' }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Page data
const selectedDevice = ref('Openbox GOLD')
const connectionStatus = ref('Подключено')
const operatorMode = ref(false)
const currentStep = ref(null)

// Navigation methods
const goHome = () => {
  navigateTo('/')
}

const goToRemote = () => {
  navigateTo('/remote')
}

// Load step data if available from query params
onMounted(() => {
  const route = useRoute()
  
  if (route.query.device && route.query.error) {
    selectedDevice.value = route.query.device
    // Could load step data here
  }
})

// Meta tags
useHead({
  title: 'ТВ Экран - Диагностика приставок',
  meta: [
    { name: 'description', content: 'Симуляция экрана ТВ-приставки для диагностики' }
  ]
})
</script>
