<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-center mb-8">Тест: Диагностический интерфейс</h1>
      
      <EnhancedDiagnosticScreen 
        :device="device" 
        :error="error"
        @back="() => {}"
        @restart="() => {}"
      />
    </div>
  </div>
</template>

<script setup>
// Test data
const device = {
  id: 4,
  name: 'Openbox GOLD',
  description: 'Пре��иум версия Openbox GOLD'
}

const error = {
  id: 9,
  device_id: 4,
  title: 'Закодировано',
  description: 'Каналы показывают сообщение "Закодировано"',
  icon: '🔒',
  severity: 'high'
}

useHead({
  title: 'Тест диагностики - Закодировано',
})
</script>
