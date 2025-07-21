// Mock API endpoint for devices
export default defineEventHandler(async (event) => {
  // In production, this would connect to the Express API or database
  return [
    {
      id: 1,
      name: 'Openbox',
      description: 'Стандартная приставка Openbox',
      remote_image: null,
      icon: '📺'
    },
    {
      id: 2,
      name: 'HDBOX',
      description: 'HD приставка HDBOX',
      remote_image: null,
      icon: '📡'
    },
    {
      id: 3,
      name: 'UCLAN',
      description: 'Приставка UCLAN',
      remote_image: null,
      icon: '🎬'
    },
    {
      id: 4,
      name: 'Openbox GOLD',
      description: 'Премиум версия Openbox GOLD',
      remote_image: null,
      icon: '👑'
    }
  ]
})
