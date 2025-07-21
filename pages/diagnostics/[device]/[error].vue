<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-dark-300 dark:to-dark-200">
    <div class="container mx-auto px-4 py-8">
      <!-- Header with breadcrumbs -->
      <div class="mb-8">
        <nav class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <NuxtLink to="/" class="hover:text-blue-600">Главная</NuxtLink>
          <span>→</span>
          <span class="text-gray-900 dark:text-white font-medium">{{ deviceInfo?.name }}</span>
          <span>→</span>
          <span class="text-gray-900 dark:text-white font-medium">{{ errorInfo?.title }}</span>
        </nav>
        
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Диагностика: {{ errorInfo?.title }}
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
              Устройство: {{ deviceInfo?.name }} • {{ errorInfo?.description }}
            </p>
          </div>
          
          <div class="flex space-x-3">
            <button 
              @click="toggleOperatorMode"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors',
                operatorMode 
                  ? 'bg-orange-600 text-white hover:bg-orange-700' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              ]"
            >
              {{ operatorMode ? '👤 Режим оператора' : '👥 Режим пользователя' }}
            </button>
            
            <button @click="goBack" class="btn-secondary">
              ← Назад
            </button>
          </div>
        </div>
      </div>

      <!-- Enhanced Diagnostic Interface -->
      <div v-if="deviceInfo && errorInfo">
        <!-- Use enhanced diagnostic for Openbox GOLD -->
        <EnhancedDiagnosticScreen 
          v-if="deviceInfo.id === 4"
          :device="deviceInfo" 
          :error="errorInfo"
          :operator-mode="operatorMode"
          @back="goBack"
          @restart="goHome"
          @step-completed="handleStepCompleted"
          @user-stuck="handleUserStuck"
        />
        
        <!-- Use standard diagnostic for other devices -->
        <DiagnosticScreen 
          v-else
          :device="deviceInfo" 
          :error="errorInfo"
          :operator-mode="operatorMode"
          @back="goBack"
          @restart="goHome"
          @step-completed="handleStepCompleted"
          @user-stuck="handleUserStuck"
        />
      </div>

      <!-- Loading state -->
      <div v-else class="flex items-center justify-center h-64">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-600 dark:text-gray-400">Загрузка диагностики...</p>
        </div>
      </div>

      <!-- Error state -->
      <div v-if="error" class="card p-8 text-center">
        <div class="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Ошибка загрузки</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Не удалось загрузить данные для диагностики
        </p>
        <div class="space-x-4">
          <button @click="refresh" class="btn-primary">
            Попробовать снова
          </button>
          <button @click="goHome" class="btn-secondary">
            На главную
          </button>
        </div>
      </div>

      <!-- Debug Info (только в development) -->
      <div v-if="isDevelopment" class="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Debug Info:</h3>
        <div class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <div>Device ID: {{ route.params.device }}</div>
          <div>Error ID: {{ route.params.error }}</div>
          <div>Operator Mode: {{ operatorMode }}</div>
          <div>Device Info: {{ deviceInfo ? 'Loaded' : 'Loading...' }}</div>
          <div>Error Info: {{ errorInfo ? 'Loaded' : 'Loading...' }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()

// Get route parameters
const deviceId = computed(() => route.params.device)
const errorId = computed(() => route.params.error)

// State
const operatorMode = ref(false)
const error = ref(null)
const isDevelopment = process.dev

// Load device and error data
const { data: deviceInfo, pending: devicePending } = await useLazyFetch(`/api/devices`, {
  transform: (data) => data.find(device => device.id == deviceId.value)
})

const { data: errorInfo, pending: errorPending } = await useLazyFetch(`/api/errors/${deviceId.value}`, {
  transform: (data) => data.find(error => error.id == errorId.value)
})

// Validation
onMounted(() => {
  if (!deviceInfo.value) {
    error.value = `Устройство с ID ${deviceId.value} не найдено`
  } else if (!errorInfo.value) {
    error.value = `Ошибка с ID ${errorId.value} не найдена для устройства ${deviceInfo.value.name}`
  }
})

// Methods
const toggleOperatorMode = () => {
  operatorMode.value = !operatorMode.value
}

const goBack = () => {
  router.back()
}

const goHome = () => {
  navigateTo('/')
}

const refresh = () => {
  window.location.reload()
}

const handleStepCompleted = (stepData) => {
  // Log step completion
  console.log('Step completed:', stepData)
  
  // Could send analytics here
  $fetch('/api/analytics', {
    method: 'POST',
    body: {
      type: 'step_completed',
      deviceId: deviceId.value,
      errorId: errorId.value,
      stepId: stepData.id,
      timestamp: new Date().toISOString()
    }
  }).catch(console.error)
}

const handleUserStuck = (stepData) => {
  // Log user stuck event
  console.log('User stuck on step:', stepData)
  
  // Could trigger telegram notification here
  $fetch('/api/analytics', {
    method: 'POST',
    body: {
      type: 'user_stuck',
      deviceId: deviceId.value,
      errorId: errorId.value,
      stepId: stepData.id,
      timestamp: new Date().toISOString()
    }
  }).catch(console.error)
}

// Meta tags
useHead({
  title: computed(() => {
    if (deviceInfo.value && errorInfo.value) {
      return `${errorInfo.value.title} - ${deviceInfo.value.name}`
    }
    return 'Диагностика'
  }),
  meta: [
    { 
      name: 'description', 
      content: computed(() => {
        if (errorInfo.value) {
          return `Пошаговая диагностика: ${errorInfo.value.description}`
        }
        return 'Система диагностики ТВ-приставок'
      })
    }
  ]
})

// Route validation middleware
definePageMeta({
  validate: async (route) => {
    // Validate that device and error parameters are numeric
    return /^\d+$/.test(route.params.device) && /^\d+$/.test(route.params.error)
  }
})
</script>
