<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header with actions -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Управление шагами диагностики</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          Создавайте и редактируйте пошаговые инструкции с продвинутыми функциями
        </p>
      </div>
      <div class="mt-4 lg:mt-0 flex space-x-3">
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
        <button
          @click="showPreviewModal = true"
          class="btn-secondary"
        >
          👁️ Предпросмотр
        </button>
        <button
          @click="showCreateModal = true"
          class="btn-primary"
        >
          + Добавить шаг
        </button>
      </div>
    </div>

    <!-- Filters and search -->
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      <!-- Search -->
      <div class="lg:col-span-2">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Поиск по названию
        </label>
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Введите название шага..."
            class="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
          />
          <svg class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path>
          </svg>
        </div>
      </div>

      <!-- Device filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Приставка
        </label>
        <select
          v-model="selectedDevice"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="">Все</option>
          <option v-for="device in devices" :key="device.id" :value="device.id">
            {{ device.name }}
          </option>
        </select>
      </div>

      <!-- Error filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Ошибка
        </label>
        <select
          v-model="selectedError"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="">Все</option>
          <option v-for="error in filteredErrors" :key="error.id" :value="error.id">
            {{ error.title }}
          </option>
        </select>
      </div>

      <!-- Sort -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Сортировка
        </label>
        <select
          v-model="sortBy"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="order">По порядку</option>
          <option value="title">По названию</option>
          <option value="created">По дате создания</option>
        </select>
      </div>
    </div>

    <!-- Steps table -->
    <div class="card overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            Шаги диагностики ({{ filteredSteps.length }})
          </h3>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500">Drag & Drop для изменения порядка</span>
            <button
              @click="exportSteps"
              class="text-sm text-primary-600 hover:text-primary-700"
            >
              📄 Экспорт
            </button>
          </div>
        </div>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Порядок
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Название и описание
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Кнопки пульта
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Особенности
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Медиа
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-dark-100 divide-y divide-gray-200 dark:divide-gray-700">
            <tr 
              v-for="step in filteredSteps" 
              :key="step.id"
              :class="{ 'opacity-50': step.onlyForOperator && !operatorMode }"
              class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <!-- Order -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center space-x-2">
                  <span class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ step.order_index }}
                  </span>
                  <button class="text-gray-400 hover:text-gray-600 cursor-move">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M7 2a1 1 0 000 2h6a1 1 0 100-2H7zM7 8a1 1 0 000 2h6a1 1 0 100-2H7zM7 14a1 1 0 000 2h6a1 1 0 100-2H7z"></path>
                    </svg>
                  </button>
                </div>
              </td>

              <!-- Title and description -->
              <td class="px-6 py-4">
                <div class="flex items-start space-x-3">
                  <img 
                    v-if="step.screen_image" 
                    :src="step.screen_image" 
                    :alt="step.title"
                    class="w-16 h-12 object-cover rounded border"
                  />
                  <div class="w-16 h-12 bg-gray-200 dark:bg-gray-700 rounded border flex items-center justify-center" v-else>
                    <span class="text-gray-400 text-xs">Нет фото</span>
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center space-x-2">
                      <h4 class="text-sm font-medium text-gray-900 dark:text-white">
                        {{ step.title }}
                      </h4>
                      <span v-if="step.onlyForOperator" class="px-2 py-1 text-xs bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100 rounded-full">
                        🔒 Оператор
                      </span>
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {{ step.instruction }}
                    </p>
                    <p v-if="step.tip" class="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      💡 {{ step.tip }}
                    </p>
                  </div>
                </div>
              </td>

              <!-- Remote buttons -->
              <td class="px-6 py-4">
                <div v-if="step.actions && step.actions.length > 0" class="space-y-1">
                  <div 
                    v-for="action in step.actions.slice(0, 3)" 
                    :key="action.buttonId"
                    class="flex items-center space-x-2"
                  >
                    <span class="w-6 h-6 bg-yellow-100 text-yellow-800 text-xs rounded flex items-center justify-center font-mono">
                      {{ getButtonIcon(action.buttonId) }}
                    </span>
                    <span class="text-xs text-gray-600 dark:text-gray-400">
                      {{ action.description }}
                    </span>
                  </div>
                  <div v-if="step.actions.length > 3" class="text-xs text-gray-500">
                    +{{ step.actions.length - 3 }} еще...
                  </div>
                </div>
                <div v-else-if="step.highlighted_buttons && step.highlighted_buttons.length > 0" class="flex space-x-1">
                  <span 
                    v-for="button in step.highlighted_buttons.slice(0, 4)" 
                    :key="button"
                    class="w-6 h-6 bg-yellow-100 text-yellow-800 text-xs rounded flex items-center justify-center font-mono"
                  >
                    {{ getButtonIcon(button) }}
                  </span>
                  <span v-if="step.highlighted_buttons.length > 4" class="text-xs text-gray-500">
                    +{{ step.highlighted_buttons.length - 4 }}
                  </span>
                </div>
                <span v-else class="text-sm text-gray-400">Нет кнопок</span>
              </td>

              <!-- Features -->
              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-1">
                  <span v-if="step.ifNoResult" class="px-2 py-1 text-xs bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100 rounded-full">
                    🔄 Альтернатива
                  </span>
                  <span v-if="step.userConfirmation" class="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 rounded-full">
                    ❓ Подтверждение
                  </span>
                  <span v-if="step.validation" class="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 rounded-full">
                    ✅ Валидация
                  </span>
                  <span v-if="step.progress" class="px-2 py-1 text-xs bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100 rounded-full">
                    ⏳ Прогресс
                  </span>
                </div>
              </td>

              <!-- Media -->
              <td class="px-6 py-4">
                <div class="flex items-center space-x-2">
                  <span v-if="step.media" class="text-sm">
                    {{ getMediaIcon(step.media.type) }} {{ step.media.type }}
                  </span>
                  <span v-if="step.audio_url" class="text-sm">🔊 Аудио</span>
                  <span v-if="!step.media && !step.audio_url" class="text-sm text-gray-400">Нет медиа</span>
                </div>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <button
                    @click="previewStep(step)"
                    class="text-blue-600 hover:text-blue-900 transition-colors"
                    title="Предпросмотр"
                  >
                    👁️
                  </button>
                  <button
                    @click="editStep(step)"
                    class="text-indigo-600 hover:text-indigo-900 transition-colors"
                    title="Редактировать"
                  >
                    ✏️
                  </button>
                  <button
                    @click="duplicateStep(step)"
                    class="text-green-600 hover:text-green-900 transition-colors"
                    title="Дублировать"
                  >
                    📋
                  </button>
                  <button
                    @click="deleteStep(step)"
                    class="text-red-600 hover:text-red-900 transition-colors"
                    title="Удалить"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Step Creation/Edit Modal -->
    <StepEditor
      v-if="showCreateModal || editingStep"
      :step="editingStep"
      :devices="devices"
      :errors="allErrors"
      @close="closeStepModal"
      @save="saveStep"
    />

    <!-- Preview Modal -->
    <StepPreview
      v-if="showPreviewModal"
      :steps="filteredSteps"
      :operator-mode="operatorMode"
      @close="showPreviewModal = false"
    />

    <!-- Analytics Panel -->
    <div class="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Step Analytics -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          📊 Аналитика шагов
        </h3>
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600 dark:text-gray-400">Всего шагов:</span>
            <span class="font-semibold text-gray-900 dark:text-white">{{ totalSteps }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600 dark:text-gray-400">Только для операторов:</span>
            <span class="font-semibold text-gray-900 dark:text-white">{{ operatorOnlySteps }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600 dark:text-gray-400">С альтернативами:</span>
            <span class="font-semibold text-gray-900 dark:text-white">{{ stepsWithAlternatives }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600 dark:text-gray-400">С мед��а:</span>
            <span class="font-semibold text-gray-900 dark:text-white">{{ stepsWithMedia }}</span>
          </div>
        </div>
      </div>

      <!-- Recent User Actions -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          📋 Последние действия пользователей
        </h3>
        <div class="space-y-3">
          <div v-for="action in recentActions" :key="action.id" class="flex items-center space-x-3">
            <div class="w-2 h-2 bg-green-400 rounded-full"></div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-900 dark:text-white">
                {{ action.description }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ action.timestamp }}
              </p>
            </div>
          </div>
        </div>
        <button class="mt-4 w-full text-sm text-primary-600 hover:text-primary-700">
          Посмотреть все логи →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Load initial data
const { data: devices } = await useLazyFetch('/api/devices')
const { data: allErrors } = await useLazyFetch('/api/errors/all')
const { data: allSteps, refresh: refreshSteps } = await useLazyFetch('/api/steps/all')

// Reactive state
const searchQuery = ref('')
const selectedDevice = ref('')
const selectedError = ref('')
const sortBy = ref('order')
const operatorMode = ref(false)
const showCreateModal = ref(false)
const showPreviewModal = ref(false)
const editingStep = ref(null)

// Computed properties
const filteredErrors = computed(() => {
  if (!selectedDevice.value) return allErrors.value || []
  return (allErrors.value || []).filter(error => error.device_id == selectedDevice.value)
})

const filteredSteps = computed(() => {
  let steps = allSteps.value || []
  
  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    steps = steps.filter(step => 
      step.title.toLowerCase().includes(query) ||
      step.instruction.toLowerCase().includes(query)
    )
  }
  
  // Device filter
  if (selectedDevice.value) {
    steps = steps.filter(step => step.device_id == selectedDevice.value)
  }
  
  // Error filter
  if (selectedError.value) {
    steps = steps.filter(step => step.error_id == selectedError.value)
  }
  
  // Operator mode filter
  if (!operatorMode.value) {
    steps = steps.filter(step => !step.onlyForOperator)
  }
  
  // Sort
  if (sortBy.value === 'title') {
    steps.sort((a, b) => a.title.localeCompare(b.title))
  } else if (sortBy.value === 'created') {
    steps.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  } else {
    steps.sort((a, b) => a.order_index - b.order_index)
  }
  
  return steps
})

const totalSteps = computed(() => (allSteps.value || []).length)
const operatorOnlySteps = computed(() => (allSteps.value || []).filter(s => s.onlyForOperator).length)
const stepsWithAlternatives = computed(() => (allSteps.value || []).filter(s => s.ifNoResult).length)
const stepsWithMedia = computed(() => (allSteps.value || []).filter(s => s.media || s.audio_url).length)

// Mock recent actions
const recentActions = ref([
  { id: 1, description: 'Пользователь прошел шаг "Проверка карты"', timestamp: '2 мин назад' },
  { id: 2, description: 'Пользователь застрял на шаге "Настройка антенны"', timestamp: '5 мин назад' },
  { id: 3, description: 'Завершена диагностика Openbox GOLD', timestamp: '10 мин назад' }
])

// Methods
const toggleOperatorMode = () => {
  operatorMode.value = !operatorMode.value
}

const getButtonIcon = (buttonId) => {
  if (!buttonId) return '?'

  const icons = {
    'power': '⏻',
    'menu': '☰',
    'ok': '✓',
    'up': '↑',
    'down': '↓',
    'left': '←',
    'right': '→',
    'info': 'ℹ',
    'exit': '✕',
    'source': 'SRC'
  }
  return icons[buttonId] || buttonId.toString().toUpperCase().slice(0, 2)
}

const getMediaIcon = (type) => {
  const icons = {
    'image': '🖼️',
    'video': '🎥',
    'animation': '🎞️'
  }
  return icons[type] || '📄'
}

const editStep = (step) => {
  editingStep.value = step
  showCreateModal.value = true
}

const previewStep = (step) => {
  // Open step in preview mode
  console.log('Preview step:', step)
}

const duplicateStep = (step) => {
  const newStep = { ...step, id: null, title: `${step.title} (копия)` }
  editingStep.value = newStep
  showCreateModal.value = true
}

const deleteStep = async (step) => {
  if (!confirm(`Удалить шаг "${step.title}"?`)) return
  
  try {
    await $fetch(`/api/admin/step/${step.id}`, { method: 'DELETE' })
    // Refresh steps
    await refreshSteps()
  } catch (error) {
    console.error('Failed to delete step:', error)
    alert('Ошибка при удалении шага')
  }
}

const closeStepModal = () => {
  showCreateModal.value = false
  editingStep.value = null
}

const saveStep = async (stepData) => {
  try {
    if (editingStep.value && editingStep.value.id) {
      await $fetch(`/api/admin/step/${editingStep.value.id}`, {
        method: 'PUT',
        body: stepData
      })
    } else {
      await $fetch('/api/admin/step', {
        method: 'POST',
        body: stepData
      })
    }
    
    closeStepModal()
    // Refresh steps
    await refreshSteps()
  } catch (error) {
    console.error('Failed to save step:', error)
    alert('Ошибка при сохранении шага')
  }
}

const exportSteps = () => {
  const data = JSON.stringify(filteredSteps.value, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'steps_export.json'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Meta tags
useHead({
  title: 'Управление шагам�� - Админ-панель',
})

// Layout
definePageMeta({
  layout: 'admin'
})
</script>
