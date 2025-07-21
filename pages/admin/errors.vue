<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Управление ошибками</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          Настройте типы ошибок для каждой приставки
        </p>
      </div>
      <button
        @click="showCreateModal = true"
        class="btn-primary"
      >
        + Добавить ошибку
      </button>
    </div>

    <!-- Device Filter -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Фильтр по приставке
      </label>
      <select
        v-model="selectedDeviceId"
        class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
      >
        <option value="">Все приставки</option>
        <option v-for="device in devices" :key="device.id" :value="device.id">
          {{ device.name }}
        </option>
      </select>
    </div>

    <!-- Errors List -->
    <div class="card overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">
          Список ошибок
        </h3>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Приставка
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Ошибка
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Описание
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Шаги
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-dark-100 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="error in filteredErrors" :key="error.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {{ getDeviceName(error.device_id) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ error.title }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                {{ error.description }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                {{ error.step_count || 0 }} шагов
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <NuxtLink
                    :to="`/admin/steps?error=${error.id}`"
                    class="text-primary-600 hover:text-primary-900 transition-colors"
                  >
                    Шаги
                  </NuxtLink>
                  <button
                    @click="editError(error)"
                    class="text-blue-600 hover:text-blue-900 transition-colors"
                  >
                    Изменить
                  </button>
                  <button
                    @click="deleteError(error)"
                    class="text-red-600 hover:text-red-900 transition-colors"
                  >
                    Удалить
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div
      v-if="showCreateModal || editingError"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click="closeModal"
    >
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        
        <div class="inline-block align-bottom bg-white dark:bg-dark-100 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form @submit.prevent="saveError" @click.stop>
            <div class="bg-white dark:bg-dark-100 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                {{ editingError ? 'Редактировать ошибку' : 'Добавить ошибку' }}
              </h3>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Приставка
                  </label>
                  <select
                    v-model="errorForm.device_id"
                    required
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Выберит�� приставку</option>
                    <option v-for="device in devices" :key="device.id" :value="device.id">
                      {{ device.name }}
                    </option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Название ошибки
                  </label>
                  <input
                    v-model="errorForm.title"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Например: Нет сигнала"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Описание
                  </label>
                  <textarea
                    v-model="errorForm.description"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Подробное описание проблемы"
                  ></textarea>
                </div>
              </div>
            </div>
            
            <div class="bg-gray-50 dark:bg-gray-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                :disabled="loading"
                class="btn-primary"
              >
                {{ loading ? 'Сохранение...' : 'Сохранить' }}
              </button>
              <button
                type="button"
                @click="closeModal"
                class="btn-secondary mr-3"
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
// Load devices and errors
const { data: devices } = await $fetch('/api/devices')
const allErrors = ref([])

const selectedDeviceId = ref('')
const showCreateModal = ref(false)
const editingError = ref(null)
const loading = ref(false)

const errorForm = ref({
  device_id: '',
  title: '',
  description: ''
})

// Load all errors for all devices
onMounted(async () => {
  const errorPromises = devices.map(device => 
    $fetch(`/api/errors/${device.id}`).then(errors => 
      errors.map(error => ({ ...error, device_id: device.id }))
    )
  )
  
  const errorArrays = await Promise.all(errorPromises)
  allErrors.value = errorArrays.flat()
})

const filteredErrors = computed(() => {
  if (!selectedDeviceId.value) return allErrors.value
  return allErrors.value.filter(error => error.device_id == selectedDeviceId.value)
})

const getDeviceName = (deviceId) => {
  const device = devices.find(d => d.id === deviceId)
  return device ? device.name : 'Неизвестно'
}

const editError = (error) => {
  editingError.value = error
  errorForm.value = {
    device_id: error.device_id,
    title: error.title,
    description: error.description
  }
}

const closeModal = () => {
  showCreateModal.value = false
  editingError.value = null
  errorForm.value = {
    device_id: '',
    title: '',
    description: ''
  }
}

const saveError = async () => {
  loading.value = true
  try {
    if (editingError.value) {
      // Update existing error
      console.log('Updating error:', errorForm.value)
    } else {
      // Create new error
      console.log('Creating error:', errorForm.value)
    }
    
    closeModal()
    // Refresh errors list
  } catch (error) {
    console.error('Error saving error:', error)
    alert('Ошибка при сохранении')
  }
  loading.value = false
}

const deleteError = async (error) => {
  if (!confirm(`Вы уверены, что хотите удалить ошибку "${error.title}"?`)) {
    return
  }
  
  try {
    console.log('Deleting error:', error.id)
    // Remove from local list
    const index = allErrors.value.findIndex(e => e.id === error.id)
    if (index > -1) {
      allErrors.value.splice(index, 1)
    }
  } catch (error) {
    console.error('Error deleting error:', error)
    alert('Ошибка при удалении')
  }
}

// Meta tags
useHead({
  title: 'Управление ошибками - Админ-панель',
})

// Layout
definePageMeta({
  layout: 'admin'
})
</script>
