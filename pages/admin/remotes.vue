<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Управление пультами</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          Создавайте и редактируйте пульты управления с визуальным редактором
        </p>
      </div>
      <button
        @click="showCreateModal = true"
        class="btn-primary"
      >
        + Создать пульт
      </button>
    </div>

    <!-- Remotes Grid -->
    <div v-if="remotes && remotes.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div
        v-for="remote in remotes"
        :key="remote.id"
        class="card p-6 hover:shadow-xl transition-shadow"
      >
        <!-- Remote Preview -->
        <div class="relative mb-4">
          <div v-if="remote.image" class="relative">
            <img 
              :src="remote.image" 
              :alt="remote.name"
              class="w-full h-48 object-contain bg-gray-50 dark:bg-gray-800 rounded-lg border"
            />
            <!-- Button count overlay -->
            <div class="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
              {{ remote.buttons?.length || 0 }} кнопок
            </div>
          </div>
          <div v-else class="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <div class="text-center text-gray-500">
              <svg class="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path>
              </svg>
              <p class="text-sm">Нет изображения</p>
            </div>
          </div>
        </div>

        <!-- Remote Info -->
        <div class="mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {{ remote.name }}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {{ getDeviceName(remote.deviceId) }}
          </p>
          <div class="flex items-center space-x-4 text-xs text-gray-500">
            <span>Версия: {{ remote.version || '1.0' }}</span>
            <span>{{ formatDate(remote.created_at) }}</span>
          </div>
        </div>

        <!-- Remote Stats -->
        <div class="grid grid-cols-2 gap-4 mb-4 text-center">
          <div class="bg-blue-50 dark:bg-blue-900 p-3 rounded">
            <div class="text-lg font-semibold text-blue-600">{{ remote.buttons?.length || 0 }}</div>
            <div class="text-xs text-blue-600">Кнопок</div>
          </div>
          <div class="bg-green-50 dark:bg-green-900 p-3 rounded">
            <div class="text-lg font-semibold text-green-600">{{ getUsageCount(remote.id) }}</div>
            <div class="text-xs text-green-600">Использований</div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex space-x-2">
          <button
            @click="editRemote(remote)"
            class="flex-1 btn-secondary text-sm"
          >
            ✏️ Редакт��ровать
          </button>
          <button
            @click="previewRemote(remote)"
            class="flex-1 btn-secondary text-sm"
          >
            👁️ Просмотр
          </button>
          <button
            @click="deleteRemote(remote)"
            class="px-3 py-2 text-red-600 hover:text-red-800 transition-colors"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <div class="text-6xl mb-4">🎮</div>
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Нет пультов управления
      </h3>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        Создайте первый пульт для управления ТВ-приставками
      </p>
      <button
        @click="showCreateModal = true"
        class="btn-primary"
      >
        Создать первый пульт
      </button>
    </div>

    <!-- Create/Edit Modal -->
    <div
      v-if="showCreateModal || editingRemote"
      class="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50"
    >
      <div class="min-h-screen flex items-start justify-center p-4">
        <div class="bg-white dark:bg-dark-100 rounded-xl shadow-2xl w-full max-w-7xl max-h-screen overflow-y-auto">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ editingRemote ? 'Редактировать пульт' : 'Создать новый пульт' }}
              </h3>
              <button
                @click="closeModal"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
              </button>
            </div>
          </div>

          <div class="p-6">
            <!-- Device Selection -->
            <div v-if="!selectedDevice" class="mb-6">
              <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Выберите уст��ойство для создания пульта:
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                  v-for="device in devices"
                  :key="device.id"
                  @click="selectDevice(device)"
                  class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-primary-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                >
                  <div class="text-center">
                    <div class="text-2xl mb-2">{{ device.icon || '📺' }}</div>
                    <h5 class="font-medium text-gray-900 dark:text-white">{{ device.name }}</h5>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ device.description }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Visual Remote Editor -->
            <VisualRemoteEditor
              v-if="selectedDevice"
              :device="selectedDevice"
              :existing-remote="editingRemote"
              @save="saveRemote"
              @cancel="closeModal"
              @preview="previewRemoteData"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <div
      v-if="previewData"
      class="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4"
    >
      <div class="bg-white dark:bg-dark-100 rounded-xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Предпросмотр: {{ previewData.name }}
            </h3>
            <button
              @click="previewData = null"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
              </svg>
            </button>
          </div>
        </div>

        <div class="p-6">
          <div class="text-center">
            <div class="relative inline-block">
              <img
                :src="previewData.image"
                :alt="previewData.name"
                class="max-w-full h-auto max-h-96 rounded-lg border"
              />
              
              <!-- Interactive buttons -->
              <div
                v-for="button in previewData.buttons"
                :key="button.id"
                class="absolute button-hotspot-preview"
                :style="{
                  left: button.x + '%',
                  top: button.y + '%'
                }"
                @click="handleButtonPress(button)"
              >
                <div class="w-6 h-6 bg-yellow-400 bg-opacity-75 border-2 border-yellow-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-opacity-90 transition-all">
                  <span class="text-xs font-bold text-gray-800">
                    {{ getButtonIcon(button.type) }}
                  </span>
                </div>
              </div>
            </div>
            
            <div class="mt-4 text-sm text-gray-600 dark:text-gray-400">
              <p>{{ previewData.buttons.length }} интерактивных кнопок</p>
              <p class="mt-2">Нажмите на кнопки для тестирования</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Load data
const { data: devices } = await useLazyFetch('/api/devices')
const { data: remotes, refresh: refreshRemotes } = await useLazyFetch('/api/admin/remotes')

// Reactive state
const showCreateModal = ref(false)
const editingRemote = ref(null)
const selectedDevice = ref(null)
const previewData = ref(null)

// Methods
const selectDevice = (device) => {
  selectedDevice.value = device
}

const editRemote = (remote) => {
  editingRemote.value = remote
  selectedDevice.value = devices.value?.find(d => d.id === remote.deviceId)
  showCreateModal.value = true
}

const deleteRemote = async (remote) => {
  if (!confirm(`Удалить пульт "${remote.name}"? Это действие нельзя отменить.`)) {
    return
  }
  
  try {
    await $fetch(`/api/admin/remote/${remote.id}`, {
      method: 'DELETE'
    })
    
    await refreshRemotes()
  } catch (error) {
    console.error('Failed to delete remote:', error)
    alert('Ошибка при удалении пульта')
  }
}

const previewRemote = (remote) => {
  previewData.value = remote
}

const previewRemoteData = (data) => {
  previewData.value = data
}

const saveRemote = async (remoteData) => {
  try {
    if (editingRemote.value) {
      await $fetch(`/api/admin/remote/${editingRemote.value.id}`, {
        method: 'PUT',
        body: remoteData
      })
    } else {
      await $fetch('/api/admin/remote', {
        method: 'POST',
        body: remoteData
      })
    }
    
    await refreshRemotes()
    closeModal()
  } catch (error) {
    console.error('Failed to save remote:', error)
    alert('Ошибка при сохранении пульта')
  }
}

const closeModal = () => {
  showCreateModal.value = false
  editingRemote.value = null
  selectedDevice.value = null
}

const getDeviceName = (deviceId) => {
  const device = devices.value?.find(d => d.id === deviceId)
  return device?.name || 'Неизвестное устройство'
}

const formatDate = (dateString) => {
  if (!dateString) return 'Не указано'
  return new Date(dateString).toLocaleDateString('ru-RU')
}

const getUsageCount = (remoteId) => {
  // Mock usage count - in real app would come from analytics
  // Use remoteId for deterministic value to avoid hydration mismatch
  return (remoteId * 13) % 100
}

const getButtonIcon = (type) => {
  const iconMap = {
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
  return iconMap[type] || type.toString().slice(0, 2).toUpperCase()
}

const handleButtonPress = (button) => {
  console.log('Button pressed:', button)
  // Show feedback or trigger action
}

// Meta tags
useHead({
  title: 'Управление пультами - Админ-панель',
})

// Layout
definePageMeta({
  layout: 'admin'
})
</script>

<style scoped>
.button-hotspot-preview {
  transform: translate(-50%, -50%);
  z-index: 10;
}
</style>
