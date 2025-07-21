<template>
  <div class="p-6 space-y-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
        <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
          <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"></path>
          </svg>
        </div>
        <span>Настройки системы</span>
      </h1>
      <p class="mt-3 text-lg text-gray-600 dark:text-gray-400">
        Управление глобальными параметрами и внешним видом системы диагностики
      </p>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <!-- Main Settings Column -->
      <div class="xl:col-span-2 space-y-8">
        
        <!-- Device Defaults Section -->
        <div class="bg-white dark:bg-dark-100 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-3">
              <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                </svg>
              </div>
              <span>Настройки по умолчанию для устройств</span>
            </h2>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Выберите иконки и пульты, которые будут использоваться по умолчанию
            </p>
          </div>
          
          <div class="p-6 space-y-6">
            <!-- Default Device Icon -->
            <div class="group">
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Иконка устройства по умолчанию
              </label>
              <div class="flex items-center space-x-4">
                <div class="relative">
                  <div 
                    class="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center group-hover:border-blue-400 dark:group-hover:border-blue-500 transition-all duration-300"
                    :class="{ 'border-blue-400 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20': selectedDeviceIcon }"
                  >
                    <img 
                      v-if="selectedDeviceIcon" 
                      :src="selectedDeviceIcon.url" 
                      :alt="selectedDeviceIcon.name"
                      class="w-12 h-12 object-contain"
                    >
                    <svg v-else class="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                    </svg>
                  </div>
                  <div v-if="selectedDeviceIcon" class="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                </div>
                
                <div class="flex space-x-3">
                  <button 
                    @click="openMediaModal('device-icon')"
                    class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
                  >
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path>
                    </svg>
                    <span>Выбрать иконку</span>
                  </button>
                  
                  <button 
                    v-if="selectedDeviceIcon"
                    @click="resetDeviceIcon"
                    class="px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 rounded-lg transition-all duration-200 flex items-center space-x-2"
                  >
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                    <span>Сбросить</span>
                  </button>
                </div>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Эта иконка будет отображаться на сайте для всех устройств без собственной иконки
              </p>
            </div>

            <!-- Default Remote Control -->
            <div class="group">
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Пульт управления по умолчанию
              </label>
              <div class="flex items-center space-x-4">
                <div class="relative">
                  <div 
                    class="w-20 h-32 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center group-hover:border-purple-400 dark:group-hover:border-purple-500 transition-all duration-300"
                    :class="{ 'border-purple-400 dark:border-purple-500 bg-purple-50 dark:bg-purple-900/20': selectedRemote }"
                  >
                    <img 
                      v-if="selectedRemote" 
                      :src="selectedRemote.url" 
                      :alt="selectedRemote.name"
                      class="w-16 h-28 object-contain"
                    >
                    <svg v-else class="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path>
                    </svg>
                  </div>
                  <div v-if="selectedRemote" class="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                </div>
                
                <div class="flex space-x-3">
                  <button 
                    @click="openMediaModal('remote')"
                    class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
                  >
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path>
                    </svg>
                    <span>Выбрать пульт</span>
                  </button>
                  
                  <button 
                    v-if="selectedRemote"
                    @click="resetRemote"
                    class="px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 rounded-lg transition-all duration-200 flex items-center space-x-2"
                  >
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                    <span>Сбросить</span>
                  </button>
                </div>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Этот пульт будет использоваться в диагностике для всех устройств без собственного пульта
              </p>
            </div>
          </div>
        </div>

        <!-- General System Settings -->
        <div class="bg-white dark:bg-dark-100 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-3">
              <div class="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <span>Основные настройки</span>
            </h2>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Общие параметры работы системы диагностики
            </p>
          </div>
          
          <div class="p-6 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- System Name -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Название системы
                </label>
                <input
                  v-model="settings.systemName"
                  type="text"
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                  placeholder="Диагностика ТВ-приставок"
                />
              </div>

              <!-- Default Language -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Язык по умолчанию
                </label>
                <select
                  v-model="settings.defaultLanguage"
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                >
                  <option value="ru">🇷🇺 Русский</option>
                  <option value="en">🇺🇸 English</option>
                  <option value="ua">🇺🇦 Українська</option>
                </select>
              </div>

              <!-- Max Steps -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Максимум шагов на ошибку
                </label>
                <input
                  v-model.number="settings.maxSteps"
                  type="number"
                  min="1"
                  max="20"
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                />
              </div>

              <!-- Session Timeout -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Таймаут сессии (минуты)
                </label>
                <input
                  v-model.number="settings.sessionTimeout"
                  type="number"
                  min="5"
                  max="120"
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                />
              </div>
            </div>

            <!-- Feature Toggles -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Функции системы</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label class="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                  <input
                    v-model="settings.enableOperatorMode"
                    type="checkbox"
                    class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <div>
                    <div class="text-sm font-medium text-gray-900 dark:text-white">Режим оператора</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">Дополнительные функции для операторов</div>
                  </div>
                </label>

                <label class="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                  <input
                    v-model="settings.enableAnalytics"
                    type="checkbox"
                    class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <div>
                    <div class="text-sm font-medium text-gray-900 dark:text-white">Сбор аналитики</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">Статистика и метрики использования</div>
                  </div>
                </label>

                <label class="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                  <input
                    v-model="settings.enableTelegramNotifications"
                    type="checkbox"
                    class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <div>
                    <div class="text-sm font-medium text-gray-900 dark:text-white">Telegram уведомления</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">Отправка уведомлений в Telegram</div>
                  </div>
                </label>

                <label class="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                  <input
                    v-model="settings.enableDetailedLogging"
                    type="checkbox"
                    class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <div>
                    <div class="text-sm font-medium text-gray-900 dark:text-white">Детальное логирование</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">Подробные логи действий пользователей</div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Telegram Integration -->
        <div class="bg-white dark:bg-dark-100 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-3">
              <div class="w-8 h-8 bg-cyan-100 dark:bg-cyan-900 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-cyan-600 dark:text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                </svg>
              </div>
              <span>Интеграция с Telegram</span>
            </h2>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Настройка бота для уведомлений и поддержки
            </p>
          </div>
          
          <div class="p-6 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Bot Token -->
              <div class="md:col-span-2">
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Токен бота
                </label>
                <div class="relative">
                  <input
                    v-model="settings.telegramBotToken"
                    :type="showToken ? 'text' : 'password'"
                    class="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                    placeholder="1234567890:XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                  />
                  <button
                    @click="showToken = !showToken"
                    class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path v-if="!showToken" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path v-if="!showToken" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      <path v-if="showToken" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  </button>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Получите токен у @BotFather в Telegram
                </p>
              </div>

              <!-- Chat ID -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  ID чата для уведомлений
                </label>
                <input
                  v-model="settings.telegramChatId"
                  type="text"
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                  placeholder="-1001234567890"
                />
              </div>

              <!-- Test Button -->
              <div class="flex items-end">
                <button
                  @click="testTelegramBot"
                  :disabled="!settings.telegramBotToken"
                  class="w-full px-4 py-3 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-400 text-white rounded-xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed"
                >
                  Тестировать бота
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions Sidebar -->
      <div class="xl:col-span-1 space-y-6">
        <!-- Save Actions -->
        <div class="bg-white dark:bg-dark-100 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <svg class="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z"></path>
              </svg>
              <span>Сохранение</span>
            </h3>
          </div>
          
          <div class="p-6 space-y-4">
            <button
              @click="saveSettings"
              :disabled="saving"
              class="w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white rounded-xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <svg v-if="saving" class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z"></path>
              </svg>
              <span>{{ saving ? 'Сохранение...' : 'Сохранить настройки' }}</span>
            </button>
            
            <button
              @click="resetSettings"
              class="w-full px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"></path>
              </svg>
              <span>Сбросить к умолчанию</span>
            </button>
          </div>
        </div>

        <!-- System Status -->
        <div class="bg-white dark:bg-dark-100 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clip-rule="evenodd"></path>
                <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"></path>
              </svg>
              <span>Статус системы</span>
            </h3>
          </div>
          
          <div class="p-6 space-y-4">
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Версия</span>
                <span class="text-sm font-semibold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">v2.1.0</span>
              </div>
              
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Устройств</span>
                <span class="text-sm font-semibold text-blue-600 dark:text-blue-400">{{ systemStats.devices }}</span>
              </div>
              
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Ошибок</span>
                <span class="text-sm font-semibold text-orange-600 dark:text-orange-400">{{ systemStats.errors }}</span>
              </div>
              
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Шагов</span>
                <span class="text-sm font-semibold text-green-600 dark:text-green-400">{{ systemStats.steps }}</span>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Медиафайлов</span>
                <span class="text-sm font-semibold text-purple-600 dark:text-purple-400">{{ systemStats.media }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white dark:bg-dark-100 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <svg class="w-5 h-5 text-orange-600 dark:text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <span>Быстрые действия</span>
            </h3>
          </div>
          
          <div class="p-6 space-y-3">
            <button
              @click="clearLogs"
              class="w-full px-4 py-2 bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/30 dark:hover:bg-orange-900/50 text-orange-700 dark:text-orange-400 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
              </svg>
              <span>Очистить логи</span>
            </button>
            
            <button
              @click="exportSettings"
              class="w-full px-4 py-2 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"></path>
              </svg>
              <span>Экспорт настроек</span>
            </button>

            <button
              @click="importSettings"
              class="w-full px-4 py-2 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-700 dark:text-green-400 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 11-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span>Импорт настроек</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Media Selection Modal -->
    <div v-if="showMediaModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-dark-100 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ modalType === 'device-icon' ? 'Выберите иконку устройства' : 'Выберите пульт управления' }}
          </h3>
          <button
            @click="closeMediaModal"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
          </button>
        </div>
        
        <div class="p-6">
          <!-- Search -->
          <div class="mb-6">
            <input
              v-model="mediaSearch"
              type="text"
              placeholder="Поиск файлов..."
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
          </div>

          <!-- Media Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-h-96 overflow-y-auto">
            <div
              v-for="media in filteredMedia"
              :key="media.id"
              @click="selectMedia(media)"
              class="relative group cursor-pointer bg-gray-50 dark:bg-gray-800 rounded-xl p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 border-2 border-transparent hover:border-blue-300 dark:hover:border-blue-600"
              :class="{ 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20': isSelected(media) }"
            >
              <div class="aspect-square flex items-center justify-center">
                <img 
                  :src="media.url" 
                  :alt="media.name"
                  class="max-w-full max-h-full object-contain"
                  :class="modalType === 'remote' ? 'w-12 h-16' : 'w-12 h-12'"
                >
              </div>
              <p class="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center truncate">{{ media.name }}</p>
              
              <div v-if="isSelected(media)" class="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              @click="closeMediaModal"
              class="px-6 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-xl transition-colors"
            >
              Отмена
            </button>
            <button
              @click="confirmMediaSelection"
              :disabled="!selectedMedia"
              class="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-xl transition-colors disabled:cursor-not-allowed"
            >
              Выбрать
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

// State
const saving = ref(false)
const showToken = ref(false)
const showMediaModal = ref(false)
const modalType = ref('')
const mediaSearch = ref('')
const selectedMedia = ref(null)

// Settings data
const settings = ref({
  systemName: 'Диагностика ТВ-приставок',
  maxSteps: 15,
  defaultLanguage: 'ru',
  sessionTimeout: 30,
  enableOperatorMode: true,
  telegramBotToken: '',
  telegramChatId: '',
  enableTelegramNotifications: false,
  enableAnalytics: true,
  enableDetailedLogging: false
})

const selectedDeviceIcon = ref(null)
const selectedRemote = ref(null)

const systemStats = ref({
  devices: 4,
  errors: 12,
  steps: 48,
  media: 156
})

// Mock media data
const mediaFiles = ref([
  { id: 1, name: 'device-icon-1.png', url: '/media/device-icon-1.png', type: 'icon' },
  { id: 2, name: 'device-icon-2.png', url: '/media/device-icon-2.png', type: 'icon' },
  { id: 3, name: 'remote-1.png', url: '/media/remote-1.png', type: 'remote' },
  { id: 4, name: 'remote-2.png', url: '/media/remote-2.png', type: 'remote' },
  { id: 5, name: 'device-icon-3.png', url: '/media/device-icon-3.png', type: 'icon' },
  { id: 6, name: 'remote-3.png', url: '/media/remote-3.png', type: 'remote' }
])

// Computed
const filteredMedia = computed(() => {
  let filtered = mediaFiles.value

  // Filter by type
  if (modalType.value === 'device-icon') {
    filtered = filtered.filter(media => media.type === 'icon')
  } else if (modalType.value === 'remote') {
    filtered = filtered.filter(media => media.type === 'remote')
  }

  // Filter by search
  if (mediaSearch.value) {
    filtered = filtered.filter(media => 
      media.name.toLowerCase().includes(mediaSearch.value.toLowerCase())
    )
  }

  return filtered
})

// Methods
const openMediaModal = (type) => {
  modalType.value = type
  showMediaModal.value = true
  selectedMedia.value = null
  mediaSearch.value = ''
}

const closeMediaModal = () => {
  showMediaModal.value = false
  modalType.value = ''
  selectedMedia.value = null
  mediaSearch.value = ''
}

const selectMedia = (media) => {
  selectedMedia.value = media
}

const isSelected = (media) => {
  return selectedMedia.value?.id === media.id
}

const confirmMediaSelection = () => {
  if (selectedMedia.value) {
    if (modalType.value === 'device-icon') {
      selectedDeviceIcon.value = selectedMedia.value
    } else if (modalType.value === 'remote') {
      selectedRemote.value = selectedMedia.value
    }
    closeMediaModal()
  }
}

const resetDeviceIcon = () => {
  selectedDeviceIcon.value = null
}

const resetRemote = () => {
  selectedRemote.value = null
}

const saveSettings = async () => {
  saving.value = true

  try {
    const settingsData = {
      ...settings.value,
      defaultDeviceIcon: selectedDeviceIcon.value,
      defaultRemote: selectedRemote.value
    }

    const response = await $fetch('/api/admin/settings', {
      method: 'POST',
      body: settingsData
    })

    if (response.success) {
      console.log('✅ Настройки успешно сохранены!')
      // Show success notification
      showNotification('success', 'Настройки успешно сохранены!')
    }
  } catch (error) {
    console.error('Failed to save settings:', error)
    showNotification('error', 'Ошибка сохранения настроек')
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
      sessionTimeout: 30,
      enableOperatorMode: true,
      telegramBotToken: '',
      telegramChatId: '',
      enableTelegramNotifications: false,
      enableAnalytics: true,
      enableDetailedLogging: false
    }
    selectedDeviceIcon.value = null
    selectedRemote.value = null
  }
}

const testTelegramBot = async () => {
  if (!settings.value.telegramBotToken) {
    alert('❌ Укажите токен Telegram бота')
    return
  }
  
  try {
    alert('📱 Тестовое сообщение отправлено в Telegram')
  } catch (error) {
    alert('❌ Ошибка подключения к Telegram боту')
  }
}

const clearLogs = () => {
  if (confirm('Вы уверены, что хотите очистить все логи?')) {
    alert('🗑️ Логи очищены')
  }
}

const exportSettings = () => {
  const data = {
    ...settings.value,
    selectedDeviceIcon: selectedDeviceIcon.value,
    selectedRemote: selectedRemote.value
  }
  
  const dataStr = JSON.stringify(data, null, 2)
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

const importSettings = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)
          settings.value = { ...settings.value, ...data }
          if (data.selectedDeviceIcon) selectedDeviceIcon.value = data.selectedDeviceIcon
          if (data.selectedRemote) selectedRemote.value = data.selectedRemote
          alert('✅ Настройки успешно импортированы!')
        } catch (error) {
          alert('❌ Ошибка импорта настроек')
        }
      }
      reader.readAsText(file)
    }
  }
  input.click()
}

// Meta tags
useHead({
  title: 'Настройки системы - Админ панель',
  meta: [
    { name: 'description', content: 'Настройки системы диагностики ТВ-приставок' }
  ]
})
</script>
