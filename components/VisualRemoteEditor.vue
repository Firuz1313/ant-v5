<template>
  <div class="visual-remote-editor">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Remote Image and Button Mapping -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          🎮 Визуальный редактор пульта
        </h3>
        
        <!-- Image Upload -->
        <div v-if="!remoteData.image" class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
          <input
            ref="imageInput"
            type="file"
            accept="image/*"
            @change="handleImageUpload"
            class="hidden"
          />
          <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path>
          </svg>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Загрузите изображение пульта управления
          </p>
          <button
            @click="$refs.imageInput.click()"
            class="btn-primary"
          >
            Выбрать файл
          </button>
        </div>
        
        <!-- Remote Image with Button Hotspots -->
        <div v-else class="relative">
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Нажмите на кнопки для добавления точек
            </h4>
            <div class="flex space-x-2">
              <button
                @click="clearAllButtons"
                class="text-sm text-red-600 hover:text-red-800"
              >
                Очистить всё
              </button>
              <button
                @click="changeImage"
                class="text-sm text-blue-600 hover:text-blue-800"
              >
                Сменить изображение
              </button>
            </div>
          </div>
          
          <div 
            class="remote-image-container relative inline-block border rounded-lg overflow-hidden"
            @click="addButtonHotspot"
          >
            <img
              ref="remoteImage"
              :src="remoteData.image"
              alt="Remote control"
              class="max-w-full h-auto"
              style="max-height: 600px;"
            />
            
            <!-- Button Hotspots -->
            <div
              v-for="button in remoteData.buttons"
              :key="button.id"
              class="absolute button-hotspot"
              :style="{
                left: button.x + '%',
                top: button.y + '%'
              }"
              @click.stop="editButton(button)"
            >
              <div 
                class="w-8 h-8 bg-yellow-400 bg-opacity-75 border-2 border-yellow-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-opacity-90 transition-all"
                :class="{
                  'ring-4 ring-blue-400': selectedButton?.id === button.id
                }"
              >
                <span class="text-xs font-bold text-gray-800">
                  {{ getButtonLabel(button.type) }}
                </span>
              </div>
              
              <!-- Button label -->
              <div class="absolute top-10 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                {{ button.label }}
              </div>
            </div>
          </div>
          
          <!-- Image Info -->
          <div class="mt-4 text-sm text-gray-600 dark:text-gray-400">
            <p>Размер: {{ imageWidth }} × {{ imageHeight }} px</p>
            <p>Кнопок: {{ remoteData.buttons.length }}</p>
          </div>
        </div>
      </div>
      
      <!-- Button Configuration Panel -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          ⚙️ Настройка кнопок
        </h3>
        
        <!-- Button List -->
        <div v-if="remoteData.buttons.length === 0" class="text-center py-8 text-gray-500">
          <div class="text-4xl mb-2">🎯</div>
          <p>Нажмите на изображение пульта,<br>чтобы добавить кнопки</p>
        </div>
        
        <div v-else class="space-y-4">
          <div
            v-for="button in remoteData.buttons"
            :key="button.id"
            class="p-4 border rounded-lg transition-all"
            :class="{
              'border-blue-500 bg-blue-50 dark:bg-blue-900': selectedButton?.id === button.id,
              'border-gray-200 dark:border-gray-700': selectedButton?.id !== button.id
            }"
            @click="selectButton(button)"
          >
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center space-x-2">
                <span class="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold">
                  {{ getButtonLabel(button.type) }}
                </span>
                <span class="font-medium text-gray-900 dark:text-white">
                  {{ button.label }}
                </span>
              </div>
              <button
                @click.stop="removeButton(button)"
                class="text-red-600 hover:text-red-800"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
              </button>
            </div>
            
            <!-- Button Configuration Form -->
            <div v-if="selectedButton?.id === button.id" class="space-y-3">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Тип кнопки
                  </label>
                  <select
                    v-model="selectedButton.type"
                    @change="updateButton"
                    class="w-full text-sm px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option v-for="type in buttonTypes" :key="type.id" :value="type.id">
                      {{ type.label }}
                    </option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Размер
                  </label>
                  <select
                    v-model="selectedButton.size"
                    @change="updateButton"
                    class="w-full text-sm px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="small">Маленькая</option>
                    <option value="medium">Средняя</option>
                    <option value="large">Большая</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Название
                </label>
                <input
                  v-model="selectedButton.label"
                  @input="updateButton"
                  type="text"
                  class="w-full text-sm px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Описание (для шагов)
                </label>
                <input
                  v-model="selectedButton.description"
                  @input="updateButton"
                  type="text"
                  placeholder="Например: Нажмите для входа в меню"
                  class="w-full text-sm px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    X позиция (%)
                  </label>
                  <input
                    v-model.number="selectedButton.x"
                    @input="updateButton"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    class="w-full text-sm px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Y позиция (%)
                  </label>
                  <input
                    v-model.number="selectedButton.y"
                    @input="updateButton"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    class="w-full text-sm px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Quick Add Buttons -->
        <div class="mt-6">
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Быстрое добавление:
          </h4>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="type in commonButtonTypes"
              :key="type.id"
              @click="addCommonButton(type)"
              class="text-xs p-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {{ type.label }}
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Save/Export Actions -->
    <div class="mt-6 flex justify-between items-center">
      <div class="flex space-x-2">
        <button
          @click="exportRemoteData"
          class="btn-secondary text-sm"
        >
          📄 Экспорт данных
        </button>
        <button
          @click="previewRemote"
          class="btn-secondary text-sm"
        >
          👁️ Предпросмотр
        </button>
      </div>
      
      <div class="flex space-x-2">
        <button
          @click="$emit('cancel')"
          class="btn-secondary"
        >
          Отмена
        </button>
        <button
          @click="saveRemote"
          :disabled="!remoteData.image || remoteData.buttons.length === 0"
          class="btn-primary"
        >
          Сохранить пульт
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  device: {
    type: Object,
    required: true
  },
  existingRemote: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['save', 'cancel'])

// Reactive state
const selectedButton = ref(null)
const imageWidth = ref(0)
const imageHeight = ref(0)

const remoteData = ref({
  image: null,
  buttons: [],
  deviceId: props.device.id,
  name: `Пульт ${props.device.name}`,
  version: '1.0'
})

// Button types configuration
const buttonTypes = [
  { id: 'power', label: '⏻ Power', icon: '⏻' },
  { id: 'menu', label: '☰ Menu', icon: '☰' },
  { id: 'ok', label: '✓ OK', icon: '✓' },
  { id: 'up', label: '↑ Up', icon: '↑' },
  { id: 'down', label: '↓ Down', icon: '↓' },
  { id: 'left', label: '← Left', icon: '←' },
  { id: 'right', label: '→ Right', icon: '→' },
  { id: 'back', label: '← Back', icon: '←' },
  { id: 'exit', label: '✕ Exit', icon: '✕' },
  { id: 'info', label: 'ℹ Info', icon: 'ℹ' },
  { id: 'source', label: '📺 Source', icon: 'SRC' },
  { id: 'vol-up', label: '🔊 Vol+', icon: '+' },
  { id: 'vol-down', label: '🔉 Vol-', icon: '-' },
  { id: 'ch-up', label: '📺 Ch+', icon: '+' },
  { id: 'ch-down', label: '📺 Ch-', icon: '-' },
  ...Array.from({ length: 10 }, (_, i) => ({ 
    id: `num-${i}`, 
    label: `${i}`, 
    icon: i.toString() 
  }))
]

const commonButtonTypes = computed(() => 
  buttonTypes.filter(type => 
    ['power', 'menu', 'ok', 'up', 'down', 'left', 'right', 'info', 'exit'].includes(type.id)
  )
)

// Initialize with existing remote data
onMounted(() => {
  if (props.existingRemote) {
    Object.assign(remoteData.value, props.existingRemote)
  }
})

// Methods
const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      remoteData.value.image = e.target.result
      
      // Get image dimensions
      const img = new Image()
      img.onload = () => {
        imageWidth.value = img.width
        imageHeight.value = img.height
      }
      img.src = e.target.result
      
      // Clear existing buttons when new image is loaded
      remoteData.value.buttons = []
      selectedButton.value = null
    }
    reader.readAsDataURL(file)
  }
}

const changeImage = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = handleImageUpload
  input.click()
}

const addButtonHotspot = (event) => {
  const rect = event.currentTarget.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width) * 100
  const y = ((event.clientY - rect.top) / rect.height) * 100
  
  const newButton = {
    id: Date.now(),
    type: 'ok',
    label: 'Новая кн��пка',
    description: '',
    x: Math.round(x * 10) / 10,
    y: Math.round(y * 10) / 10,
    size: 'medium'
  }
  
  remoteData.value.buttons.push(newButton)
  selectedButton.value = newButton
}

const addCommonButton = (buttonType) => {
  const newButton = {
    id: Date.now(),
    type: buttonType.id,
    label: buttonType.label,
    description: `Нажмите ${buttonType.label}`,
    x: 50,
    y: 50,
    size: 'medium'
  }
  
  remoteData.value.buttons.push(newButton)
  selectedButton.value = newButton
}

const selectButton = (button) => {
  selectedButton.value = button
}

const editButton = (button) => {
  selectedButton.value = button
}

const updateButton = () => {
  // Reactive update is automatic
  emit('change', remoteData.value)
}

const removeButton = (button) => {
  const index = remoteData.value.buttons.findIndex(b => b.id === button.id)
  if (index !== -1) {
    remoteData.value.buttons.splice(index, 1)
    if (selectedButton.value?.id === button.id) {
      selectedButton.value = null
    }
  }
}

const clearAllButtons = () => {
  if (confirm('Удалить все кнопки? Это действие нельзя отменить.')) {
    remoteData.value.buttons = []
    selectedButton.value = null
  }
}

const getButtonLabel = (type) => {
  const buttonType = buttonTypes.find(bt => bt.id === type)
  return buttonType?.icon || '?'
}

const exportRemoteData = () => {
  const data = JSON.stringify(remoteData.value, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `remote_${props.device.name.toLowerCase().replace(/\s+/g, '_')}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const previewRemote = () => {
  // Emit preview event or open preview modal
  emit('preview', remoteData.value)
}

const saveRemote = () => {
  if (!remoteData.value.image) {
    alert('Пожалуйста, загрузите изображение пульта')
    return
  }
  
  if (remoteData.value.buttons.length === 0) {
    alert('Пожалуйста, добавьте хотя бы одну кнопку')
    return
  }
  
  emit('save', remoteData.value)
}
</script>

<style scoped>
.button-hotspot {
  transform: translate(-50%, -50%);
  z-index: 10;
}

.remote-image-container {
  cursor: crosshair;
}

.remote-image-container img {
  display: block;
  max-width: 100%;
  height: auto;
}

/* Visual feedback for button placement */
.remote-image-container:hover {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}
</style>
