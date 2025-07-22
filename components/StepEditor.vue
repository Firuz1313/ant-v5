<template>
  <div class="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div class="bg-white dark:bg-dark-100 rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
            {{ step ? 'Редактировать шаг' : 'Д��бавить шаг' }}
          </h2>
          <p class="text-gray-600 dark:text-gray-400 mt-1">
            Создайте интерактивный шаг диагностики с медиа и подсказками для пульта
          </p>
        </div>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </div>

      <!-- Body with scrollable content -->
      <div class="flex-1 overflow-y-auto p-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Left Column: Form Fields -->
          <div class="space-y-6">
            <!-- Basic Information -->
            <div class="card p-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                📝 Основная информация
              </h3>
              
              <!-- Device and Error Selection -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Приставка *
                  </label>
                  <select
                    v-model="formData.device_id"
                    @change="updateErrorsList"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
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
                    v-model="formData.error_id"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                    :disabled="!formData.device_id"
                  >
                    <option value="">Выберите ошибку</option>
                    <option v-for="error in filteredErrors" :key="error.id" :value="error.id">
                      {{ error.title }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Step Order -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Порядковый номер шага
                </label>
                <input
                  v-model.number="formData.order_index"
                  type="number"
                  min="1"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Автоматически"
                >
              </div>

              <!-- Title -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Название шага *
                </label>
                <input
                  v-model="formData.title"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Например: Проверка подключения кабеля"
                  required
                >
              </div>

              <!-- Instruction -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Инструкция *
                </label>
                <textarea
                  v-model="formData.instruction"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Подробно опишите, что должен делать пользователь"
                  required
                ></textarea>
              </div>

              <!-- Tip -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Подсказка (необязательно)
                </label>
                <textarea
                  v-model="formData.tip"
                  rows="2"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Дополнительная информация или совет"
                ></textarea>
              </div>

              <!-- Advanced Options -->
              <div class="space-y-4">
                <div class="flex items-center">
                  <input
                    v-model="formData.onlyForOperator"
                    type="checkbox"
                    id="operatorOnly"
                    class="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  >
                  <label for="operatorOnly" class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    🔒 Только для операторов
                  </label>
                </div>

                <div class="flex items-center">
                  <input
                    v-model="formData.critical"
                    type="checkbox"
                    id="critical"
                    class="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  >
                  <label for="critical" class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    ⚠️ Критичный шаг
                  </label>
                </div>
              </div>
            </div>

            <!-- TV Screen Image Upload -->
            <div class="card p-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                📺 Изображение экрана ТВ
              </h3>
              
              <div class="space-y-4">
                <!-- Upload Area -->
                <div
                  @drop="handleTVImageDrop"
                  @dragover.prevent
                  @dragenter.prevent
                  class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-primary-500 transition-colors"
                  :class="{ 'border-primary-500 bg-primary-50 dark:bg-primary-900/20': isDraggingTV }"
                >
                  <div v-if="!formData.screen_image" class="space-y-4">
                    <div class="text-4xl">📺</div>
                    <div>
                      <p class="text-gray-600 dark:text-gray-400">
                        Перетащите изображение экрана ТВ или 
                        <button
                          type="button"
                          @click="$refs.tvImageInput.click()"
                          class="text-primary-600 hover:text-primary-700"
                        >
                          выберите файл
                        </button>
                      </p>
                      <p class="text-xs text-gray-500 mt-1">
                        PNG, JPG, WebP до 5MB
                      </p>
                    </div>
                  </div>
                  
                  <!-- Preview -->
                  <div v-else class="space-y-4">
                    <img
                      :src="formData.screen_image"
                      alt="TV Screen"
                      class="max-w-full h-32 object-contain mx-auto rounded border"
                    >
                    <div class="flex justify-center space-x-2">
                      <button
                        type="button"
                        @click="$refs.tvImageInput.click()"
                        class="text-sm text-primary-600 hover:text-primary-700"
                      >
                        ✏️ Заменить
                      </button>
                      <button
                        type="button"
                        @click="formData.screen_image = null"
                        class="text-sm text-red-600 hover:text-red-700"
                      >
                        🗑️ Удалить
                      </button>
                    </div>
                  </div>
                </div>

                <input
                  ref="tvImageInput"
                  type="file"
                  accept="image/*"
                  @change="handleTVImageUpload"
                  class="hidden"
                >
              </div>
            </div>

            <!-- Voice Recording -->
            <div class="card p-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                🔊 Голосовая озвучка
              </h3>
              
              <div class="space-y-4">
                <!-- Recording Controls -->
                <div v-if="!formData.audio_url" class="text-center space-y-4">
                  <div class="text-4xl">🎤</div>
                  <div class="space-y-2">
                    <button
                      type="button"
                      @click="startRecording"
                      :disabled="isRecording"
                      class="btn-primary mr-2"
                      :class="{ 'opacity-50 cursor-not-allowed': isRecording }"
                    >
                      {{ isRecording ? '⏹️ Запись...' : '🎤 Начать запись' }}
                    </button>
                    <button
                      type="button"
                      @click="$refs.audioInput.click()"
                      class="btn-secondary"
                    >
                      📁 Загрузить файл
                    </button>
                  </div>
                  <p class="text-xs text-gray-500">
                    Запишите голосовую инструкцию или загрузите MP3 файл
                  </p>
                </div>

                <!-- Audio Preview -->
                <div v-else class="text-center space-y-4">
                  <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
                    <div class="flex items-center justify-center space-x-3">
                      <button
                        type="button"
                        @click="toggleAudioPlayback"
                        class="text-green-600 hover:text-green-700"
                      >
                        {{ isPlaying ? '⏸️' : '▶️' }}
                      </button>
                      <span class="text-sm text-green-800 dark:text-green-200">
                        Аудио загружено
                      </span>
                    </div>
                    <audio ref="audioPlayer" :src="formData.audio_url" @ended="isPlaying = false"></audio>
                  </div>
                  <div class="flex justify-center space-x-2">
                    <button
                      type="button"
                      @click="$refs.audioInput.click()"
                      class="text-sm text-primary-600 hover:text-primary-700"
                    >
                      ✏️ Заменить
                    </button>
                    <button
                      type="button"
                      @click="formData.audio_url = null"
                      class="text-sm text-red-600 hover:text-red-700"
                    >
                      🗑️ Удалить
                    </button>
                  </div>
                </div>

                <input
                  ref="audioInput"
                  type="file"
                  accept="audio/*"
                  @change="handleAudioUpload"
                  class="hidden"
                >
              </div>
            </div>
          </div>

          <!-- Right Column: Remote Control Hints -->
          <div class="space-y-6">
            <!-- Remote Control Hints -->
            <div class="card p-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                🎮 Подсказки на пульте
              </h3>
              
              <!-- Remote Type Selection -->
              <div class="mb-4">
                <div class="flex space-x-4">
                  <label class="flex items-center">
                    <input
                      v-model="remoteHintType"
                      type="radio"
                      value="svg"
                      class="mr-2"
                    >
                    <span class="text-sm">SVG Пульт</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      v-model="remoteHintType"
                      type="radio"
                      value="image"
                      class="mr-2"
                    >
                    <span class="text-sm">Фото пульта</span>
                  </label>
                </div>
              </div>

              <!-- SVG Remote Control (Preferred) -->
              <div v-if="remoteHintType === 'svg'" class="space-y-4">
                <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <EnhancedRemoteControl
                    v-if="selectedDevice"
                    :device="selectedDevice"
                    :highlighted-buttons="formData.highlighted_buttons || []"
                    @button-press="handleRemoteButtonPress"
                    class="transform scale-75 origin-top"
                  />
                  <div v-else class="text-center text-gray-500 py-8">
                    Выберите приставку для отображения пульта
                  </div>
                </div>
                
                <!-- Selected Buttons -->
                <div v-if="formData.highlighted_buttons && formData.highlighted_buttons.length > 0">
                  <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Выбранные кнопки:
                  </h4>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="button in formData.highlighted_buttons"
                      :key="button"
                      class="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100 rounded-full text-sm"
                    >
                      {{ getButtonLabel(button) }}
                      <button
                        type="button"
                        @click="removeHighlightedButton(button)"
                        class="ml-2 text-yellow-600 hover:text-yellow-800"
                      >
                        ×
                      </button>
                    </span>
                  </div>
                </div>
              </div>

              <!-- Image Remote Control (Fallback) -->
              <div v-else class="space-y-4">
                <!-- Remote Image Upload -->
                <div
                  @drop="handleRemoteImageDrop"
                  @dragover.prevent
                  @dragenter.prevent
                  class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-primary-500 transition-colors relative"
                  :class="{ 'border-primary-500 bg-primary-50 dark:bg-primary-900/20': isDraggingRemote }"
                >
                  <div v-if="!remoteImageUrl" class="space-y-4">
                    <div class="text-4xl">🎮</div>
                    <div>
                      <p class="text-gray-600 dark:text-gray-400">
                        Загрузите фото пульта управления
                      </p>
                      <button
                        type="button"
                        @click="$refs.remoteImageInput.click()"
                        class="text-primary-600 hover:text-primary-700 text-sm"
                      >
                        Выбрать файл
                      </button>
                    </div>
                  </div>
                  
                  <!-- Remote Image with Markers -->
                  <div v-else class="relative">
                    <img
                      ref="remoteImage"
                      :src="remoteImageUrl"
                      alt="Remote Control"
                      class="max-w-full h-64 object-contain mx-auto cursor-crosshair"
                      @click="addRemoteMarker"
                    >
                    
                    <!-- Markers -->
                    <div
                      v-for="(marker, index) in remoteMarkers"
                      :key="index"
                      class="absolute w-6 h-6 bg-yellow-400 border-2 border-yellow-600 rounded-full flex items-center justify-center text-xs font-bold text-yellow-900 cursor-pointer hover:bg-yellow-300"
                      :style="{ left: marker.x + 'px', top: marker.y + 'px', transform: 'translate(-50%, -50%)' }"
                      @click.stop="removeRemoteMarker(index)"
                      :title="`Кнопка ${index + 1} - клик для удаления`"
                    >
                      {{ index + 1 }}
                    </div>
                  </div>
                </div>

                <input
                  ref="remoteImageInput"
                  type="file"
                  accept="image/*"
                  @change="handleRemoteImageUpload"
                  class="hidden"
                >

                <!-- Marker Instructions -->
                <div v-if="remoteImageUrl" class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
                  <p class="text-sm text-blue-800 dark:text-blue-200">
                    💡 Кликните на пульте в местах кнопок, которые нужно подсветить. 
                    Кликните н�� маркер для удаления.
                  </p>
                </div>
              </div>

              <!-- Action Buttons with Descriptions -->
              <div class="mt-6">
                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Последовательность действий
                </h4>
                <div class="space-y-3">
                  <div
                    v-for="(action, index) in formData.actions || []"
                    :key="index"
                    class="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <span class="flex-shrink-0 w-6 h-6 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {{ index + 1 }}
                    </span>
                    <input
                      v-model="action.description"
                      type="text"
                      placeholder="Описание действия"
                      class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                    <button
                      type="button"
                      @click="removeAction(index)"
                      class="text-red-600 hover:text-red-700"
                    >
                      🗑️
                    </button>
                  </div>
                  
                  <button
                    type="button"
                    @click="addAction"
                    class="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 hover:border-primary-500 hover:text-primary-500 transition-colors"
                  >
                    + Добавить действие
                  </button>
                </div>
              </div>
            </div>

            <!-- Advanced Features -->
            <div class="card p-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                ⚙️ Дополнительные функции
              </h3>
              
              <div class="space-y-4">
                <!-- User Confirmation -->
                <div>
                  <label class="flex items-center mb-2">
                    <input
                      v-model="hasUserConfirmation"
                      type="checkbox"
                      class="mr-2"
                    >
                    <span class="text-sm font-medium">❓ Запрос подтверждения пользователя</span>
                  </label>
                  
                  <div v-if="hasUserConfirmation" class="ml-6 space-y-3">
                    <input
                      v-model="formData.userConfirmation.question"
                      type="text"
                      placeholder="Вопрос для пользователя"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                    
                    <div class="space-y-2">
                      <div
                        v-for="(option, index) in formData.userConfirmation.options || []"
                        :key="index"
                        class="flex items-center space-x-2"
                      >
                        <input
                          v-model="option.text"
                          type="text"
                          placeholder="Вариант ответа"
                          class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        >
                        <button
                          type="button"
                          @click="removeConfirmationOption(index)"
                          class="text-red-600 hover:text-red-700"
                        >
                          🗑️
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

                <!-- Alternative Path -->
                <div>
                  <label class="flex items-center mb-2">
                    <input
                      v-model="hasAlternative"
                      type="checkbox"
                      class="mr-2"
                    >
                    <span class="text-sm font-medium">🔄 Альтернативный путь</span>
                  </label>
                  
                  <div v-if="hasAlternative" class="ml-6">
                    <input
                      v-model="formData.ifNoResult.nextStepId"
                      type="number"
                      placeholder="ID следующего шага"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                  </div>
                </div>

                <!-- Signal Validation -->
                <div>
                  <label class="flex items-center mb-2">
                    <input
                      v-model="hasValidation"
                      type="checkbox"
                      class="mr-2"
                    >
                    <span class="text-sm font-medium">📶 Проверка сигнала</span>
                  </label>
                  
                  <div v-if="hasValidation" class="ml-6 space-y-2">
                    <label class="flex items-center">
                      <input
                        v-model="formData.validation.signalLevel"
                        type="checkbox"
                        class="mr-2"
                      >
                      <span class="text-sm">Уровень сигнала</span>
                    </label>
                    <label class="flex items-center">
                      <input
                        v-model="formData.validation.signalQuality"
                        type="checkbox"
                        class="mr-2"
                      >
                      <span class="text-sm">Качество сигнала</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Live Preview -->
            <div class="card p-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                👁️ Предпросмотр
              </h3>
              
              <div class="bg-gray-900 rounded-lg p-4 aspect-video flex items-center justify-center text-white text-center">
                <div v-if="formData.screen_image">
                  <img :src="formData.screen_image" alt="Preview" class="max-w-full max-h-full object-contain">
                </div>
                <div v-else class="space-y-2">
                  <div class="text-4xl">📺</div>
                  <p class="text-sm opacity-75">Экран ТВ будет здесь</p>
                </div>
              </div>
              
              <div class="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                <h4 class="font-medium text-blue-900 dark:text-blue-100">{{ formData.title || 'Название шага' }}</h4>
                <p class="text-sm text-blue-700 dark:text-blue-300 mt-1">{{ formData.instruction || 'Инструкция появится здесь' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div class="flex items-center space-x-4">
          <button
            type="button"
            @click="saveAsDraft"
            class="btn-secondary"
          >
            💾 Сохранить как черновик
          </button>
          <button
            type="button"
            @click="previewStep"
            class="btn-secondary"
          >
            👁️ Предпросмотр в диагностике
          </button>
        </div>
        
        <div class="flex items-center space-x-3">
          <button
            type="button"
            @click="$emit('close')"
            class="btn-secondary"
          >
            Отмена
          </button>
          <button
            type="button"
            @click="saveStep"
            class="btn-primary"
            :disabled="!isFormValid"
          >
            {{ step ? 'Обновить шаг' : 'Создать шаг' }}
          </button>
        </div>
      </div>
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
    required: true
  },
  errors: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['close', 'save'])

// Reactive state
const formData = ref({
  device_id: '',
  error_id: '',
  order_index: null,
  title: '',
  instruction: '',
  tip: '',
  screen_image: null,
  audio_url: null,
  highlighted_buttons: [],
  actions: [],
  onlyForOperator: false,
  critical: false,
  userConfirmation: {
    question: '',
    options: []
  },
  ifNoResult: {
    nextStepId: null
  },
  validation: {
    signalLevel: false,
    signalQuality: false
  }
})

const remoteHintType = ref('svg')
const remoteImageUrl = ref(null)
const remoteMarkers = ref([])
const isDraggingTV = ref(false)
const isDraggingRemote = ref(false)
const isRecording = ref(false)
const isPlaying = ref(false)
const hasUserConfirmation = ref(false)
const hasAlternative = ref(false)
const hasValidation = ref(false)

// Computed properties
const selectedDevice = computed(() => {
  return props.devices.find(d => d.id == formData.value.device_id)
})

const filteredErrors = computed(() => {
  if (!formData.value.device_id) return []
  return props.errors.filter(error => error.device_id == formData.value.device_id)
})

const isFormValid = computed(() => {
  return formData.value.device_id && 
         formData.value.error_id && 
         formData.value.title && 
         formData.value.instruction
})

// Initialize form data if editing
if (props.step) {
  Object.assign(formData.value, props.step)
  hasUserConfirmation.value = !!props.step.userConfirmation?.question
  hasAlternative.value = !!props.step.ifNoResult?.nextStepId
  hasValidation.value = !!props.step.validation
}

// Methods
const updateErrorsList = () => {
  formData.value.error_id = ''
}

const handleTVImageDrop = (event) => {
  event.preventDefault()
  isDraggingTV.value = false
  const files = event.dataTransfer.files
  if (files.length > 0) {
    handleTVImageFile(files[0])
  }
}

const handleTVImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    handleTVImageFile(file)
  }
}

const handleTVImageFile = (file) => {
  if (file.size > 5 * 1024 * 1024) {
    alert('Файл слишком большой. Максимум 5MB.')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    formData.value.screen_image = e.target.result
  }
  reader.readAsDataURL(file)
}

const handleRemoteButtonPress = (buttonId) => {
  if (!formData.value.highlighted_buttons) {
    formData.value.highlighted_buttons = []
  }
  
  const index = formData.value.highlighted_buttons.indexOf(buttonId)
  if (index > -1) {
    formData.value.highlighted_buttons.splice(index, 1)
  } else {
    formData.value.highlighted_buttons.push(buttonId)
  }
}

const removeHighlightedButton = (buttonId) => {
  const index = formData.value.highlighted_buttons.indexOf(buttonId)
  if (index > -1) {
    formData.value.highlighted_buttons.splice(index, 1)
  }
}

const getButtonLabel = (buttonId) => {
  const labels = {
    'power': 'POWER',
    'menu': 'MENU',
    'ok': 'OK',
    'up': '↑',
    'down': '↓',
    'left': '←',
    'right': '→',
    'info': 'INFO',
    'exit': 'EXIT',
    'source': 'SOURCE'
  }
  return labels[buttonId] || buttonId.toUpperCase()
}

const handleRemoteImageDrop = (event) => {
  event.preventDefault()
  isDraggingRemote.value = false
  const files = event.dataTransfer.files
  if (files.length > 0) {
    handleRemoteImageFile(files[0])
  }
}

const handleRemoteImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    handleRemoteImageFile(file)
  }
}

const handleRemoteImageFile = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    remoteImageUrl.value = e.target.result
    remoteMarkers.value = []
  }
  reader.readAsDataURL(file)
}

const addRemoteMarker = (event) => {
  const rect = event.target.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  
  remoteMarkers.value.push({ x, y })
}

const removeRemoteMarker = (index) => {
  remoteMarkers.value.splice(index, 1)
}

const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const mediaRecorder = new MediaRecorder(stream)
    const chunks = []
    
    mediaRecorder.ondataavailable = (event) => {
      chunks.push(event.data)
    }
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/mp3' })
      const url = URL.createObjectURL(blob)
      formData.value.audio_url = url
      isRecording.value = false
    }
    
    mediaRecorder.start()
    isRecording.value = true
    
    // Auto-stop after 60 seconds
    setTimeout(() => {
      if (isRecording.value) {
        mediaRecorder.stop()
        stream.getTracks().forEach(track => track.stop())
      }
    }, 60000)
    
  } catch (error) {
    console.error('Recording failed:', error)
    alert('Не удалось начать запись. Проверьте доступ к микрофону.')
  }
}

const handleAudioUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      formData.value.audio_url = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const toggleAudioPlayback = () => {
  const player = this.$refs.audioPlayer
  if (isPlaying.value) {
    player.pause()
  } else {
    player.play()
  }
  isPlaying.value = !isPlaying.value
}

const addAction = () => {
  if (!formData.value.actions) {
    formData.value.actions = []
  }
  formData.value.actions.push({
    description: '',
    buttonId: null
  })
}

const removeAction = (index) => {
  formData.value.actions.splice(index, 1)
}

const addConfirmationOption = () => {
  if (!formData.value.userConfirmation.options) {
    formData.value.userConfirmation.options = []
  }
  formData.value.userConfirmation.options.push({
    text: '',
    action: 'next'
  })
}

const removeConfirmationOption = (index) => {
  formData.value.userConfirmation.options.splice(index, 1)
}

const saveAsDraft = () => {
  const draftData = { ...formData.value, draft: true }
  emit('save', draftData)
}

const previewStep = () => {
  // Open preview modal with current step data
  console.log('Preview step:', formData.value)
}

const saveStep = () => {
  // Clean up conditional data
  if (!hasUserConfirmation.value) {
    delete formData.value.userConfirmation
  }
  if (!hasAlternative.value) {
    delete formData.value.ifNoResult
  }
  if (!hasValidation.value) {
    delete formData.value.validation
  }

  // Add remote hints based on type
  if (remoteHintType.value === 'image' && remoteMarkers.value.length > 0) {
    formData.value.remoteHint = {
      type: 'image',
      imageUrl: remoteImageUrl.value,
      markers: remoteMarkers.value
    }
  }

  emit('save', formData.value)
}

// Watchers
watch(hasUserConfirmation, (newVal) => {
  if (newVal && !formData.value.userConfirmation.options.length) {
    addConfirmationOption()
  }
})

watch(hasValidation, (newVal) => {
  if (!newVal) {
    formData.value.validation = {
      signalLevel: false,
      signalQuality: false
    }
  }
})
</script>

<style scoped>
.cursor-crosshair {
  cursor: crosshair;
}

.transform {
  transform-origin: top left;
}
</style>
