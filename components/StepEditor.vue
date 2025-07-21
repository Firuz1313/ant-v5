<template>
  <div class="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-start justify-center p-4">
    <div class="bg-white dark:bg-dark-100 rounded-xl shadow-2xl max-w-4xl w-full max-h-screen overflow-y-auto">
      <form @submit.prevent="handleSave" @click.stop>
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ isEditing ? 'Редактировать шаг' : 'Создать новый шаг' }}
            </h3>
            <button
              type="button"
              @click="$emit('close')"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Form content -->
        <div class="px-6 py-4 space-y-6">
          <!-- Basic Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Название шага *
              </label>
              <input
                v-model="form.title"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder="Например: Проверка карты доступа"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Порядковый номер
              </label>
              <input
                v-model.number="form.order_index"
                type="number"
                min="1"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <!-- Device and Error Selection -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Приставка *
              </label>
              <select
                v-model="form.device_id"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Выберите приставку</option>
                <option v-for="device in devices" :key="device.id" :value="device.id">
                  {{ device.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ошибка *
              </label>
              <select
                v-model="form.error_id"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Выберите ошибку</option>
                <option v-for="error in filteredErrors" :key="error.id" :value="error.id">
                  {{ error.title }}
                </option>
              </select>
            </div>
          </div>

          <!-- Instruction and Tip -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Инструкция *
            </label>
            <textarea
              v-model="form.instruction"
              required
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder="Подробное описание того, что должен сделать пользователь"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Подсказка (необязательно)
            </label>
            <textarea
              v-model="form.tip"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder="Дополнительная подсказка для пользователя"
            ></textarea>
          </div>

          <!-- Remote Control Actions -->
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-lg font-medium text-gray-900 dark:text-white">
                🎮 Действия с пультом
              </h4>
              <button
                type="button"
                @click="addAction"
                class="btn-secondary text-sm"
              >
                + Добавить кнопку
              </button>
            </div>

            <div v-if="form.actions.length === 0" class="text-center py-8 text-gray-500">
              Нет действий с пультом
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="(action, index) in form.actions"
                :key="index"
                class="flex items-center space-x-3 p-3 bg-white dark:bg-gray-700 rounded border"
              >
                <span class="text-sm font-medium text-gray-500">{{ index + 1 }}.</span>
                
                <select
                  v-model="action.buttonId"
                  class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm"
                >
                  <option value="">Выберите кнопку</option>
                  <option v-for="button in remoteButtons" :key="button.id" :value="button.id">
                    {{ button.label }}
                  </option>
                </select>

                <input
                  v-model="action.description"
                  type="text"
                  placeholder="Описание действия"
                  class="flex-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm"
                />

                <button
                  type="button"
                  @click="removeAction(index)"
                  class="text-red-600 hover:text-red-800"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Advanced Features -->
          <div class="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
            <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              ⚙️ Расширенные функции
            </h4>

            <!-- Operator Only -->
            <div class="flex items-center space-x-3 mb-4">
              <input
                v-model="form.onlyForOperator"
                type="checkbox"
                id="operatorOnly"
                class="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label for="operatorOnly" class="text-sm font-medium text-gray-700 dark:text-gray-300">
                🔒 Только для операторов
              </label>
              <span class="text-xs text-gray-500">Шаг будет виден только в режиме оператора</span>
            </div>

            <!-- Progress Indicator -->
            <div class="flex items-center space-x-3 mb-4">
              <input
                v-model="form.progress"
                type="checkbox"
                id="progress"
                class="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label for="progress" class="text-sm font-medium text-gray-700 dark:text-gray-300">
                ⏳ Показать прогресс
              </label>
              <span class="text-xs text-gray-500">Отображать индикатор загрузки</span>
            </div>

            <!-- User Confirmation -->
            <div class="mb-4">
              <div class="flex items-center space-x-3 mb-2">
                <input
                  v-model="form.hasConfirmation"
                  type="checkbox"
                  id="confirmation"
                  class="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label for="confirmation" class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  ❓ Требует подтверждения от пользователя
                </label>
              </div>

              <div v-if="form.hasConfirmation" class="ml-7 space-y-2">
                <input
                  v-model="form.userConfirmation.question"
                  type="text"
                  placeholder="Вопрос для пользователя"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm"
                />

                <div class="space-y-2">
                  <div
                    v-for="(option, index) in form.userConfirmation.options"
                    :key="index"
                    class="flex items-center space-x-2"
                  >
                    <input
                      v-model="option.text"
                      type="text"
                      placeholder="Вариант ответа"
                      class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm"
                    />
                    <select
                      v-model="option.action"
                      class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm"
                    >
                      <option value="next">Следующий шаг</option>
                      <option value="alternative">Альтернативный путь</option>
                      <option value="completion">Завершение</option>
                      <option value="restart">Начать заново</option>
                    </select>
                    <button
                      type="button"
                      @click="removeConfirmationOption(index)"
                      class="text-red-600 hover:text-red-800"
                    >
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                      </svg>
                    </button>
                  </div>
                  <button
                    type="button"
                    @click="addConfirmationOption"
                    class="text-sm text-primary-600 hover:text-primary-700"
                  >
                    + Добавить вариант
                  </button>
                </div>
              </div>
            </div>

            <!-- Alternative Scenario -->
            <div class="mb-4">
              <div class="flex items-center space-x-3 mb-2">
                <input
                  v-model="form.hasAlternative"
                  type="checkbox"
                  id="alternative"
                  class="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label for="alternative" class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  🔄 Альтернативный сценарий "Если не помогло"
                </label>
              </div>

              <div v-if="form.hasAlternative" class="ml-7 space-y-2">
                <input
                  v-model="form.ifNoResult.description"
                  type="text"
                  placeholder="Описание альтернативного пути"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm"
                />
                <input
                  v-model="form.ifNoResult.nextStepId"
                  type="text"
                  placeholder="ID следующего шага"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm"
                />
              </div>
            </div>
          </div>

          <!-- Media Upload -->
          <div class="bg-green-50 dark:bg-green-900 rounded-lg p-4">
            <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              🎥 Медиа-контент
            </h4>

            <!-- Screen Image -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Изображение экрана ТВ
              </label>
              <input
                type="file"
                accept="image/*"
                @change="handleScreenImageUpload"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
              <div v-if="form.screen_image" class="mt-2">
                <img :src="form.screen_image" alt="Screen preview" class="w-32 h-24 object-cover rounded border">
              </div>
            </div>

            <!-- Media Content -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Дополнительное медиа (видео/анимация)
              </label>
              <select
                v-model="form.media.type"
                class="w-full mb-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Без дополнительного медиа</option>
                <option value="image">Изображение</option>
                <option value="video">Видео</option>
                <option value="animation">Анимация (GIF)</option>
              </select>

              <div v-if="form.media.type">
                <input
                  type="file"
                  :accept="getMediaAccept(form.media.type)"
                  @change="handleMediaUpload"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                />
                <input
                  v-model="form.media.description"
                  type="text"
                  placeholder="Описание медиа"
                  class="w-full mt-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm"
                />
              </div>
            </div>

            <!-- Audio -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Аудио-подсказка
              </label>
              <input
                type="file"
                accept="audio/*"
                @change="handleAudioUpload"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
          <button
            type="button"
            @click="$emit('close')"
            class="btn-secondary"
          >
            Отмена
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="btn-primary"
          >
            {{ loading ? 'Сохранение...' : 'Сохранить' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  step: {
    type: Object,
    default: null
  },
  devices: {
    type: Array,
    default: () => []
  },
  errors: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'save'])

// Reactive state
const loading = ref(false)

const form = ref({
  title: '',
  order_index: 1,
  device_id: '',
  error_id: '',
  instruction: '',
  tip: '',
  screen_image: null,
  actions: [],
  onlyForOperator: false,
  progress: false,
  hasConfirmation: false,
  userConfirmation: {
    question: '',
    options: [
      { text: 'Да', action: 'next' },
      { text: 'Нет', action: 'alternative' }
    ]
  },
  hasAlternative: false,
  ifNoResult: {
    description: '',
    nextStepId: ''
  },
  media: {
    type: '',
    url: null,
    description: ''
  },
  audio_url: null
})

// Remote control buttons
const remoteButtons = [
  { id: 'power', label: '⏻ POWER' },
  { id: 'source', label: '📺 SOURCE' },
  { id: 'menu', label: '☰ MENU' },
  { id: 'exit', label: '✕ EXIT' },
  { id: 'info', label: 'ℹ INFO' },
  { id: 'ok', label: '✓ OK' },
  { id: 'up', label: '↑ UP' },
  { id: 'down', label: '↓ DOWN' },
  { id: 'left', label: '← LEFT' },
  { id: 'right', label: '→ RIGHT' },
  { id: 'vol-up', label: '🔊 VOL+' },
  { id: 'vol-down', label: '🔉 VOL-' },
  { id: 'ch-up', label: '📺 CH+' },
  { id: 'ch-down', label: '📺 CH-' },
  ...Array.from({ length: 10 }, (_, i) => ({ id: `num-${i}`, label: `${i}` }))
]

// Computed properties
const isEditing = computed(() => !!props.step)

const filteredErrors = computed(() => {
  if (!form.value.device_id) return []
  return props.errors.filter(error => error.device_id == form.value.device_id)
})

// Initialize form
onMounted(() => {
  if (props.step) {
    Object.assign(form.value, {
      ...props.step,
      actions: props.step.actions || [],
      hasConfirmation: !!props.step.userConfirmation,
      hasAlternative: !!props.step.ifNoResult,
      userConfirmation: props.step.userConfirmation || form.value.userConfirmation,
      ifNoResult: props.step.ifNoResult || form.value.ifNoResult,
      media: props.step.media || form.value.media
    })
  }
})

// Methods
const addAction = () => {
  form.value.actions.push({
    buttonId: '',
    description: ''
  })
}

const removeAction = (index) => {
  form.value.actions.splice(index, 1)
}

const addConfirmationOption = () => {
  form.value.userConfirmation.options.push({
    text: '',
    action: 'next'
  })
}

const removeConfirmationOption = (index) => {
  if (form.value.userConfirmation.options.length > 1) {
    form.value.userConfirmation.options.splice(index, 1)
  }
}

const getMediaAccept = (type) => {
  switch (type) {
    case 'image': return 'image/*'
    case 'video': return 'video/*'
    case 'animation': return 'image/gif'
    default: return '*/*'
  }
}

const handleScreenImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      form.value.screen_image = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const handleMediaUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      form.value.media.url = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const handleAudioUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      form.value.audio_url = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const handleSave = async () => {
  loading.value = true
  
  try {
    // Prepare data
    const stepData = { ...form.value }
    
    // Clean up conditional data
    if (!stepData.hasConfirmation) {
      delete stepData.userConfirmation
    }
    if (!stepData.hasAlternative) {
      delete stepData.ifNoResult
    }
    if (!stepData.media.type) {
      delete stepData.media
    }
    
    delete stepData.hasConfirmation
    delete stepData.hasAlternative
    
    emit('save', stepData)
  } catch (error) {
    console.error('Error saving step:', error)
    alert('Ошибка при сохранении шага')
  } finally {
    loading.value = false
  }
}
</script>
