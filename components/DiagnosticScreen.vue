<template>
  <div class="diagnostic-container">
    <!-- Progress indicator -->
    <div class="flex items-center justify-between mb-6">
      <button @click="$emit('back')" class="btn-secondary">
        ← Назад к ошибкам
      </button>
      <div class="flex items-center space-x-2">
        <span class="text-sm text-gray-600 dark:text-gray-400">
          Шаг {{ currentStep + 1 }} из {{ steps.length }}
        </span>
        <div class="flex space-x-1">
          <div
            v-for="(step, index) in steps"
            :key="index"
            class="w-2 h-2 rounded-full transition-colors"
            :class="index <= currentStep ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'"
          />
        </div>
      </div>
      <button @click="$emit('restart')" class="btn-secondary">
        Начать заново
      </button>
    </div>

    <!-- Main diagnostic interface -->
    <div class="diagnostic-main">
      <!-- TV Screen -->
      <div class="tv-screen-container">
        <div class="tv-screen">
          <img
            v-if="currentStepData.screenImage"
            :src="currentStepData.screenImage"
            :alt="currentStepData.title"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <div class="text-center text-white">
              <div class="text-6xl mb-4">📺</div>
              <p class="text-lg">{{ currentStepData.title }}</p>
            </div>
          </div>
          
          <!-- TV screen overlay for status -->
          <div class="absolute top-4 right-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded text-sm">
            {{ device.name }}
          </div>
        </div>
      </div>

      <!-- Remote Control -->
      <div class="remote-container">
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
            Пульт управления
          </h3>
          <RemoteControl 
            :device="device"
            :highlighted-button="currentStepData.highlightedButton"
            @button-press="handleButtonPress"
          />
        </div>
      </div>
    </div>

    <!-- Step instructions -->
    <div class="card p-6">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div class="flex-1">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {{ currentStepData.title }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            {{ currentStepData.instruction }}
          </p>
          <div v-if="currentStepData.tip" class="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
            <div class="flex items-start space-x-2">
              <svg class="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
              </svg>
              <p class="text-sm text-blue-800 dark:text-blue-200">
                {{ currentStepData.tip }}
              </p>
            </div>
          </div>
        </div>
        
        <div class="flex items-center space-x-3">
          <button
            v-if="currentStep > 0"
            @click="previousStep"
            class="btn-secondary"
          >
            ← Назад
          </button>
          <button
            v-if="currentStep < steps.length - 1"
            @click="nextStep"
            class="btn-primary"
          >
            Далее →
          </button>
          <button
            v-else
            @click="completeDiagnostic"
            class="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200"
          >
            Завершить
          </button>
        </div>
      </div>
    </div>

    <!-- Audio controls -->
    <div v-if="currentStepData.audioUrl" class="fixed bottom-4 right-4 z-50">
      <button
        @click="toggleAudio"
        class="bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-full shadow-lg transition-all duration-200"
        :title="isPlaying ? 'Остановить озвучку' : 'Воспроизвести озвучку'"
      >
        <svg v-if="isPlaying" class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
        </svg>
        <svg v-else class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path>
        </svg>
      </button>
      <audio
        ref="audioPlayer"
        :src="currentStepData.audioUrl"
        @ended="isPlaying = false"
        @play="isPlaying = true"
        @pause="isPlaying = false"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  device: {
    type: Object,
    required: true
  },
  error: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['back', 'restart'])

// Load diagnostic steps from API
const steps = ref([])

onMounted(async () => {
  try {
    const stepsData = await $fetch(`/api/steps/${props.device.id}/${props.error.id}`)
    steps.value = stepsData.map(step => ({
      ...step,
      highlightedButton: step.highlighted_button,
      screenImage: step.screen_image,
      audioUrl: step.audio_url
    }))
  } catch (error) {
    console.error('Failed to load steps:', error)
    // Fallback to mock data if API fails
    steps.value = [
      {
        id: 1,
        title: 'Проверка подключения',
        instruction: 'Убедитесь, что все кабели подключены правильно. Нажмите кнопку POWER на пульте.',
        tip: 'Проверьте, что антенный кабель плотно подключен к приставке.',
        highlightedButton: 'power',
        screenImage: null,
        audioUrl: null
      }
    ]
  }
})

const currentStep = ref(0)
const isPlaying = ref(false)
const audioPlayer = ref(null)

const currentStepData = computed(() => steps.value[currentStep.value])

const nextStep = () => {
  if (currentStep.value < steps.value.length - 1) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const handleButtonPress = (buttonId) => {
  // Add button press animation and logic
  console.log('Button pressed:', buttonId)
  
  // Auto advance if the correct button was pressed
  if (currentStepData.value.highlightedButton === buttonId) {
    setTimeout(() => {
      nextStep()
    }, 1000)
  }
}

const toggleAudio = () => {
  if (audioPlayer.value) {
    if (isPlaying.value) {
      audioPlayer.value.pause()
    } else {
      audioPlayer.value.play()
    }
  }
}

const completeDiagnostic = () => {
  // Show completion message and options
  alert('Диагностика завершена! Если проблема не решена, обратитесь к специалисту.')
  emit('restart')
}

// Meta tags
useHead({
  title: `Диагностика ${props.device.name} - ${props.error.title}`,
})
</script>

<style scoped>
.remote-container {
  @apply max-w-xs mx-auto lg:max-w-none;
}

.tv-screen-container {
  @apply w-full max-w-2xl mx-auto;
}

@media (max-width: 1024px) {
  .diagnostic-main {
    @apply space-y-6;
    grid-template-columns: 1fr;
  }
  
  .tv-screen-container {
    @apply order-1;
  }
  
  .remote-container {
    @apply order-2;
  }
}
</style>
