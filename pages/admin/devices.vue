<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Управление приставками</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          Добавляйте, редактируйте и удаляйте типы ТВ-приставок
        </p>
      </div>
      <button
        @click="showCreateModal = true"
        class="btn-primary"
      >
        + Добавить приставку
      </button>
    </div>

    <!-- Devices Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div
        v-for="device in devices"
        :key="device.id"
        class="card p-6 hover:shadow-xl transition-shadow"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
            </svg>
          </div>
          <div class="flex space-x-2">
            <button
              @click="editDevice(device)"
              class="p-2 text-gray-400 hover:text-blue-600 transition-colors"
              title="Редактировать"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
              </svg>
            </button>
            <button
              @click="deleteDevice(device)"
              class="p-2 text-gray-400 hover:text-red-600 transition-colors"
              title="Удалить"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {{ device.name }}
        </h3>
        <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">
          {{ device.description }}
        </p>
        
        <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>{{ device.error_count || 0 }} ошибок</span>
          <NuxtLink
            :to="`/admin/errors?device=${device.id}`"
            class="text-primary-600 hover:text-primary-700 transition-colors"
          >
            Управлять ошибками →
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div
      v-if="showCreateModal || editingDevice"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click="closeModal"
    >
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        
        <div class="inline-block align-bottom bg-white dark:bg-dark-100 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form @submit.prevent="saveDevice" @click.stop>
            <div class="bg-white dark:bg-dark-100 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                {{ editingDevice ? 'Редактировать приставку' : 'Добавить приставку' }}
              </h3>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Название
                  </label>
                  <input
                    v-model="deviceForm.name"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Например: Openbox X1"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Описание
                  </label>
                  <textarea
                    v-model="deviceForm.description"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Краткое описание приставки"
                  ></textarea>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Изображение пульта
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    @change="handleImageUpload"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                  <p class="text-xs text-gray-500 mt-1">
                    Загрузите изображение пульта для этой приставки
                  </p>
                </div>
              </div>
            </div>
            
            <div class="bg-gray-50 dark:bg-gray-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                :disabled="loading"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                {{ loading ? 'Сохранение...' : 'Сохранить' }}
              </button>
              <button
                type="button"
                @click="closeModal"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Load devices data using useLazyFetch for SSR compatibility
const { data: devices, refresh: refreshDevices } = await useLazyFetch('/api/devices')

const showCreateModal = ref(false)
const editingDevice = ref(null)
const loading = ref(false)

const deviceForm = ref({
  name: '',
  description: '',
  remote_image: null
})

const editDevice = (device) => {
  editingDevice.value = device
  deviceForm.value = {
    name: device.name,
    description: device.description,
    remote_image: device.remote_image
  }
}

const closeModal = () => {
  showCreateModal.value = false
  editingDevice.value = null
  deviceForm.value = {
    name: '',
    description: '',
    remote_image: null
  }
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    // In a real app, you would upload the file to a server
    // For now, we'll just store the file name
    deviceForm.value.remote_image = file.name
  }
}

const saveDevice = async () => {
  loading.value = true
  try {
    if (editingDevice.value) {
      // Update existing device
      await $fetch(`/api/admin/device/${editingDevice.value.id}`, {
        method: 'PUT',
        body: deviceForm.value
      })
    } else {
      // Create new device
      await $fetch('/api/admin/device', {
        method: 'POST',
        body: deviceForm.value
      })
    }
    
    await refreshDevices()
    closeModal()
  } catch (error) {
    console.error('Error saving device:', error)
    alert('Ошибка при сохранении приставки')
  }
  loading.value = false
}

const deleteDevice = async (device) => {
  if (!confirm(`Вы уверены, что хотите удалить приставку "${device.name}"?`)) {
    return
  }
  
  try {
    await $fetch(`/api/admin/device/${device.id}`, {
      method: 'DELETE'
    })
    await refreshDevices()
  } catch (error) {
    console.error('Error deleting device:', error)
    alert('Ошибка при удалении приставки')
  }
}

// Meta tags
useHead({
  title: 'Управление приставками - Админ-панель',
})

// Layout
definePageMeta({
  layout: 'admin'
})
</script>
