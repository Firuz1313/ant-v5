<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 dark:from-dark-300 dark:via-dark-200 dark:to-dark-100 overflow-hidden">
    <!-- Animated background elements -->
    <div class="fixed inset-0 pointer-events-none z-0">
      <!-- Signal waves animation -->
      <div v-for="n in 5" :key="'wave-' + n" 
           :class="`signal-wave signal-wave-${n}`" 
           :style="{ animationDelay: `${n * 0.5}s` }" />
      
      <!-- Floating antenna icons -->
      <div v-for="n in 3" :key="'antenna-' + n" 
           :class="`floating-antenna floating-antenna-${n}`"
           :style="{ animationDelay: `${n * 2}s` }">
        📡
      </div>
      
      <!-- Moving particles -->
      <div v-for="n in 8" :key="'particle-' + n" 
           :class="`particle particle-${n}`"
           :style="{ animationDelay: `${n * 0.8}s` }" />
    </div>

    <!-- Intro loading animation -->
    <Transition name="intro" @after-leave="showIntro = false">
      <div v-if="showIntro" class="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-800">
        <div class="text-center">
          <!-- ANT Logo Animation -->
          <div class="ant-logo-container mb-8">
            <div class="ant-logo">
              <div class="ant-signal">
                <div v-for="n in 4" :key="n" class="signal-line" :style="{ animationDelay: `${n * 0.2}s` }" />
              </div>
              <div class="ant-text">ANT</div>
            </div>
          </div>
          
          <!-- Loading text -->
          <div class="loading-text">
            <h2 class="text-2xl font-poppins font-bold text-white mb-4">
              Система диагностики ТВ-приставок
            </h2>
            <div class="loading-dots">
              <span v-for="n in 3" :key="n" class="dot" :style="{ animationDelay: `${n * 0.3}s` }">•</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Main content -->
    <div class="relative z-10">
      <div class="container mx-auto px-4 py-12">
        <!-- Hero section with slogan -->
        <div class="text-center mb-12">
          <div class="mb-6">
            <!-- ANT Logo (small version) -->
            <div class="ant-logo-small mx-auto mb-4">
              <div class="ant-signal-small">
                <div v-for="n in 3" :key="n" class="signal-line-small" />
              </div>
              <div class="ant-text-small">ANT</div>
            </div>
          </div>
          
          <h1 class="text-4xl lg:text-6xl font-poppins font-bold text-gray-900 dark:text-white mb-4 animate-slide-up">
            Диагностика ТВ-приставок
          </h1>
          
          <!-- Main slogan -->
          <div class="slogan-container mb-6">
            <p class="text-2xl lg:text-3xl font-poppins font-semibold text-primary-600 dark:text-primary-400 animate-slide-up" style="animation-delay: 0.2s">
              Поможем за 3 шага
            </p>
            <div class="slogan-underline"></div>
          </div>
          
          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed font-inter animate-slide-up" style="animation-delay: 0.4s">
            Простое и интуитивное решение для диагностики ошибок ТВ-приставок с пошаговыми инструкциями
          </p>
        </div>

        <div class="max-w-6xl mx-auto">
          <!-- Device Selection -->
          <div v-if="!selectedDevice" class="card p-8 animate-fade-in">
            <h2 class="text-2xl font-poppins font-semibold text-gray-900 dark:text-white mb-8 text-center leading-tight">
              Выберите вашу ТВ-приставку
            </h2>
            
            <!-- Enhanced device grid with better visuals -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div
                v-for="(device, index) in devices"
                :key="device.id"
                @click="selectDevice(device)"
                @keydown.enter="selectDevice(device)"
                @keydown.space.prevent="selectDevice(device)"
                tabindex="0"
                class="device-card cursor-pointer p-6 text-center card hover:shadow-2xl transform hover:scale-105 transition-all duration-300 animate-device-appear focus:ring-4 focus:ring-primary-500 focus:ring-opacity-50"
                :style="{ animationDelay: `${index * 0.1}s` }"
                :class="{ 'tv-focus-enhanced': isSmartTV }"
              >
                <!-- Device icon with enhanced styling -->
                <div class="device-icon-container mb-4">
                  <div class="device-icon">
                    <img
                      v-if="device.display_icon && device.display_icon.startsWith('/')"
                      :src="device.display_icon"
                      :alt="device.name"
                      class="w-16 h-16 object-contain"
                    >
                    <span v-else-if="device.display_icon" class="text-4xl">{{ device.display_icon }}</span>
                    <svg v-else class="w-12 h-12 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                    </svg>
                  </div>
                  <div class="device-signal-indicator"></div>
                </div>
                
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {{ device.name }}
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ device.description }}
                </p>
                
                <!-- Device selection indicator -->
                <div class="mt-4 text-primary-600 opacity-0 transform translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                  <svg class="w-6 h-6 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            <!-- Add custom problem option -->
            <div class="mt-8 text-center">
              <button
              @click="showCustomProblem = true"
              class="btn-secondary inline-flex items-center space-x-2 animate-pulse-subtle"
              :class="{ 'tv-button-enhanced': isSmartTV }"
            >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"></path>
                </svg>
                <span>Добавить свою проблему</span>
              </button>
            </div>
          </div>

          <!-- Error Selection with enhanced filtering and prioritization -->
          <div v-else-if="!selectedError" class="space-y-6 animate-fade-in">
            <!-- Header with device info -->
            <div class="card p-6">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center space-x-4">
                  <div class="device-icon-small">
                    <img
                      v-if="selectedDevice.display_icon && selectedDevice.display_icon.startsWith('/')"
                      :src="selectedDevice.display_icon"
                      :alt="selectedDevice.name"
                      class="w-12 h-12 object-contain"
                    >
                    <span v-else-if="selectedDevice.display_icon" class="text-2xl">{{ selectedDevice.display_icon }}</span>
                  </div>
                  <div>
                    <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
                      {{ selectedDevice.name }}
                    </h2>
                    <p class="text-gray-600 dark:text-gray-400">Выберите проблему для диагностики</p>
                  </div>
                </div>
                <button
                  @click="resetSelection"
                  class="btn-secondary"
                  data-action="back"
                  :class="{ 'tv-button-enhanced': isSmartTV }"
                >
                  ← Назад
                </button>
              </div>
              
              <!-- Error filter and search -->
              <div class="flex flex-col lg:flex-row gap-4">
                <div class="flex-1">
                  <input
                    v-model="errorSearch"
                    type="text"
                    placeholder="Поиск по проблемам..."
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                </div>
                <div class="flex space-x-2">
                  <button
                    v-for="priority in ['all', 'high', 'medium', 'low']"
                    :key="priority"
                    @click="selectedPriority = priority"
                    :class="[
                      'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:ring-2 focus:ring-primary-500',
                      selectedPriority === priority
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600',
                      { 'tv-button-enhanced': isSmartTV }
                    ]"
                  >
                    {{ priority === 'all' ? 'Все' : priority === 'high' ? 'Критичные' : priority === 'medium' ? 'Важные' : 'Обычные' }}
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Filtered errors grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="(error, index) in filteredErrors"
                :key="error.id"
                @click="selectError(error)"
                @keydown.enter="selectError(error)"
                @keydown.space.prevent="selectError(error)"
                tabindex="0"
                class="error-card cursor-pointer p-6 card hover:shadow-xl transform hover:scale-102 transition-all duration-300 animate-error-appear focus:ring-4 focus:ring-primary-500 focus:ring-opacity-50"
                :style="{ animationDelay: `${index * 0.05}s` }"
                :class="{ 'tv-focus-enhanced': isSmartTV }"
              >
                <div class="flex items-start space-x-4">
                  <!-- Priority indicator -->
                  <div class="flex-shrink-0">
                    <div class="w-12 h-12 rounded-full flex items-center justify-center"
                         :class="{
                           'bg-red-100 dark:bg-red-900': error.severity === 'high',
                           'bg-yellow-100 dark:bg-yellow-900': error.severity === 'medium',
                           'bg-gray-100 dark:bg-gray-700': !error.severity || error.severity === 'low'
                         }">
                      <span v-if="error.icon" class="text-xl">{{ error.icon }}</span>
                      <svg v-else class="w-6 h-6" 
                           :class="{
                             'text-red-600': error.severity === 'high',
                             'text-yellow-600': error.severity === 'medium',
                             'text-gray-600': !error.severity || error.severity === 'low'
                           }" 
                           fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                      </svg>
                    </div>
                  </div>
                  
                  <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-2">
                      <h3 class="font-semibold text-gray-900 dark:text-white">{{ error.title }}</h3>
                      <span v-if="error.severity === 'high'" class="px-2 py-1 text-xs bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100 rounded-full animate-pulse-red">
                        Критичный
                      </span>
                      <span v-else-if="error.severity === 'medium'" class="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100 rounded-full">
                        Важный
                      </span>
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">{{ error.description }}</p>
                    
                    <!-- Estimated time and steps -->
                    <div class="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <span class="flex items-center space-x-1">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
                        </svg>
                        <span>~{{ error.estimatedTime || '5-10' }} мин</span>
                      </span>
                      <span class="flex items-center space-x-1">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clip-rule="evenodd"></path>
                        </svg>
                        <span>{{ error.stepCount || '3-7' }} шагов</span>
                      </span>
                    </div>
                  </div>
                  
                  <!-- Selection arrow -->
                  <div class="flex-shrink-0 text-primary-600 opacity-0 transform translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- No results message -->
            <div v-if="filteredErrors.length === 0" class="text-center py-12">
              <div class="text-6xl mb-4">🔍</div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Ничего не найдено</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-6">Попробуйте изменить фильтр или поисковый запрос</p>
              <button @click="errorSearch = ''; selectedPriority = 'all'" class="btn-primary">
                Сбросить фильтры
              </button>
            </div>
          </div>

          <!-- Enhanced Diagnostic Interface for Openbox GOLD -->
          <EnhancedDiagnosticScreen 
            v-else-if="selectedDevice && selectedDevice.id === 4"
            :device="selectedDevice" 
            :error="selectedError"
            @back="selectedError = null"
            @restart="resetSelection"
            class="animate-fade-in"
          />
          
          <!-- Standard Diagnostic Interface for other devices -->
          <DiagnosticScreen 
            v-else
            :device="selectedDevice" 
            :error="selectedError"
            @back="selectedError = null"
            @restart="resetSelection"
            class="animate-fade-in"
          />
        </div>
      </div>
    </div>

    <!-- Custom Problem Modal -->
    <Transition name="modal">
      <div v-if="showCustomProblem" class="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div class="bg-white dark:bg-dark-100 rounded-xl shadow-2xl max-w-md w-full p-6">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Опишите вашу проблему</h3>
          <textarea
            v-model="customProblemText"
            placeholder="Подробно опишите что происходит с вашей приставкой..."
            class="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          ></textarea>
          <div class="mt-6 flex space-x-3">
            <button @click="submitCustomProblem" class="btn-primary flex-1">
              Отправить
            </button>
            <button @click="showCustomProblem = false" class="btn-secondary">
              Отмена
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
// Import settings store for admin-site synchronization
const settingsStore = useSettingsStore()

// Smart TV navigation support
const { isSmartTV, updateFocusableElements } = useSmartTVNavigation()

// Reactive state
const showIntro = ref(true)
const showCustomProblem = ref(false)
const customProblemText = ref('')
const errorSearch = ref('')
const selectedPriority = ref('all')

// Load devices from API using useLazyFetch for SSR compatibility
const { data: devices, refresh: refreshDevices } = await useLazyFetch('/api/devices', {
  key: 'devices',
  default: () => []
})

// Auto-hide intro after animation
onMounted(async () => {
  await settingsStore.loadSettings()
  await refreshDevices()
  
  setTimeout(() => {
    showIntro.value = false
  }, 3000)
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

// Filtered errors based on search and priority
const filteredErrors = computed(() => {
  let filtered = errors.value

  // Filter by search
  if (errorSearch.value) {
    const search = errorSearch.value.toLowerCase()
    filtered = filtered.filter(error => 
      error.title.toLowerCase().includes(search) ||
      error.description.toLowerCase().includes(search)
    )
  }

  // Filter by priority
  if (selectedPriority.value !== 'all') {
    filtered = filtered.filter(error => error.severity === selectedPriority.value)
  }

  // Sort by priority (high -> medium -> low)
  return filtered.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    return (priorityOrder[b.severity] || 0) - (priorityOrder[a.severity] || 0)
  })
})

const selectDevice = (device) => {
  selectedDevice.value = device
  // Update focusable elements after device selection
  nextTick(() => updateFocusableElements())
}

const selectError = (error) => {
  selectedError.value = error
  // Update focusable elements after error selection
  nextTick(() => updateFocusableElements())
}

const resetSelection = () => {
  selectedDevice.value = null
  selectedError.value = null
  errorSearch.value = ''
  selectedPriority.value = 'all'
  // Update focusable elements after reset
  nextTick(() => updateFocusableElements())
}

const submitCustomProblem = async () => {
  if (customProblemText.value.trim()) {
    try {
      // Here you would send the custom problem to your backend
      console.log('Custom problem submitted:', customProblemText.value)
      showCustomProblem.value = false
      customProblemText.value = ''
      // Show success message
      alert('Спасибо! Ваша проблема отправлена нашим специалистам.')
    } catch (error) {
      console.error('Failed to submit custom problem:', error)
    }
  }
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

// Enhanced Meta tags with OpenGraph
useHead({
  title: 'ANT - Диагностика ТВ-приставок | Поможем за 3 шага',
  meta: [
    { name: 'description', content: 'Интерактивная система диагностики ТВ-приставок ANT с пошаговыми инструкциями. Решите проблемы за 3 простых шага.' },
    { name: 'keywords', content: 'диагностика, ТВ-приставка, ANT, техподдержка, ремонт, инструкции' },
    { property: 'og:title', content: 'ANT - Диагностика ТВ-приставок' },
    { property: 'og:description', content: 'Поможем решить проблемы с ТВ-приставкой за 3 простых шага' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'robots', content: 'index, follow' }
  ]
})
</script>

<style scoped>
/* Background animations */
.signal-wave {
  @apply absolute rounded-full border-2 border-primary-300 opacity-20;
  animation: signal-pulse 3s ease-in-out infinite;
}

.signal-wave-1 { @apply top-1/4 left-1/4 w-32 h-32; }
.signal-wave-2 { @apply top-1/3 right-1/4 w-24 h-24; }
.signal-wave-3 { @apply bottom-1/3 left-1/3 w-40 h-40; }
.signal-wave-4 { @apply top-3/4 right-1/3 w-28 h-28; }
.signal-wave-5 { @apply bottom-1/4 right-1/2 w-36 h-36; }

.floating-antenna {
  @apply absolute text-4xl opacity-30;
  animation: float 6s ease-in-out infinite;
}

.floating-antenna-1 { @apply top-20 left-10; }
.floating-antenna-2 { @apply top-40 right-20; }
.floating-antenna-3 { @apply bottom-20 left-1/2; }

.particle {
  @apply absolute w-2 h-2 bg-primary-400 rounded-full opacity-40;
  animation: particle-float 8s linear infinite;
}

.particle-1 { @apply top-16 left-20; }
.particle-2 { @apply top-32 right-32; }
.particle-3 { @apply top-48 left-1/2; }
.particle-4 { @apply bottom-40 right-16; }
.particle-5 { @apply bottom-24 left-32; }
.particle-6 { @apply top-3/4 right-1/4; }
.particle-7 { @apply top-1/2 left-16; }
.particle-8 { @apply bottom-16 right-1/2; }

/* ANT Logo animations */
.ant-logo-container {
  perspective: 1000px;
}

.ant-logo {
  @apply relative;
  animation: logo-entrance 2s ease-out;
}

.ant-signal {
  @apply absolute -top-8 left-1/2 transform -translate-x-1/2;
}

.signal-line {
  @apply absolute bg-white w-1;
  animation: signal-grow 2s ease-out infinite;
}

.signal-line:nth-child(1) { @apply h-8 left-0; }
.signal-line:nth-child(2) { @apply h-12 left-3; }
.signal-line:nth-child(3) { @apply h-16 left-6; }
.signal-line:nth-child(4) { @apply h-12 left-9; }

.ant-text {
  @apply text-6xl font-poppins font-bold text-white;
  text-shadow: 0 4px 8px rgba(0,0,0,0.3);
}

/* Small logo for main page */
.ant-logo-small {
  @apply w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center relative shadow-lg;
}

.ant-signal-small {
  @apply absolute -top-2 left-1/2 transform -translate-x-1/2;
}

.signal-line-small {
  @apply absolute bg-white w-0.5;
  animation: signal-pulse-small 2s ease-in-out infinite;
}

.signal-line-small:nth-child(1) { @apply h-2 left-0; }
.signal-line-small:nth-child(2) { @apply h-3 left-1; }
.signal-line-small:nth-child(3) { @apply h-2 left-2; }

.ant-text-small {
  @apply text-sm font-poppins font-bold text-white;
}

/* Slogan styling */
.slogan-container {
  @apply relative;
}

.slogan-underline {
  @apply absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full;
  width: 0;
  animation: underline-grow 1s ease-out 0.6s forwards;
}

/* Device card enhancements */
.device-card {
  @apply group relative overflow-hidden;
}

.device-card::before {
  @apply absolute inset-0 bg-gradient-to-br from-primary-50 to-transparent opacity-0 transition-opacity duration-300;
  content: '';
}

.device-card:hover::before {
  @apply opacity-100;
}

.device-icon-container {
  @apply relative;
}

.device-icon {
  @apply w-20 h-20 mx-auto bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-primary-200 dark:group-hover:bg-primary-800;
}

.device-signal-indicator {
  @apply absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full;
  animation: signal-blink 2s ease-in-out infinite;
}

.device-icon-small {
  @apply w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center;
}

/* Loading animations */
.loading-dots {
  @apply flex items-center justify-center space-x-1;
}

.dot {
  @apply text-white text-2xl;
  animation: dot-bounce 1.5s ease-in-out infinite;
}

/* Transitions */
.intro-enter-active,
.intro-leave-active {
  transition: all 0.8s ease;
}

.intro-enter-from {
  opacity: 1;
}

.intro-leave-to {
  opacity: 0;
  transform: scale(1.1);
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* Keyframe animations */
@keyframes signal-pulse {
  0%, 100% { transform: scale(1); opacity: 0.2; }
  50% { transform: scale(1.2); opacity: 0.4; }
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-20px) rotate(5deg); }
  66% { transform: translateY(-10px) rotate(-5deg); }
}

@keyframes particle-float {
  0% { transform: translateY(100vh) translateX(0); opacity: 0; }
  10% { opacity: 0.4; }
  90% { opacity: 0.4; }
  100% { transform: translateY(-100px) translateX(50px); opacity: 0; }
}

@keyframes logo-entrance {
  0% { 
    opacity: 0; 
    transform: rotateY(-90deg) scale(0.5);
  }
  50% {
    opacity: 0.8;
    transform: rotateY(0deg) scale(1.1);
  }
  100% { 
    opacity: 1; 
    transform: rotateY(0deg) scale(1);
  }
}

@keyframes signal-grow {
  0%, 100% { height: 0.5rem; opacity: 0.5; }
  50% { height: 100%; opacity: 1; }
}

@keyframes signal-pulse-small {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

@keyframes underline-grow {
  0% { width: 0; }
  100% { width: 200px; }
}

@keyframes signal-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

@keyframes dot-bounce {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-10px); }
}

@keyframes animate-slide-up {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes animate-fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes animate-device-appear {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes animate-error-appear {
  0% {
    opacity: 0;
    transform: translateX(-20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes animate-pulse-red {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@keyframes animate-pulse-subtle {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

/* Utility animation classes */
.animate-slide-up {
  animation: animate-slide-up 0.6s ease-out forwards;
  opacity: 0;
}

.animate-fade-in {
  animation: animate-fade-in 0.8s ease-out;
}

.animate-device-appear {
  animation: animate-device-appear 0.5s ease-out forwards;
  opacity: 0;
}

.animate-error-appear {
  animation: animate-error-appear 0.4s ease-out forwards;
  opacity: 0;
}

.animate-pulse-red {
  animation: animate-pulse-red 2s ease-in-out infinite;
}

.animate-pulse-subtle {
  animation: animate-pulse-subtle 3s ease-in-out infinite;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .ant-text {
    @apply text-4xl;
  }
  
  .signal-wave {
    @apply w-20 h-20;
  }
  
  .floating-antenna {
    @apply text-2xl;
  }
}

@media (min-width: 1920px) {
  .tv-screen {
    border-width: 12px;
  }
  
  .ant-logo-small {
    @apply w-20 h-20;
  }
  
  .ant-text-small {
    @apply text-base;
  }
}
</style>
