<template>
  <div class="p-6">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Отчеты</h1>
      <p class="text-gray-600 dark:text-gray-400">Генерация и просмотр отчетов по диагностике</p>
    </div>

    <!-- Report Filters -->
    <div class="card p-6 mb-8">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Параметры отчета</h2>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Тип отчета
          </label>
          <select v-model="reportParams.type" class="input">
            <option value="user_actions">Действия пользователей</option>
            <option value="step_performance">Производительность шагов</option>
            <option value="device_analytics">Аналитика устройств</option>
            <option value="error_analysis">Анализ ошибок</option>
            <option value="operator_metrics">Метрики операторов</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Период с
          </label>
          <input v-model="reportParams.startDate" type="date" class="input">
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Период по
          </label>
          <input v-model="reportParams.endDate" type="date" class="input">
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Формат
          </label>
          <select v-model="reportParams.format" class="input">
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
            <option value="excel">Excel</option>
          </select>
        </div>
      </div>
      
      <div class="mt-6 flex space-x-4">
        <button 
          @click="generateReport" 
          :disabled="isGenerating"
          class="btn-primary"
        >
          {{ isGenerating ? 'Генерация...' : '📊 Сгенерировать отчет' }}
        </button>
        <button @click="resetFilters" class="btn-secondary">
          🔄 Сбросить фильтры
        </button>
      </div>
    </div>

    <!-- Quick Reports -->
    <div class="card p-6 mb-8">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Быстрые отчеты</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button 
          @click="generateQuickReport('daily')"
          class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-colors text-left"
        >
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zM4 8h12v8H4V8z"></path>
              </svg>
            </div>
            <div>
              <h3 class="font-medium text-gray-900 dark:text-white">Дневной отчет</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Статистика за сегодня</p>
            </div>
          </div>
        </button>

        <button 
          @click="generateQuickReport('weekly')"
          class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-colors text-left"
        >
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path>
              </svg>
            </div>
            <div>
              <h3 class="font-medium text-gray-900 dark:text-white">Недельный отчет</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Статистика за неделю</p>
            </div>
          </div>
        </button>

        <button 
          @click="generateQuickReport('monthly')"
          class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-colors text-left"
        >
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <div>
              <h3 class="font-medium text-gray-900 dark:text-white">Месячный отчет</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Статистика за месяц</p>
            </div>
          </div>
        </button>
      </div>
    </div>

    <!-- Recent Reports -->
    <div class="card p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Последние отчеты</h2>
        <button @click="refreshReports" class="btn-secondary text-sm">
          🔄 Обновить
        </button>
      </div>

      <div v-if="isLoading" class="space-y-4">
        <div v-for="i in 5" :key="i" class="animate-pulse flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div class="flex-1">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          </div>
          <div class="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>

      <div v-else-if="reports.length > 0" class="space-y-4">
        <div 
          v-for="report in reports" 
          :key="report.id"
          class="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
        >
          <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-primary-600 dark:text-primary-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd"></path>
            </svg>
          </div>
          
          <div class="flex-1">
            <h3 class="font-medium text-gray-900 dark:text-white">{{ report.name }}</h3>
            <div class="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span>{{ report.type }}</span>
              <span>{{ formatDate(report.createdAt) }}</span>
              <span>{{ report.size }}</span>
            </div>
          </div>
          
          <div class="flex space-x-2">
            <button 
              @click="downloadReport(report)"
              class="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded text-sm hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
            >
              Скачать
            </button>
            <button 
              @click="deleteReport(report.id)"
              class="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded text-sm hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
            >
              Удалить
            </button>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-8">
        <div class="text-gray-400 mb-4">
          <svg class="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd"></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Нет отчетов
        </h3>
        <p class="text-gray-600 dark:text-gray-400">
          Сгенерируйте первый отчет для просмотра данных
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

// State
const isLoading = ref(false)
const isGenerating = ref(false)
const reports = ref([])

// Report parameters
const reportParams = ref({
  type: 'user_actions',
  startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  endDate: new Date().toISOString().split('T')[0],
  format: 'json'
})

// Methods
const generateReport = async () => {
  isGenerating.value = true
  
  try {
    const response = await $fetch('/api/admin/reports', {
      method: 'POST',
      body: {
        type: reportParams.value.type,
        startDate: reportParams.value.startDate,
        endDate: reportParams.value.endDate,
        format: reportParams.value.format
      }
    })
    
    if (response.success) {
      // Simulate adding to reports list
      reports.value.unshift({
        id: Date.now(),
        name: `${getReportTypeName(reportParams.value.type)} (${reportParams.value.startDate} - ${reportParams.value.endDate})`,
        type: reportParams.value.format.toUpperCase(),
        createdAt: new Date().toISOString(),
        size: '1.2 MB',
        downloadUrl: response.downloadUrl
      })
      
      // Show success notification
      console.log('Отчет успешно сгенерирован')
    }
  } catch (error) {
    console.error('Ошибка генерации отчета:', error)
  } finally {
    isGenerating.value = false
  }
}

const generateQuickReport = async (period) => {
  const now = new Date()
  let startDate
  
  switch (period) {
    case 'daily':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      break
    case 'weekly':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case 'monthly':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      break
  }
  
  reportParams.value.startDate = startDate.toISOString().split('T')[0]
  reportParams.value.endDate = now.toISOString().split('T')[0]
  reportParams.value.type = 'user_actions'
  
  await generateReport()
}

const resetFilters = () => {
  reportParams.value = {
    type: 'user_actions',
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    format: 'json'
  }
}

const refreshReports = async () => {
  isLoading.value = true
  
  try {
    // Mock reports for demonstration
    reports.value = [
      {
        id: 1,
        name: 'Дневной отчет по пользователям',
        type: 'JSON',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        size: '856 KB'
      },
      {
        id: 2,
        name: 'Анализ производительности шагов',
        type: 'CSV',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        size: '1.2 MB'
      },
      {
        id: 3,
        name: 'Недельная аналитика устройств',
        type: 'Excel',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        size: '2.1 MB'
      }
    ]
  } catch (error) {
    console.error('Ошибка загрузки отчетов:', error)
  } finally {
    isLoading.value = false
  }
}

const downloadReport = (report) => {
  console.log('Скачивание отчета:', report.name)
  // Implementation for downloading report
}

const deleteReport = (reportId) => {
  if (confirm('Вы уверены, что хотите удалить этот отчет?')) {
    reports.value = reports.value.filter(r => r.id !== reportId)
  }
}

const getReportTypeName = (type) => {
  const typeNames = {
    user_actions: 'Действия пользователей',
    step_performance: 'Производительность шагов',
    device_analytics: 'Аналитика устройств',
    error_analysis: 'Анализ ошибок',
    operator_metrics: 'Метрики операторов'
  }
  return typeNames[type] || type
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Load reports on mount
onMounted(() => {
  refreshReports()
})

// Meta tags
useHead({
  title: 'Отчеты - Админ-панель',
  meta: [
    { name: 'description', content: 'Генерация и управление отчетами системы диагностики' }
  ]
})
</script>
