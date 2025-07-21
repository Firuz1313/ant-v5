// API endpoint for devices with settings integration
export default defineEventHandler(async (event) => {
  // Get settings to apply defaults
  let defaultIcon = null
  let defaultRemote = null

  try {
    // In production, this would load from database
    // For now, we'll use placeholder values
    defaultIcon = null // Will be replaced by actual settings
    defaultRemote = null
  } catch (error) {
    console.error('Failed to load settings for devices:', error)
  }

  // Base device data - in production, this would come from database
  const devices = [
    {
      id: 1,
      name: 'Openbox',
      description: 'Стандартная приставка Openbox',
      remote_image: null,
      icon: '📺',
      custom_icon: null,
      custom_remote: null
    },
    {
      id: 2,
      name: 'HDBOX',
      description: 'HD приставка HDBOX',
      remote_image: null,
      icon: '📡',
      custom_icon: null,
      custom_remote: null
    },
    {
      id: 3,
      name: 'UCLAN',
      description: 'Приставка UCLAN',
      remote_image: null,
      icon: '🎬',
      custom_icon: null,
      custom_remote: null
    },
    {
      id: 4,
      name: 'Openbox GOLD',
      description: 'Премиум версия Openbox GOLD',
      remote_image: null,
      icon: '👑',
      custom_icon: null,
      custom_remote: null
    }
  ]

  // Apply default settings where devices don't have custom values
  return devices.map(device => ({
    ...device,
    display_icon: device.custom_icon || defaultIcon || device.icon,
    display_remote: device.custom_remote || defaultRemote || device.remote_image,
    has_custom_icon: !!device.custom_icon,
    has_custom_remote: !!device.custom_remote
  }))
})
