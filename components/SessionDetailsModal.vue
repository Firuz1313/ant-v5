<template>
  <div class="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div class="bg-white dark:bg-dark-100 rounded-xl shadow-2xl max-w-4xl w-full max-h-screen overflow-y-auto">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            📊 Детали сессии {{ session.sessionId.split('_')[1] }}
          </h3>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
          </button>
        </div>
      </div>

      <div class="p-6">
        <!-- Session Overview -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
            <div class="text-sm font-medium text-blue-800 dark:text-blue-200">Продолжительность</div>
            <div class="text-lg font-bold text-blue-900 dark:text-blue-100">
              {{ formatDuration(session.summary?.duration || 0) }}
            </div>
          </div>
          
          <div class="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
            <div class="text-sm font-medium text-green-800 dark:text-green-200">Прогресс</div>
            <div class="text-lg font-bold text-green-900 dark:text-green-100">
              {{ Math.round((session.completion?.completionRate || 0) * 100) }}%
            </div>
          </div>
          
          <div class="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
            <div class="text-sm font-medium text-yellow-800 dark:text-yellow-200">События</div>
            <div class="text-lg font-bold text-yellow-900 dark:text-yellow-100">
              {{ session.events?.length || 0 }}
            </div>
          </div>
          
          <div class="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
            <div class="text-sm font-medium text-purple-800 dark:text-purple-200">Статус</div>
            <div class="text-lg font-bold text-purple-900 dark:text-purple-100">
              {{ session.completion?.wasCompleted ? 'Завершена' : 'Прервана' }}
            </div>
          </div>
        </div>

        <!-- Behavior Analysis -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <!-- User Journey -->
          <div class="card p-4">
            <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              🗺️ Путь пользователя
            </h4>
            <div class="space-y-3 max-h-64 overflow-y-auto">
              <div 
                v-for="(step, index) in session.userJourney" 
                :key="index"
                class="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-800 rounded"
              >
                <div class="flex-shrink-0">
                  <div 
                    class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    :class="{
                      'bg-green-500 text-white': step.action === 'completed',
                      'bg-blue-500 text-white': step.action === 'viewed',
                      'bg-red-500 text-white': step.action === 'failed',
                      'bg-gray-400 text-white': step.action === 'skipped'
                    }"
                  >
                    {{ index + 1 }}
                  </div>
                </div>
                <div class="flex-1">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ step.stepTitle }}
                  </div>
                  <div class="text-xs text-gray-600 dark:text-gray-400">
                    {{ step.action }} • {{ formatTime(step.timeOnStep) }}
                  </div>
                </div>
                <div class="text-xs text-gray-500">
                  {{ formatRelativeTime(step.timestamp) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Performance Metrics -->
          <div class="card p-4">
            <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              ⚡ Метрики производительности
            </h4>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600 dark:text-gray-400">Среднее время на шаг:</span>
                <span class="font-semibold text-gray-900 dark:text-white">
                  {{ formatTime(session.performance?.avgTimePerStep || 0) }}
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600 dark:text-gray-400">Точность кнопок:</span>
                <span class="font-semibold text-gray-900 dark:text-white">
                  {{ Math.round((session.behaviorPatterns?.buttonPressAccuracy || 0) * 100) }}%
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600 dark:text-gray-400">Шагов просмотрено:</span>
                <span class="font-semibold text-gray-900 dark:text-white">
                  {{ session.performance?.totalSteps || 0 }}
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600 dark:text-gray-400">Шагов завершено:</span>
                <span class="font-semibold text-gray-900 dark:text-white">
                  {{ session.performance?.completedSteps || 0 }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Stuck Points Analysis -->
        <div v-if="session.stuckPoints && session.stuckPoints.length > 0" class="card p-4 mb-6">
          <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🚫 Проблемные места
          </h4>
          <div class="space-y-3">
            <div 
              v-for="stuckPoint in session.stuckPoints" 
              :key="stuckPoint.stepId"
              class="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900 rounded-lg"
            >
              <div>
                <div class="font-medium text-red-800 dark:text-red-200">
                  {{ stuckPoint.stepTitle }}
                </div>
                <div class="text-sm text-red-600 dark:text-red-400">
                  Время застревания: {{ formatTime(stuckPoint.timeSpent) }}
                </div>
              </div>
              <div class="text-xs text-red-500">
                {{ formatRelativeTime(stuckPoint.timestamp) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Event Types Distribution -->
        <div class="card p-4 mb-6">
          <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            📈 Распределение событий
          </h4>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div 
              v-for="(count, type) in session.eventTypes" 
              :key="type"
              class="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded"
            >
              <div class="text-lg font-bold text-gray-900 dark:text-white">{{ count }}</div>
              <div class="text-xs text-gray-600 dark:text-gray-400 capitalize">
                {{ formatEventType(type) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Technical Details -->
        <div class="card p-4">
          <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🔧 Технические детали
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div class="font-medium text-gray-700 dark:text-gray-300">IP адрес:</div>
              <div class="text-gray-600 dark:text-gray-400">{{ session.ip || 'Неизвестно' }}</div>
            </div>
            <div>
              <div class="font-medium text-gray-700 dark:text-gray-300">User Agent:</div>
              <div class="text-gray-600 dark:text-gray-400 truncate">
                {{ session.userAgent || 'Неизвестно' }}
              </div>
            </div>
            <div>
              <div class="font-medium text-gray-700 dark:text-gray-300">Время создания:</div>
              <div class="text-gray-600 dark:text-gray-400">
                {{ formatDateTime(session.timestamp) }}
              </div>
            </div>
            <div>
              <div class="font-medium text-gray-700 dark:text-gray-300">Обработано:</div>
              <div class="text-gray-600 dark:text-gray-400">
                {{ formatDateTime(session.processedAt) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
        <div class="flex space-x-2">
          <button
            @click="exportSession"
            class="btn-secondary text-sm"
          >
            📄 Экспорт
          </button>
          <button
            v-if="session.flags && session.flags.length > 0"
            @click="showFlags = !showFlags"
            class="btn-secondary text-sm"
          >
            🏁 Флаги ({{ session.flags.length }})
          </button>
        </div>
        
        <button
          @click="$emit('close')"
          class="btn-primary"
        >
          Закрыть
        </button>
      </div>

      <!-- Flags Panel -->
      <div v-if="showFlags && session.flags" class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <h5 class="font-medium text-gray-900 dark:text-white mb-3">Системные флаги:</h5>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="flag in session.flags"
            :key="flag"
            class="px-3 py-1 text-sm rounded-full"
            :class="getFlagColor(flag)"
          >
            {{ getFlagText(flag) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  session: {
    type: Object,
    required: true
  }
})

defineEmits(['close'])

const showFlags = ref(false)

// Methods
const formatDuration = (ms) => {
  if (!ms) return '0с'
  const minutes = Math.floor(ms / (1000 * 60))
  const seconds = Math.floor((ms % (1000 * 60)) / 1000)
  return minutes > 0 ? `${minutes}м ${seconds}с` : `${seconds}с`
}

const formatTime = (ms) => {
  if (!ms) return '0с'
  const seconds = Math.round(ms / 1000)
  if (seconds < 60) return `${seconds}с`
  const minutes = Math.round(seconds / 60)
  return `${minutes}м`
}

const formatRelativeTime = (timestamp) => {
  const now = Date.now()
  const time = new Date(timestamp).getTime()
  const diff = now - time
  
  if (diff < 60000) return 'Только что'
  if (diff < 3600000) return `${Math.round(diff / 60000)}м назад`
  if (diff < 86400000) return `${Math.round(diff / 3600000)}ч назад`
  return `${Math.round(diff / 86400000)}д назад`
}

const formatDateTime = (timestamp) => {
  if (!timestamp) return 'Неизвестно'
  return new Date(timestamp).toLocaleString('ru-RU')
}

const formatEventType = (type) => {
  const typeMap = {
    'session_start': 'Старт',
    'step_action': 'Шаги',
    'button_press': 'Кнопки',
    'user_choice': 'Выборы',
    'error': 'Ошибки',
    'diagnostic_completion': 'Завершение'
  }
  return typeMap[type] || type
}

const getFlagColor = (flag) => {
  const colors = {
    'low_completion_rate': 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100',
    'high_button_error_rate': 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100',
    'slow_progression': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
    'multiple_stuck_points': 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100'
  }
  return colors[flag] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
}

const getFlagText = (flag) => {
  const texts = {
    'low_completion_rate': 'Низкое завершение',
    'high_button_error_rate': 'Ошибки кнопок',
    'slow_progression': 'Медленный прогресс',
    'multiple_stuck_points': 'Множественные зависания'
  }
  return texts[flag] || flag.replace(/_/g, ' ')
}

const exportSession = () => {
  const data = JSON.stringify(props.session, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `session_${props.session.sessionId}_details.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
</script>
