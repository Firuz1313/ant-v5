<template>
  <div class="min-h-screen">
    <!-- Header with theme toggle -->
    <header class="bg-white dark:bg-dark-100 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <NuxtLink to="/" class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-sm">TV</span>
              </div>
              <span class="font-poppins font-semibold text-xl text-gray-900 dark:text-white">
                Диагностика ТВ
              </span>
            </NuxtLink>
          </div>
          
          <div class="flex items-center space-x-4">
            <ThemeToggle />
            <NuxtLink 
              to="/admin" 
              class="text-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Админка
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main>
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-50 dark:bg-dark-200 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <p class="text-center text-sm text-gray-500 dark:text-gray-400">
          © 2024 Система диагностики ТВ-приставок
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
// Layout logic can go here
</script>
