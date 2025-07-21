import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', () => {
  // State
  const settings = ref({
    defaultDeviceIcon: null,
    defaultRemote: null,
    theme: 'light',
    language: 'ru',
    notifications: true,
    autoSync: true,
    systemName: 'Диагностика ТВ-приставок',
    maxSteps: 15,
    defaultLanguage: 'ru',
    sessionTimeout: 30,
    enableOperatorMode: true,
    enableAnalytics: true,
    enableDetailedLogging: false
  })

  const isLoading = ref(false)
  const lastUpdated = ref(null)

  // Actions
  const loadSettings = async () => {
    isLoading.value = true
    try {
      const response = await $fetch('/api/admin/settings')
      if (response) {
        settings.value = { ...settings.value, ...response }
        lastUpdated.value = new Date()
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    } finally {
      isLoading.value = false
    }
  }

  const saveSettings = async (newSettings) => {
    isLoading.value = true
    try {
      const response = await $fetch('/api/admin/settings', {
        method: 'POST',
        body: newSettings || settings.value
      })
      
      if (response.success) {
        settings.value = { ...settings.value, ...response.settings }
        lastUpdated.value = new Date()
        
        // Trigger refresh of dependent data
        await refreshNuxtData('devices')
        
        return { success: true, message: response.message }
      }
    } catch (error) {
      console.error('Failed to save settings:', error)
      return { success: false, message: 'Ошибка сохранения настроек' }
    } finally {
      isLoading.value = false
    }
  }

  const updateDeviceIcon = (icon) => {
    settings.value.defaultDeviceIcon = icon
  }

  const updateDefaultRemote = (remote) => {
    settings.value.defaultRemote = remote
  }

  // Getters
  const getDefaultDeviceIcon = computed(() => settings.value.defaultDeviceIcon)
  const getDefaultRemote = computed(() => settings.value.defaultRemote)
  const getTheme = computed(() => settings.value.theme)
  const getSystemName = computed(() => settings.value.systemName)

  return {
    // State
    settings: readonly(settings),
    isLoading: readonly(isLoading),
    lastUpdated: readonly(lastUpdated),
    
    // Actions
    loadSettings,
    saveSettings,
    updateDeviceIcon,
    updateDefaultRemote,
    
    // Getters
    getDefaultDeviceIcon,
    getDefaultRemote,
    getTheme,
    getSystemName
  }
})
