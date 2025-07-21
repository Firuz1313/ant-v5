<template>
  <div class="p-6">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Админ-панель
        </h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          Управление системой диагностики ТВ-приставок
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Devices Management -->
        <div class="card p-6 hover:shadow-xl transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
              </svg>
            </div>
            <span class="text-2xl font-bold text-blue-600">{{ stats.devices }}</span>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Приставки
          </h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">
            Управление типами ТВ-приставок
          </p>
          <NuxtLink
            to="/admin/devices"
            class="btn-primary w-full text-center block"
          >
            Управлять
          </NuxtLink>
        </div>

        <!-- Errors Management -->
        <div class="card p-6 hover:shadow-xl transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
              <svg class="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <span class="text-2xl font-bold text-red-600">{{ stats.errors }}</span>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Ошибки
          </h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">
            Управление типами ошибок
          </p>
          <NuxtLink
            to="/admin/errors"
            class="btn-primary w-full text-center block"
          >
            Управлять
          </NuxtLink>
        </div>

        <!-- Steps Management -->
        <div class="card p-6 hover:shadow-xl transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <span class="text-2xl font-bold text-green-600">{{ stats.steps }}</span>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Шаги диагностики
          </h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">
            Управление шагами решения
          </p>
          <NuxtLink
            to="/admin/steps"
            class="btn-primary w-full text-center block"
          >
            Управлять
          </NuxtLink>
        </div>

        <!-- Media Management -->
        <div class="card p-6 hover:shadow-xl transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <svg class="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <span class="text-2xl font-bold text-purple-600">{{ stats.media }}</span>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Медиафайлы
          </h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">
            Загрузка изображений и аудио
          </p>
          <NuxtLink
            to="/admin/media"
            class="btn-primary w-full text-center block"
          >
            Управлять
          </NuxtLink>
        </div>

        <!-- Settings -->
        <div class="card p-6 hover:shadow-xl transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <svg class="w-6 h-6 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"></path>
              </svg>
            </div>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Настройки
          </h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">
            Глобальные настройки системы
          </p>
          <NuxtLink
            to="/admin/settings"
            class="btn-primary w-full text-center block"
          >
            Настроить
          </NuxtLink>
        </div>

        <!-- Preview -->
        <div class="card p-6 hover:shadow-xl transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <svg class="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path>
              </svg>
            </div>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Превью системы
          </h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">
            Просмотр диагностики
          </p>
          <NuxtLink
            to="/"
            class="btn-secondary w-full text-center block"
          >
            Открыть
          </NuxtLink>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="mt-12">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Последняя активность
        </h2>
        <div class="card overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              Лог системы
            </h3>
          </div>
          <div class="px-6 py-4">
            <div class="space-y-3">
              <div v-for="activity in recentActivity" :key="activity.id" class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm text-gray-900 dark:text-white">
                    {{ activity.action }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ activity.timestamp }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script setup>
// Mock data - will be replaced with real API calls
const stats = ref({
  devices: 4,
  errors: 12,
  steps: 48,
  media: 156
})

const recentActivity = ref([
  {
    id: 1,
    action: 'Добавлена новая ошибка "Нет звука" для Openbox',
    timestamp: '2 минуты назад'
  },
  {
    id: 2,
    action: 'Обновлены шаги диагностики для HDBOX',
    timestamp: '15 минут назад'
  },
  {
    id: 3,
    action: 'Загружено новое изображение пульта',
    timestamp: '1 час назад'
  },
  {
    id: 4,
    action: 'Создан новый тип приставки UCLAN Pro',
    timestamp: '3 часа назад'
  }
])

// Meta tags
useHead({
  title: 'Админ-панель - TV Diagnostics',
  meta: [
    { name: 'description', content: 'Административная панель системы диагностики ТВ-приставок' }
  ]
})

// Layout
definePageMeta({
  layout: 'admin'
})
</script>
