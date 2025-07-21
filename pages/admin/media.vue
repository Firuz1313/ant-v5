<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            🖼️ Управление медиафайлами
          </h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            Загрузка и управление изображениями, видео и аудио для шагов диагностики
          </p>
        </div>
        
        <div class="flex space-x-3">
          <button
            @click="showUploadModal = true"
            class="btn-primary"
          >
            📁 Загрузить файлы
          </button>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <!-- Search -->
      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Поиск файлов
        </label>
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Введите название файла..."
            class="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
          />
          <svg class="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>

      <!-- File Type Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Тип файла
        </label>
        <select
          v-model="selectedType"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="">Все типы</option>
          <option value="image">Изображения</option>
          <option value="video">Видео</option>
          <option value="audio">Аудио</option>
        </select>
      </div>

      <!-- Usage Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Использование
        </label>
        <select
          v-model="selectedUsage"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="">Все</option>
          <option value="used">Используется</option>
          <option value="unused">Не используется</option>
        </select>
      </div>
    </div>

    <!-- Media Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
      <div
        v-for="file in filteredFiles"
        :key="file.id"
        class="group card p-3 hover:shadow-lg transition-all duration-200 cursor-pointer"
        @click="selectFile(file)"
        :class="{ 'ring-2 ring-blue-500': selectedFiles.includes(file.id) }"
      >
        <!-- File Preview -->
        <div class="aspect-square mb-3 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden relative">
          <!-- Image Preview -->
          <img
            v-if="file.type === 'image'"
            :src="file.url"
            :alt="file.name"
            class="w-full h-full object-cover"
          />
          
          <!-- Video Preview -->
          <div v-else-if="file.type === 'video'" class="w-full h-full flex items-center justify-center bg-gray-800">
            <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
            </svg>
          </div>
          
          <!-- Audio Preview -->
          <div v-else-if="file.type === 'audio'" class="w-full h-full flex items-center justify-center bg-purple-100 dark:bg-purple-800">
            <svg class="w-8 h-8 text-purple-600 dark:text-purple-300" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 12c0-1.194-.26-2.327-.729-3.343a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
          </div>
          
          <!-- File size badge -->
          <div class="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
            {{ formatFileSize(file.size) }}
          </div>
          
          <!-- Usage indicator -->
          <div v-if="file.usageCount > 0" class="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
            {{ file.usageCount }} использ.
          </div>
        </div>

        <!-- File Info -->
        <div>
          <h3 class="text-sm font-medium text-gray-900 dark:text-white truncate mb-1">
            {{ file.name }}
          </h3>
          <div class="flex items-center justify-between text-xs text-gray-500">
            <span>{{ file.type.toUpperCase() }}</span>
            <span>{{ formatDate(file.uploadedAt) }}</span>
          </div>
        </div>

        <!-- Action buttons (visible on hover) -->
        <div class="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div class="flex space-x-1">
            <button
              @click.stop="previewFile(file)"
              class="flex-1 text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              👁️ Просмотр
            </button>
            <button
              @click.stop="downloadFile(file)"
              class="flex-1 text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
            >
              💾 Скачать
            </button>
            <button
              @click.stop="deleteFile(file)"
              class="flex-1 text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>

      <!-- Upload placeholder -->
      <div
        @click="showUploadModal = true"
        class="group card p-6 hover:shadow-lg transition-all duration-200 cursor-pointer border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500"
      >
        <div class="aspect-square flex flex-col items-center justify-center text-gray-400 group-hover:text-blue-500">
          <svg class="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
          </svg>
          <span class="text-sm font-medium">Загрузить файлы</span>
        </div>
      </div>
    </div>

    <!-- Selected Files Actions -->
    <div v-if="selectedFiles.length > 0" class="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
      <div class="flex items-center space-x-3">
        <span class="text-sm text-gray-600 dark:text-gray-400">
          Выбрано: {{ selectedFiles.length }}
        </span>
        <button
          @click="downloadSelected"
          class="btn-secondary text-sm"
        >
          💾 Скачать
        </button>
        <button
          @click="deleteSelected"
          class="btn-secondary text-sm text-red-600"
        >
          🗑️ Удалить
        </button>
        <button
          @click="clearSelection"
          class="btn-secondary text-sm"
        >
          ❌ Отменить
        </button>
      </div>
    </div>

    <!-- Upload Modal -->
    <div v-if="showUploadModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              📁 Загрузка файлов
            </h2>
            <button
              @click="showUploadModal = false"
              class="text-gray-400 hover:text-gray-600"
            >
              ❌
            </button>
          </div>

          <!-- Upload Area -->
          <div
            @drop="handleDrop"
            @dragover.prevent
            @dragenter.prevent
            class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center mb-4 hover:border-blue-500 transition-colors"
          >
            <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <p class="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
              Перетащите файлы сюда или
            </p>
            <button
              @click="$refs.fileInput.click()"
              class="btn-primary"
            >
              Выберите файлы
            </button>
            <p class="text-sm text-gray-500 mt-2">
              Поддерживаются: JPG, PNG, GIF, MP4, AVI, MP3, WAV (макс. 10MB)
            </p>
          </div>

          <input
            ref="fileInput"
            type="file"
            multiple
            accept="image/*,video/*,audio/*"
            @change="handleFileSelect"
            class="hidden"
          />

          <!-- Upload Progress -->
          <div v-if="uploadProgress.length > 0" class="space-y-3 mb-4">
            <h3 class="font-medium text-gray-900 dark:text-white">Загрузка файлов:</h3>
            <div
              v-for="(progress, index) in uploadProgress"
              :key="index"
              class="bg-gray-100 dark:bg-gray-700 rounded-lg p-3"
            >
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ progress.name }}</span>
                <span class="text-sm text-gray-500">{{ progress.percent }}%</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div
                  class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${progress.percent}%` }"
                ></div>
              </div>
            </div>
          </div>

          <!-- Modal Actions -->
          <div class="flex justify-end space-x-3">
            <button
              @click="showUploadModal = false"
              class="btn-secondary"
            >
              Отмена
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <div v-if="previewFile" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ previewingFile?.name }}
            </h2>
            <button
              @click="previewingFile = null"
              class="text-gray-400 hover:text-gray-600"
            >
              ❌
            </button>
          </div>
        </div>
        
        <div class="p-4">
          <!-- Image Preview -->
          <img
            v-if="previewingFile?.type === 'image'"
            :src="previewingFile.url"
            :alt="previewingFile.name"
            class="max-w-full max-h-[60vh] mx-auto"
          />
          
          <!-- Video Preview -->
          <video
            v-else-if="previewingFile?.type === 'video'"
            :src="previewingFile.url"
            controls
            class="max-w-full max-h-[60vh] mx-auto"
          />
          
          <!-- Audio Preview -->
          <div v-else-if="previewingFile?.type === 'audio'" class="text-center py-8">
            <svg class="w-24 h-24 text-purple-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clip-rule="evenodd"></path>
            </svg>
            <audio :src="previewingFile.url" controls class="mx-auto"></audio>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Set layout
definePageMeta({
  layout: 'admin'
})

// State
const searchQuery = ref('')
const selectedType = ref('')
const selectedUsage = ref('')
const selectedFiles = ref([])
const showUploadModal = ref(false)
const uploadProgress = ref([])
const previewingFile = ref(null)

// Mock media files data
const mediaFiles = ref([
  {
    id: 1,
    name: 'openbox_menu_screen.jpg',
    type: 'image',
    size: 245760,
    url: '/images/tv/openbox_menu.jpg',
    uploadedAt: '2024-01-15',
    usageCount: 3
  },
  {
    id: 2,
    name: 'remote_control_demo.mp4',
    type: 'video',
    size: 5242880,
    url: '/videos/remote_demo.mp4',
    uploadedAt: '2024-01-14',
    usageCount: 1
  },
  {
    id: 3,
    name: 'step_notification.mp3',
    type: 'audio',
    size: 524288,
    url: '/audio/notification.mp3',
    uploadedAt: '2024-01-13',
    usageCount: 5
  },
  {
    id: 4,
    name: 'signal_check_screen.png',
    type: 'image',
    size: 389120,
    url: '/images/tv/signal_check.png',
    uploadedAt: '2024-01-12',
    usageCount: 0
  },
  {
    id: 5,
    name: 'card_access_guide.jpg',
    type: 'image',
    size: 512000,
    url: '/images/tv/card_access.jpg',
    uploadedAt: '2024-01-11',
    usageCount: 2
  },
  {
    id: 6,
    name: 'antenna_setup.mp4',
    type: 'video',
    size: 8388608,
    url: '/videos/antenna_setup.mp4',
    uploadedAt: '2024-01-10',
    usageCount: 0
  }
])

// Computed
const filteredFiles = computed(() => {
  let filtered = mediaFiles.value

  // Search filter
  if (searchQuery.value) {
    filtered = filtered.filter(file => 
      file.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // Type filter
  if (selectedType.value) {
    filtered = filtered.filter(file => file.type === selectedType.value)
  }

  // Usage filter
  if (selectedUsage.value) {
    if (selectedUsage.value === 'used') {
      filtered = filtered.filter(file => file.usageCount > 0)
    } else if (selectedUsage.value === 'unused') {
      filtered = filtered.filter(file => file.usageCount === 0)
    }
  }

  return filtered
})

// Methods
const selectFile = (file) => {
  const index = selectedFiles.value.indexOf(file.id)
  if (index === -1) {
    selectedFiles.value.push(file.id)
  } else {
    selectedFiles.value.splice(index, 1)
  }
}

const clearSelection = () => {
  selectedFiles.value = []
}

const previewFile = (file) => {
  previewingFile.value = file
}

const downloadFile = (file) => {
  // Create download link
  const link = document.createElement('a')
  link.href = file.url
  link.download = file.name
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const deleteFile = (file) => {
  if (confirm(`Вы уверены, что хотите удалить файл "${file.name}"?`)) {
    const index = mediaFiles.value.findIndex(f => f.id === file.id)
    if (index !== -1) {
      mediaFiles.value.splice(index, 1)
    }
  }
}

const downloadSelected = () => {
  selectedFiles.value.forEach(fileId => {
    const file = mediaFiles.value.find(f => f.id === fileId)
    if (file) {
      downloadFile(file)
    }
  })
  clearSelection()
}

const deleteSelected = () => {
  if (confirm(`Вы уверены, что хотите удалить ${selectedFiles.value.length} файл(ов)?`)) {
    selectedFiles.value.forEach(fileId => {
      const index = mediaFiles.value.findIndex(f => f.id === fileId)
      if (index !== -1) {
        mediaFiles.value.splice(index, 1)
      }
    })
    clearSelection()
  }
}

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  uploadFiles(files)
}

const handleDrop = (event) => {
  event.preventDefault()
  const files = Array.from(event.dataTransfer.files)
  uploadFiles(files)
}

const uploadFiles = (files) => {
  files.forEach((file, index) => {
    // Validate file type and size
    const validTypes = ['image/', 'video/', 'audio/']
    const isValidType = validTypes.some(type => file.type.startsWith(type))
    
    if (!isValidType) {
      alert(`Файл "${file.name}" имеет неподдерживаемый тип`)
      return
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB
      alert(`Файл "${file.name}" превышает максимальный размер 10MB`)
      return
    }

    // Add to upload progress
    const progressItem = {
      name: file.name,
      percent: 0
    }
    uploadProgress.value.push(progressItem)

    // Simulate upload progress
    const interval = setInterval(() => {
      progressItem.percent += Math.random() * 20
      if (progressItem.percent >= 100) {
        progressItem.percent = 100
        clearInterval(interval)
        
        // Add to media files after upload complete
        setTimeout(() => {
          const newFile = {
            id: Date.now() + index,
            name: file.name,
            type: file.type.split('/')[0],
            size: file.size,
            url: URL.createObjectURL(file),
            uploadedAt: new Date().toISOString().split('T')[0],
            usageCount: 0
          }
          mediaFiles.value.unshift(newFile)
          
          // Remove from progress
          const progressIndex = uploadProgress.value.indexOf(progressItem)
          if (progressIndex !== -1) {
            uploadProgress.value.splice(progressIndex, 1)
          }
        }, 500)
      }
    }, 100)
  })
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ru-RU')
}

// Meta tags
useHead({
  title: 'Медиафайлы - Админ панель',
  meta: [
    { name: 'description', content: 'Управление медиафайлами для диагностики ТВ-приставок' }
  ]
})
</script>
