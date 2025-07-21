<template>
  <div class="p-6 space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
          <div class="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <span>Медиа-менеджер</span>
        </h1>
        <p class="mt-3 text-lg text-gray-600 dark:text-gray-400">
          Управление изображениями, иконками и пультами для системы диагностики
        </p>
      </div>
      
      <div class="flex space-x-3">
        <button
          @click="selectMode = !selectMode"
          class="px-4 py-2 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 rounded-xl transition-all duration-200 flex items-center space-x-2"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path>
          </svg>
          <span>{{ selectMode ? 'Отмена' : 'Выбрать' }}</span>
        </button>
        
        <button
          @click="showUploadModal = true"
          class="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm5 6V7a1 1 0 112 0v2h2a1 1 0 110 2h-2v2a1 1 0 11-2 0v-2H7a1 1 0 110-2h2z" clip-rule="evenodd"></path>
          </svg>
          <span>Загрузить файлы</span>
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white dark:bg-dark-100 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.total }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">Всего файлов</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-dark-100 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
            </svg>
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.icons }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">Иконки устройств</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-dark-100 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path>
            </svg>
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.remotes }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">Пульты управления</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-dark-100 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-orange-600 dark:text-orange-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.steps }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">Изображения шагов</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="bg-white dark:bg-dark-100 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <!-- Search -->
        <div class="md:col-span-2">
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Поиск файлов
          </label>
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Введите название файла..."
              class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
            />
            <svg class="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>

        <!-- Type Filter -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Тип файла
          </label>
          <select
            v-model="selectedType"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
          >
            <option value="">Все типы</option>
            <option value="icon">Иконки устройств</option>
            <option value="remote">Пульты</option>
            <option value="step">Изображения шагов</option>
            <option value="other">Прочие</option>
          </select>
        </div>

        <!-- Usage Filter -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Использование
          </label>
          <select
            v-model="selectedUsage"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
          >
            <option value="">Все файлы</option>
            <option value="used">Используемые</option>
            <option value="unused">Неиспользуемые</option>
          </select>
        </div>

        <!-- Sort -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Сортировка
          </label>
          <select
            v-model="sortBy"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
          >
            <option value="name">По имени</option>
            <option value="date">По дате</option>
            <option value="size">По размеру</option>
            <option value="type">По типу</option>
          </select>
        </div>
      </div>

      <!-- Bulk Actions -->
      <div v-if="selectMode && selectedFiles.length > 0" class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Выбрано файлов: {{ selectedFiles.length }}
          </p>
          <div class="flex space-x-3">
            <button
              @click="bulkSetAsIcon"
              class="px-4 py-2 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-700 dark:text-green-400 rounded-lg transition-colors text-sm"
            >
              Назначить как иконку
            </button>
            <button
              @click="bulkSetAsRemote"
              class="px-4 py-2 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-400 rounded-lg transition-colors text-sm"
            >
              Назначить как пульт
            </button>
            <button
              @click="bulkDelete"
              class="px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 rounded-lg transition-colors text-sm"
            >
              Удалить выбранные
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Media Grid -->
    <div class="bg-white dark:bg-dark-100 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
      <div class="p-6">
        <div v-if="isLoading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          <div v-for="i in 16" :key="i" class="aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
        </div>

        <div v-else-if="filteredMedia.length === 0" class="text-center py-12">
          <div class="text-gray-400 mb-4">
            <svg class="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Файлы не найдены
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            {{ searchQuery ? 'Попробуйте изменить поисковый запрос' : 'Загрузите первые файлы для начала работы' }}
          </p>
          <button
            @click="showUploadModal = true"
            class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
          >
            Загрузить файлы
          </button>
        </div>

        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          <div
            v-for="media in filteredMedia"
            :key="media.id"
            class="group relative bg-gray-50 dark:bg-gray-800 rounded-xl p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 cursor-pointer border-2 border-transparent"
            :class="{
              'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20': selectMode && selectedFiles.includes(media.id),
              'hover:border-gray-300 dark:hover:border-gray-600': !selectMode || !selectedFiles.includes(media.id)
            }"
            @click="selectMode ? toggleSelect(media.id) : showMediaDetails(media)"
          >
            <!-- Selection Checkbox -->
            <div v-if="selectMode" class="absolute top-2 left-2 z-10">
              <div
                class="w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 flex items-center justify-center transition-all duration-200"
                :class="{ 'bg-blue-500 border-blue-500': selectedFiles.includes(media.id) }"
              >
                <svg v-if="selectedFiles.includes(media.id)" class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
              </div>
            </div>

            <!-- Media Preview -->
            <div class="aspect-square flex items-center justify-center mb-3 rounded-lg overflow-hidden bg-white dark:bg-gray-900">
              <img 
                :src="media.url" 
                :alt="media.name"
                class="max-w-full max-h-full object-contain"
                @error="handleImageError"
              >
            </div>

            <!-- Media Info -->
            <div class="space-y-1">
              <h4 class="text-xs font-medium text-gray-900 dark:text-white truncate">{{ media.name }}</h4>
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-500 dark:text-gray-400 capitalize">{{ media.type }}</span>
                <span class="text-xs text-gray-500 dark:text-gray-400">{{ formatFileSize(media.size) }}</span>
              </div>
              
              <!-- Usage Badge -->
              <div v-if="media.usedIn && media.usedIn.length > 0" class="flex flex-wrap gap-1">
                <span 
                  v-for="usage in media.usedIn.slice(0, 2)" 
                  :key="usage"
                  class="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full"
                >
                  {{ usage }}
                </span>
                <span 
                  v-if="media.usedIn.length > 2"
                  class="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full"
                >
                  +{{ media.usedIn.length - 2 }}
                </span>
              </div>
              <div v-else class="text-xs text-gray-400 dark:text-gray-500">
                Не используется
              </div>
            </div>

            <!-- Actions -->
            <div v-if="!selectMode" class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div class="flex space-x-2">
                <button
                  @click.stop="setAsIcon(media)"
                  class="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors tooltip"
                  :title="'Назначить как иконку'"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                  </svg>
                </button>
                
                <button
                  @click.stop="setAsRemote(media)"
                  class="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  :title="'Назначить как пульт'"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path>
                  </svg>
                </button>
                
                <button
                  @click.stop="deleteMedia(media)"
                  class="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  :title="'Удалить файл'"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload Modal -->
    <div v-if="showUploadModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-dark-100 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Загрузка файлов</h3>
          <button
            @click="closeUploadModal"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
          </button>
        </div>
        
        <div class="p-6">
          <!-- Drag & Drop Area -->
          <div
            @drop="handleDrop"
            @dragover.prevent
            @dragenter.prevent
            class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center transition-colors"
            :class="{ 'border-blue-400 bg-blue-50 dark:bg-blue-900/20': isDragging }"
          >
            <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Перетащите файлы сюда
            </h4>
            <p class="text-gray-600 dark:text-gray-400 mb-4">
              или нажмите для выбора файлов
            </p>
            <input
              ref="fileInput"
              type="file"
              multiple
              accept="image/*,video/*,audio/*"
              @change="handleFileSelect"
              class="hidden"
            >
            <button
              @click="$refs.fileInput.click()"
              class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
            >
              Выбрать файлы
            </button>
          </div>

          <!-- Upload Type Selection -->
          <div class="mt-6">
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Тип загружаемых файлов
            </label>
            <select
              v-model="uploadType"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="icon">Иконки устройств</option>
              <option value="remote">Пульты управления</option>
              <option value="step">И��ображения шагов</option>
              <option value="other">Прочие файлы</option>
            </select>
          </div>

          <!-- Upload Progress -->
          <div v-if="uploadProgress.length > 0" class="mt-6 space-y-3">
            <h4 class="font-semibold text-gray-900 dark:text-white">Прогресс загрузки</h4>
            <div v-for="progress in uploadProgress" :key="progress.id" class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ progress.name }}</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ progress.percent }}%</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  class="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  :style="`width: ${progress.percent}%`"
                ></div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              @click="closeUploadModal"
              class="px-6 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-xl transition-colors"
            >
              Закрыть
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
const isLoading = ref(false)
const selectMode = ref(false)
const selectedFiles = ref([])
const showUploadModal = ref(false)
const isDragging = ref(false)
const uploadType = ref('icon')
const uploadProgress = ref([])

// Filters
const searchQuery = ref('')
const selectedType = ref('')
const selectedUsage = ref('')
const sortBy = ref('name')

// Stats
const stats = ref({
  total: 0,
  icons: 0,
  remotes: 0,
  steps: 0
})

// Load media files from API
const loadMediaFiles = async () => {
  isLoading.value = true
  try {
    const response = await $fetch('/api/admin/media')
    if (response.success) {
      mediaFiles.value = response.files
      stats.value = response.stats
    }
  } catch (error) {
    console.error('Failed to load media files:', error)
  } finally {
    isLoading.value = false
  }
}

// Load media on mount
onMounted(() => {
  loadMediaFiles()
})

// Mock media data (fallback)
const mediaFiles = ref([
  {
    id: 1,
    name: 'openbox-icon.png',
    url: '/images/openbox-icon.png',
    type: 'icon',
    size: 45120,
    usedIn: ['Openbox GOLD', 'Openbox'],
    uploadDate: '2024-01-15'
  },
  {
    id: 2,
    name: 'hdbox-remote.png',
    url: '/images/hdbox-remote.png',
    type: 'remote',
    size: 128340,
    usedIn: ['HDBOX'],
    uploadDate: '2024-01-14'
  },
  {
    id: 3,
    name: 'step-check-signal.jpg',
    url: '/images/step-signal.jpg',
    type: 'step',
    size: 89600,
    usedIn: ['Шаг 1: Проверка сигнала'],
    uploadDate: '2024-01-13'
  },
  {
    id: 4,
    name: 'uclan-icon.svg',
    url: '/images/uclan-icon.svg',
    type: 'icon',
    size: 12800,
    usedIn: [],
    uploadDate: '2024-01-12'
  },
  {
    id: 5,
    name: 'universal-remote.png',
    url: '/images/universal-remote.png',
    type: 'remote',
    size: 156780,
    usedIn: ['Универсальный пульт'],
    uploadDate: '2024-01-11'
  },
  // Add more mock data...
])

// Computed
const filteredMedia = computed(() => {
  let filtered = [...mediaFiles.value]

  // Filter by search
  if (searchQuery.value) {
    filtered = filtered.filter(media => 
      media.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // Filter by type
  if (selectedType.value) {
    filtered = filtered.filter(media => media.type === selectedType.value)
  }

  // Filter by usage
  if (selectedUsage.value === 'used') {
    filtered = filtered.filter(media => media.usedIn && media.usedIn.length > 0)
  } else if (selectedUsage.value === 'unused') {
    filtered = filtered.filter(media => !media.usedIn || media.usedIn.length === 0)
  }

  // Sort
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'date':
        return new Date(b.uploadDate) - new Date(a.uploadDate)
      case 'size':
        return b.size - a.size
      case 'type':
        return a.type.localeCompare(b.type)
      default:
        return 0
    }
  })

  return filtered
})

// Methods
const toggleSelect = (id) => {
  const index = selectedFiles.value.indexOf(id)
  if (index > -1) {
    selectedFiles.value.splice(index, 1)
  } else {
    selectedFiles.value.push(id)
  }
}

const showMediaDetails = (media) => {
  console.log('Showing details for:', media.name)
  // Implementation for showing media details modal
}

const setAsIcon = (media) => {
  console.log('Setting as icon:', media.name)
  // Implementation for setting as device icon
}

const setAsRemote = (media) => {
  console.log('Setting as remote:', media.name)
  // Implementation for setting as remote control
}

const deleteMedia = (media) => {
  if (confirm(`Вы уверены, что хотите удалить файл "${media.name}"?`)) {
    const index = mediaFiles.value.findIndex(m => m.id === media.id)
    if (index > -1) {
      mediaFiles.value.splice(index, 1)
    }
  }
}

const bulkSetAsIcon = () => {
  console.log('Setting as icon for files:', selectedFiles.value)
  selectedFiles.value = []
  selectMode.value = false
}

const bulkSetAsRemote = () => {
  console.log('Setting as remote for files:', selectedFiles.value)
  selectedFiles.value = []
  selectMode.value = false
}

const bulkDelete = () => {
  if (confirm(`Вы уверены, что хотите удалить выбранные файлы (${selectedFiles.value.length})?`)) {
    mediaFiles.value = mediaFiles.value.filter(media => !selectedFiles.value.includes(media.id))
    selectedFiles.value = []
    selectMode.value = false
  }
}

const closeUploadModal = () => {
  showUploadModal.value = false
  uploadProgress.value = []
}

const handleDrop = (e) => {
  e.preventDefault()
  isDragging.value = false
  const files = Array.from(e.dataTransfer.files)
  uploadFiles(files)
}

const handleFileSelect = (e) => {
  const files = Array.from(e.target.files)
  uploadFiles(files)
}

const uploadFiles = async (files) => {
  for (const file of files) {
    const progressId = Date.now() + Math.random()
    uploadProgress.value.push({
      id: progressId,
      name: file.name,
      percent: 0
    })

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await $fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData,
        onUploadProgress: (progress) => {
          const progressItem = uploadProgress.value.find(p => p.id === progressId)
          if (progressItem) {
            progressItem.percent = Math.round((progress.loaded / progress.total) * 100)
          }
        }
      })

      if (response.success) {
        // Update progress to 100%
        const progress = uploadProgress.value.find(p => p.id === progressId)
        if (progress) {
        progress.percent += Math.random() * 30
        if (progress.percent >= 100) {
          progress.percent = 100
          clearInterval(interval)
          
          // Add to media files
          setTimeout(() => {
            mediaFiles.value.unshift({
              id: Date.now() + Math.random(),
              name: file.name,
              url: URL.createObjectURL(file),
              type: uploadType.value,
              size: file.size,
              usedIn: [],
              uploadDate: new Date().toISOString().split('T')[0]
            })
            
            // Remove from progress
            uploadProgress.value = uploadProgress.value.filter(p => p.id !== progressId)
          }, 500)
        }
      }
    }, 200)
  })
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const handleImageError = (e) => {
  e.target.src = '/images/placeholder.png'
}

// Drag events
onMounted(() => {
  window.addEventListener('dragenter', (e) => {
    if (showUploadModal.value) {
      isDragging.value = true
    }
  })
  
  window.addEventListener('dragleave', (e) => {
    if (!e.relatedTarget) {
      isDragging.value = false
    }
  })
})

// Meta tags
useHead({
  title: 'Медиа-менеджер - Админ панель',
  meta: [
    { name: 'description', content: 'Управление медиафайлами системы диагностики' }
  ]
})
</script>
