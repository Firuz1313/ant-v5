<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-dark-300 dark:to-dark-200">
    <div class="container mx-auto px-4 py-12">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl lg:text-6xl font-poppins font-bold text-gray-900 dark:text-white mb-4">
          Выберите ТВ-приставку
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Выберите модель вашей ТВ-приставки д��я начала диагностики
        </p>
        <NuxtLink 
          to="/" 
          class="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 mt-4"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd"></path>
          </svg>
          <span>Назад на главную</span>
        </NuxtLink>
      </div>

      <!-- Device Grid -->
      <div class="max-w-6xl mx-auto">
        <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="i in 6" :key="i" class="card animate-pulse">
            <div class="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-lg"></div>
            <div class="p-6">
              <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          </div>
        </div>

        <div v-else-if="error" class="text-center py-12">
          <div class="text-red-500 mb-4">
            <svg class="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Ошибка загрузки устройств
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">{{ error.message }}</p>
          <button @click="refresh()" class="btn-primary">
            Попробовать снова
          </button>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <NuxtLink
            v-for="device in devices"
            :key="device.id"
            :to="`/devices/${device.id}/errors`"
            class="group card overflow-hidden hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <!-- Device Image -->
            <div class="h-48 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 flex items-center justify-center">
              <div v-if="device.image" class="w-full h-full">
                <img 
                  :src="device.image" 
                  :alt="device.name"
                  class="w-full h-full object-cover"
                >
              </div>
              <div v-else class="text-6xl text-primary-600 dark:text-primary-300">
                <span v-if="device.icon">{{ device.icon }}</span>
                <svg v-else class="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                </svg>
              </div>
            </div>

            <!-- Device Info -->
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {{ device.name }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400 mb-4">
                {{ device.description }}
              </p>
              
              <!-- Device Stats -->
              <div class="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                <span>{{ device.errorCount || 0 }} ошибок</span>
                <span class="text-primary-600 dark:text-primary-400 font-medium group-hover:underline">
                  Диагностика →
                </span>
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- Popular Devices Section -->
        <div v-if="devices && devices.length > 0" class="mt-16">
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-8 text-center">
            Популярные модели
          </h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div 
              v-for="popular in popularDevices" 
              :key="popular.id"
              class="text-center p-4 bg-white dark:bg-dark-100 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div class="text-2xl mb-2">{{ popular.icon || '📺' }}</div>
              <h4 class="font-medium text-gray-900 dark:text-white text-sm">{{ popular.name }}</h4>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ popular.usage }}% пользователей</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Fetch devices from API
const { data: devices, pending, error, refresh } = await useLazyFetch('/api/devices')

// Calculate popular devices (mock data for now)
const popularDevices = computed(() => {
  if (!devices.value) return []
  
  return devices.value.map(device => ({
    ...device,
    usage: Math.floor(Math.random() * 30) + 10 // Mock usage percentage
  })).sort((a, b) => b.usage - a.usage).slice(0, 4)
})

// Meta tags
useHead({
  title: 'Выбор ТВ-приставки - Диагностика',
  meta: [
    { name: 'description', content: 'Выберите модель вашей ТВ-приставки для начала диагностики неисправностей' }
  ]
})
</script>
