<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-dark-300 dark:to-dark-200">
    <div class="container mx-auto px-4 py-12">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Тест: Openbox GOLD - Выбор ошибки
        </h1>
      </div>

      <div class="max-w-4xl mx-auto">
        <div class="card p-8">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
              Выберите проблему: Openbox GOLD
            </h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="error in errors"
              :key="error.id"
              @click="selectError(error)"
              class="error-card cursor-pointer p-4 card hover:shadow-lg transform hover:scale-102 transition-all duration-200"
            >
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 rounded-full flex items-center justify-center"
                     :class="{
                       'bg-red-100 dark:bg-red-900': error.severity === 'high',
                       'bg-yellow-100 dark:bg-yellow-900': error.severity === 'medium',
                       'bg-gray-100 dark:bg-gray-700': !error.severity
                     }">
                  <span class="text-lg">{{ error.icon }}</span>
                </div>
                <div class="flex-1">
                  <div class="flex items-center space-x-2">
                    <h3 class="font-medium text-gray-900 dark:text-white">{{ error.title }}</h3>
                    <span v-if="error.severity === 'high'" class="px-2 py-1 text-xs bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100 rounded-full">
                      Высокий приоритет
                    </span>
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ error.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Test diagnostic interface if error selected -->
        <EnhancedDiagnosticScreen 
          v-if="selectedError"
          :device="{ id: 4, name: 'Openbox GOLD' }" 
          :error="selectedError"
          @back="selectedError = null"
          @restart="selectedError = null"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
// Load errors for Openbox GOLD (device 4)
const { data: errors } = await useLazyFetch('/api/errors/4')
const selectedError = ref(null)

const selectError = (error) => {
  selectedError.value = error
}

// Meta tags
useHead({
  title: 'Тест диагностики Openbox GOLD',
})
</script>
