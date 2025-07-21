<template>
  <div class="min-h-screen bg-gray-50 dark:bg-dark-300 flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-white dark:bg-dark-100 shadow-lg border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <!-- Sidebar Header -->
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <NuxtLink to="/admin" class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
            <span class="text-white font-bold text-lg">A</span>
          </div>
          <div>
            <h2 class="font-poppins font-bold text-lg text-gray-900 dark:text-white">
              Админ-панель
            </h2>
            <p class="text-xs text-gray-500 dark:text-gray-400">Управление системой</p>
          </div>
        </NuxtLink>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 py-6 space-y-1">
        <!-- Main Section -->
        <div class="space-y-1">
          <p class="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Основные
          </p>
          <AdminNavItem to="/admin" icon="home" label="Главная" sidebar />
          <AdminNavItem to="/admin/devices" icon="device" label="Приставки" sidebar />
          <AdminNavItem to="/admin/remotes" icon="remote" label="Пульты" sidebar />
          <AdminNavItem to="/admin/errors" icon="error" label="Ошибки" sidebar />
          <AdminNavItem to="/admin/steps" icon="steps" label="Шаги" sidebar />
          <AdminNavItem to="/admin/media" icon="media" label="Медиа" sidebar />
        </div>

        <!-- Analytics Section -->
        <div class="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700 space-y-1">
          <p class="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Аналитика
          </p>
          <AdminNavItem to="/admin/analytics" icon="analytics" label="Аналитика" sidebar />
          <AdminNavItem to="/admin/reports" icon="reports" label="Отчеты" sidebar />
        </div>

        <!-- Settings Section -->
        <div class="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700 space-y-1">
          <p class="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Настройки
          </p>
          <AdminNavItem to="/admin/settings" icon="settings" label="Настройки" sidebar />
        </div>
      </nav>

      <!-- Sidebar Footer -->
      <div class="p-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center space-x-3 mb-3">
          <div class="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
            <span class="text-primary-600 dark:text-primary-400 font-semibold text-sm">A</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 dark:text-white truncate">Администратор</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 truncate">admin@example.com</p>
          </div>
        </div>
        <NuxtLink
          to="/"
          class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd"></path>
          </svg>
          <span>На сайт</span>
        </NuxtLink>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col">
      <!-- Top Header -->
      <header class="bg-white dark:bg-dark-100 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div class="px-6 py-4">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">{{ currentPageTitle }}</h1>
              <nav class="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span>Админ-панель</span>
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                </svg>
                <span class="text-gray-900 dark:text-white">{{ currentPageTitle }}</span>
              </nav>
            </div>

            <div class="flex items-center space-x-4">
              <!-- Search -->
              <div class="hidden md:block relative">
                <input
                  type="text"
                  placeholder="Поиск..."
                  class="w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-dark-200 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path>
                </svg>
              </div>

              <!-- Notifications -->
              <button
                @click="showNotifications = !showNotifications"
                class="relative p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path>
                </svg>
                <span class="absolute -top-1 -right-1 block h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
              </button>

              <!-- Theme Toggle -->
              <ThemeToggle />

              <!-- User Menu -->
              <div class="relative">
                <button class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <div class="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                    <span class="text-primary-600 dark:text-primary-400 font-semibold text-sm">A</span>
                  </div>
                  <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto">
        <slot />
      </main>
    </div>

    <!-- Notifications Panel -->
    <div
      v-if="showNotifications"
      class="fixed inset-0 z-50 overflow-hidden"
      @click="showNotifications = false"
    >
      <div class="absolute inset-0 bg-black bg-opacity-25" />
      <div class="absolute right-0 top-0 h-full w-96 bg-white dark:bg-dark-100 shadow-xl">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Уведомления
            </h3>
            <button
              @click="showNotifications = false"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
              </svg>
            </button>
          </div>
          <div class="space-y-3">
            <div v-for="notification in notifications" :key="notification.id" class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div class="flex items-start space-x-3">
                <div class="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <div class="flex-1">
                  <p class="text-sm text-gray-900 dark:text-white">{{ notification.message }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ notification.time }}</p>
                </div>
              </div>
            </div>
            <div class="text-center pt-4">
              <button class="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                Посмотреть все уведомления
              </button>
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
