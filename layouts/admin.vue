<template>
  <div class="min-h-screen bg-gray-50 dark:bg-dark-300">
    <!-- Admin Header -->
    <header class="bg-white dark:bg-dark-100 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-4">
            <NuxtLink to="/admin" class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-sm">A</span>
              </div>
              <span class="font-poppins font-semibold text-xl text-gray-900 dark:text-white">
                Админ-панель
              </span>
            </NuxtLink>
            
            <!-- Breadcrumb -->
            <nav class="hidden md:flex items-center space-x-2 text-sm">
              <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-gray-600 dark:text-gray-400">{{ currentPageTitle }}</span>
            </nav>
          </div>
          
          <div class="flex items-center space-x-4">
            <button
              @click="showNotifications = !showNotifications"
              class="relative p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path>
              </svg>
              <span class="absolute top-0 right-0 block h-2 w-2 bg-red-400 rounded-full"></span>
            </button>
            
            <ThemeToggle />
            
            <NuxtLink 
              to="/" 
              class="text-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              ← На сайт
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <!-- Admin Navigation -->
    <nav class="bg-white dark:bg-dark-100 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex space-x-8 overflow-x-auto">
          <AdminNavItem to="/admin" icon="home" label="Главная" />
          <AdminNavItem to="/admin/devices" icon="device" label="Приставки" />
          <AdminNavItem to="/admin/errors" icon="error" label="Ошибки" />
          <AdminNavItem to="/admin/steps" icon="steps" label="Шаги" />
          <AdminNavItem to="/admin/media" icon="media" label="Медиа" />
          <AdminNavItem to="/admin/settings" icon="settings" label="Настройки" />
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Notifications Panel -->
    <div
      v-if="showNotifications"
      class="fixed inset-0 z-50 overflow-hidden"
      @click="showNotifications = false"
    >
      <div class="absolute inset-0 bg-black bg-opacity-25" />
      <div class="absolute right-0 top-0 h-full w-96 bg-white dark:bg-dark-100 shadow-xl">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Уведомления
          </h3>
          <div class="space-y-3">
            <div v-for="notification in notifications" :key="notification.id" class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p class="text-sm text-gray-900 dark:text-white">{{ notification.message }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ notification.time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()

const showNotifications = ref(false)

const currentPageTitle = computed(() => {
  const pathSegments = route.path.split('/').filter(Boolean)
  const pageMap = {
    'admin': 'Главная',
    'devices': 'Приставки',
    'errors': 'Ошибки', 
    'steps': 'Шаги',
    'media': 'Медиа',
    'settings': 'Настройки'
  }
  return pageMap[pathSegments[pathSegments.length - 1]] || 'Админ-панель'
})

const notifications = ref([
  {
    id: 1,
    message: 'Новая диагностика завершена',
    time: '5 мин назад'
  },
  {
    id: 2,
    message: 'Обновлена ошибка для HDBOX',
    time: '10 мин назад'
  }
])
</script>
