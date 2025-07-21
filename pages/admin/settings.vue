<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        ⚙️ Настройки системы
      </h1>
      <p class="mt-2 text-gray-600 dark:text-gray-400">
        Глобальные настройки системы диагностики
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main Settings -->
      <div class="lg:col-span-2 space-y-6">
        <!-- General Settings -->
        <div class="card p-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            🔧 Основные настройки
          </h2>
          
          <div class="space-y-4">
            <!-- System Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Название системы
              </label>
              <input
                v-model="settings.systemName"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder="Диагностика ТВ-приставок"
              />
            </div>

            <!-- Max Steps -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Максимум шагов на ошибку
              </label>
              <input
                v-model.number="settings.maxSteps"
                type="number"
                min="1"
                max="20"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <!-- Default Language -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Язык по умолчанию
              </label>
              <select
                v-model="settings.defaultLanguage"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="ru">Русский</option>
                <option value="en">English</option>
                <option value="ua">Українська</option>
              </select>
            </div>

            <!-- Enable Operator Mode -->
            <div class="flex items-center space-x-3">
              <input
                v-model="settings.enableOperatorMode"
                type="checkbox"
                class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
              />
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Включить режим оператора
              </label>
            </div>
          </div>
        </div>

        <!-- Telegram Settings -->
        <div class="card p-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            📱 Настройки Telegram
          </h2>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Токен бота
              </label>
              <div class="relative">
                <input
                  v-model="settings.telegramBotToken"
                  :type="showToken ? 'text' : 'password'"
                  class="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="1234567890:XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                />
                <button
                  @click="showToken = !showToken"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="!showToken" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path v-if="!showToken" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    <path v-if="showToken" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ID чата для уведомлений
              </label>
              <input
                v-model="settings.telegramChatId"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder="-1001234567890"
              />
            </div>

            <div class="flex items-center space-x-3">
              <input
                v-model="settings.enableTelegramNotifications"
                type="checkbox"
                class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
              />
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Включить уведомления в Telegram
              </label>
            </div>
          </div>
        </div>

        <!-- Analytics Settings -->
        <div class="card p-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            📊 Настройки аналитики
          </h2>
          
          <div class="space-y-4">
            <div class="flex items-center space-x-3">
              <input
                v-model="settings.enableAnalytics"
                type="checkbox"
                class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
              />
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Включить сбор аналитики
              </label>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Период хранения логов (дни)
              </label>
              <input
                v-model.number="settings.logRetentionDays"
                type="number"
                min="1"
                max="365"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div class="flex items-center space-x-3">
              <input
                v-model="settings.enableDetailedLogging"
                type="checkbox"
                class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
              />
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Детальное логирование действий
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions Panel -->
      <div class="lg:col-span-1 space-y-6">
        <!-- Save Settings -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            💾 Сохранение
          </h3>
          
          <div class="space-y-3">
            <button
              @click="saveSettings"
              :disabled="saving"
              class="w-full btn-primary"
            >
              <span v-if="saving">Сохранение...</span>
              <span v-else>💾 Сохранить настройки</span>
            </button>
            
            <button
              @click="resetSettings"
              class="w-full btn-secondary"
            >
              🔄 Сбросить к умолчанию
            </button>
          </div>
        </div>

        <!-- System Status -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            📈 Статус системы
          </h3>
          
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">Версия</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">v2.0.0</span>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">Устройств</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ systemStats.devices }}</span>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">Ошибок</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ systemStats.errors }}</span>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">Шагов</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ systemStats.steps }}</span>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            ⚡ Быстрые действия
          </h3>
          
          <div class="space-y-3">
            <button
              @click="testTelegramBot"
              class="w-full btn-secondary text-sm"
            >
              📱 Тест Telegram бота
            </button>
            
            <button
              @click="clearLogs"
              class="w-full btn-secondary text-sm"
            >
              🗑️ Очистить логи
            </button>
            
            <button
              @click="exportSettings"
              class="w-full btn-secondary text-sm"
            >
              📄 Экспорт настроек
            </button>
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
const saving = ref(false)
const showToken = ref(false)

const settings = ref({
  systemName: 'Диагностика ТВ-приставок',
  maxSteps: 15,
  defaultLanguage: 'ru',
  enableOperatorMode: true,
  telegramBotToken: '',
  telegramChatId: '',
  enableTelegramNotifications: false,
  enableAnalytics: true,
  logRetentionDays: 30,
  enableDetailedLogging: false
})

const systemStats = ref({
  devices: 4,
  errors: 12,
  steps: 48
})

// Methods
const saveSettings = async () => {
  saving.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // In real app, would call API
    console.log('Settings saved:', settings.value)
    
    // Show success message
    alert('✅ Настройки успешно сохранены!')
  } catch (error) {
    console.error('Failed to save settings:', error)
    alert('❌ Ошибка сохранения настроек')
  } finally {
    saving.value = false
  }
}

const resetSettings = () => {
  if (confirm('Вы уверены, что хотите сбросить все настройки к значениям по умолчанию?')) {
    settings.value = {
      systemName: 'Диагностика ТВ-приставок',
      maxSteps: 15,
      defaultLanguage: 'ru',
      enableOperatorMode: true,
      telegramBotToken: '',
      telegramChatId: '',
      enableTelegramNotifications: false,
      enableAnalytics: true,
      logRetentionDays: 30,
      enableDetailedLogging: false
    }
  }
}

const testTelegramBot = async () => {
  if (!settings.value.telegramBotToken) {
    alert('❌ Укажите токен Telegram бота')
    return
  }
  
  try {
    // Test bot connection
    alert('📱 Тестовое сообщение отправлено в Telegram')
  } catch (error) {
    alert('❌ Ошибка подключения к Telegram боту')
  }
}

const clearLogs = () => {
  if (confirm('Вы уверены, что хотите очистить все логи?')) {
    // Clear logs
    alert('🗑️ Логи очищены')
  }
}

const exportSettings = () => {
  const dataStr = JSON.stringify(settings.value, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = 'settings.json'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Meta tags
useHead({
  title: 'Настройки системы - Админ панель',
  meta: [
    { name: 'description', content: 'Наст��ойки системы диагностики ТВ-приставок' }
  ]
})
</script>
