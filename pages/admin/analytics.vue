<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">📊 Аналитика и отчеты</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          Детальная аналитика использования системы диагностики
        </p>
      </div>
      <div class="mt-4 lg:mt-0 flex space-x-3">
        <select
          v-model="timeRange"
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="24h">Последние 24 часа</option>
          <option value="7d">Последние 7 дней</option>
          <option value="30d">Последние 30 дней</option>
        </select>
        <button
          @click="generateReport"
          class="btn-primary"
        >
          📄 Сгенерировать отчет
        </button>
      </div>
    </div>

    <!-- Overview Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Всего сессий</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ analytics.overview?.totalSessions || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Успешно завершено</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ analytics.overview?.completedSessions || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
            <svg class="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Прерваны</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ analytics.overview?.abandonedSessions || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <svg class="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
              <path fill-rule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3a2 2 0 012 2v6.5A1.5 1.5 0 009.5 13h-3A1.5 1.5 0 015 11.5V5zM7 7a1 1 0 011-1h.01a1 1 0 110 2H8a1 1 0 01-1-1z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Процент успеха</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ analytics.overview?.successRate || 0 }}%</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Device Usage Chart -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          📱 Использо��ание по устройствам
        </h3>
        <div class="space-y-4">
          <div 
            v-for="device in analytics.deviceUsage" 
            :key="device.device"
            class="flex items-center justify-between"
          >
            <div class="flex items-center space-x-3">
              <div class="w-4 h-4 bg-primary-600 rounded"></div>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ device.device }}</span>
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ device.sessions }} сессий</span>
              <div class="w-24 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div 
                  class="bg-primary-600 h-2 rounded-full" 
                  :style="`width: ${(device.sessions / maxDeviceSessions * 100)}%`"
                ></div>
              </div>
              <span class="text-sm font-medium text-green-600">{{ device.successRate }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Error Distribution -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          ⚠️ Распредел��ние ошибок
        </h3>
        <div class="space-y-3">
          <div 
            v-for="error in analytics.errorDistribution?.slice(0, 5)" 
            :key="error.error"
            class="flex items-center justify-between"
          >
            <div class="flex items-center space-x-3">
              <div 
                class="w-3 h-3 rounded-full"
                :class="{
                  'bg-red-500': error.severity === 'high',
                  'bg-yellow-500': error.severity === 'medium',
                  'bg-green-500': error.severity === 'low'
                }"
              ></div>
              <span class="text-sm text-gray-900 dark:text-white">{{ error.error }}</span>
            </div>
            <span class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ error.count }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Step Performance Analysis -->
    <div class="card p-6 mb-8">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          📋 Анализ производительности шагов
        </h3>
        <button
          @click="showStepDetails = !showStepDetails"
          class="text-sm text-primary-600 hover:text-primary-700"
        >
          {{ showStepDetails ? 'Скрыть детали' : 'Показать детали' }}
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Шаг
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Просмотры
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Завершения
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Среднее время
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Застряли
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Успех %
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-dark-100 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="step in analytics.stepAnalytics" :key="step.stepId">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {{ step.stepTitle }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                {{ step.views }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                {{ step.completions }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                {{ step.avgTimeSpent }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-2 py-1 text-xs rounded-full"
                  :class="{
                    'bg-red-100 text-red-800': step.stuckUsers > 10,
                    'bg-yellow-100 text-yellow-800': step.stuckUsers > 5 && step.stuckUsers <= 10,
                    'bg-green-100 text-green-800': step.stuckUsers <= 5
                  }"
                >
                  {{ step.stuckUsers }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-16 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      class="h-2 rounded-full"
                      :class="{
                        'bg-green-500': step.successRate >= 80,
                        'bg-yellow-500': step.successRate >= 60 && step.successRate < 80,
                        'bg-red-500': step.successRate < 60
                      }"
                      :style="`width: ${step.successRate}%`"
                    ></div>
                  </div>
                  <span class="text-sm font-medium text-gray-900 dark:text-white">{{ step.successRate }}%</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- User Behavior Insights -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Behavior Metrics -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          👥 Поведение пользователей
        </h3>
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600 dark:text-gray-400">Средние шаги за сессию:</span>
            <span class="font-semibold text-gray-900 dark:text-white">{{ analytics.userBehavior?.averageStepsPerSession || 0 }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600 dark:text-gray-400">Самый сложный шаг:</span>
            <span class="font-semibold text-gray-900 dark:text-white">{{ analytics.userBehavior?.mostDifficultStep || 'Н/Д' }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600 dark:text-gray-400">Самое быстрое завершение:</span>
            <span class="font-semibold text-gray-900 dark:text-white">{{ analytics.userBehavior?.fastestCompletion || 'Н/Д' }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600 dark:text-gray-400">Вмеша��ельства оператора:</span>
            <span class="font-semibold text-gray-900 dark:text-white">{{ analytics.userBehavior?.operatorInterventions || 0 }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600 dark:text-gray-400">Использование альтернатив:</span>
            <span class="font-semibold text-gray-900 dark:text-white">{{ analytics.userBehavior?.alternativePathUsage || 0 }}</span>
          </div>
        </div>
      </div>

      <!-- Geographic Distribution -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          🌍 География пользователей
        </h3>
        <div class="space-y-3">
          <div 
            v-for="region in analytics.geographicData" 
            :key="region.region"
            class="flex items-center justify-between"
          >
            <span class="text-sm text-gray-900 dark:text-white">{{ region.region }}</span>
            <div class="flex items-center space-x-3">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ region.sessions }}</span>
              <span class="text-sm font-medium text-green-600">{{ region.successRate }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Real-time Activity -->
    <div class="card p-6 mb-8">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          🔴 Активность в реальном времени
        </h3>
        <div class="flex items-center space-x-2">
          <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span class="text-sm text-gray-600 dark:text-gray-400">Обновлено {{ lastUpdated }}</span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Active Sessions -->
        <div class="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-blue-800 dark:text-blue-200">Активные сессии</p>
              <p class="text-2xl font-bold text-blue-900 dark:text-blue-100">{{ realTimeStats.activeSessions }}</p>
            </div>
            <div class="p-3 bg-blue-100 dark:bg-blue-800 rounded-full">
              <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Stuck Users -->
        <div class="bg-yellow-50 dark:bg-yellow-900 rounded-lg p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-yellow-800 dark:text-yellow-200">Застряли</p>
              <p class="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{{ realTimeStats.stuckUsers }}</p>
            </div>
            <div class="p-3 bg-yellow-100 dark:bg-yellow-800 rounded-full">
              <svg class="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Master Requests -->
        <div class="bg-red-50 dark:bg-red-900 rounded-lg p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-red-800 dark:text-red-200">Заявки на мастера</p>
              <p class="text-2xl font-bold text-red-900 dark:text-red-100">{{ realTimeStats.masterRequests }}</p>
            </div>
            <div class="p-3 bg-red-100 dark:bg-red-800 rounded-full">
              <svg class="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Report Generation Modal -->
    <div v-if="showReportModal" class="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white dark:bg-dark-100 rounded-xl shadow-2xl max-w-lg w-full">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Генерация отчета
          </h3>
        </div>
        
        <div class="px-6 py-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Тип отчета
            </label>
            <select
              v-model="reportType"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="user_actions">Действия пользователей</option>
              <option value="step_performance">Производительность шагов</option>
              <option value="device_analytics">Аналитика устройств</option>
              <option value="error_analysis">Анализ ошибок</option>
              <option value="operator_metrics">Метрики операторов</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Формат
            </label>
            <select
              v-model="reportFormat"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
              <option value="excel">Excel</option>
            </select>
          </div>
        </div>

        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
          <button
            @click="showReportModal = false"
            class="btn-secondary"
          >
            Отмена
          </button>
          <button
            @click="downloadReport"
            :disabled="isGeneratingReport"
            class="btn-primary"
          >
            {{ isGeneratingReport ? 'Генерация...' : 'Скачать' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Load analytics data
const timeRange = ref('24h')
const analytics = ref({})
const showStepDetails = ref(false)
const showReportModal = ref(false)
const reportType = ref('user_actions')
const reportFormat = ref('json')
const isGeneratingReport = ref(false)

// Real-time stats (mock data)
const realTimeStats = ref({
  activeSessions: 12,
  stuckUsers: 3,
  masterRequests: 5
})

const lastUpdated = ref('')

// Set lastUpdated only on client side to avoid hydration mismatch
onMounted(() => {
  lastUpdated.value = new Date().toLocaleTimeString('ru-RU')
})

// Computed properties
const maxDeviceSessions = computed(() => {
  if (!analytics.value.deviceUsage) return 1
  return Math.max(...analytics.value.deviceUsage.map(d => d.sessions))
})

// Methods
const loadAnalytics = async () => {
  try {
    const data = await $fetch(`/api/admin/analytics?range=${timeRange.value}`)
    analytics.value = data
  } catch (error) {
    console.error('Failed to load analytics:', error)
  }
}

const generateReport = () => {
  showReportModal.value = true
}

const downloadReport = async () => {
  isGeneratingReport.value = true
  
  try {
    const reportData = await $fetch('/api/admin/reports', {
      method: 'POST',
      body: {
        type: reportType.value,
        format: reportFormat.value,
        timeRange: timeRange.value,
        filters: {}
      }
    })
    
    // Create download
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { 
      type: 'application/json' 
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${reportType.value}_report_${timeRange.value}.${reportFormat.value}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    showReportModal.value = false
  } catch (error) {
    console.error('Failed to generate report:', error)
    alert('Ошибка при генерации отчета')
  } finally {
    isGeneratingReport.value = false
  }
}

// Watch time range changes
watch(timeRange, loadAnalytics)

// Auto-refresh real-time stats
const refreshRealTimeStats = () => {
  realTimeStats.value = {
    activeSessions: Math.floor(Math.random() * 20) + 5,
    stuckUsers: Math.floor(Math.random() * 10),
    masterRequests: Math.floor(Math.random() * 15) + 2
  }
  lastUpdated.value = new Date().toLocaleTimeString('ru-RU')
}

// Initialize
onMounted(async () => {
  await loadAnalytics()
  
  // Refresh every 30 seconds
  setInterval(refreshRealTimeStats, 30000)
})

// Meta tags
useHead({
  title: 'Аналитика - Админ-панель',
})

// Layout
definePageMeta({
  layout: 'admin'
})
</script>
