// API endpoint for getting all remote controls
export default defineEventHandler(async (event) => {
  // Mock remotes data - in production this would come from database
  return [
    {
      id: 1,
      deviceId: 4,
      name: 'Пульт Openbox GOLD',
      version: '1.0',
      image: '/images/remotes/openbox-gold-remote.jpg',
      buttons: [
        {
          id: 1,
          type: 'power',
          label: 'POWER',
          description: 'Включить/выключить приставку',
          x: 50,
          y: 15,
          size: 'medium'
        },
        {
          id: 2,
          type: 'source',
          label: 'SOURCE',
          description: 'Переключить источник сигнала',
          x: 50,
          y: 25,
          size: 'small'
        },
        {
          id: 3,
          type: 'menu',
          label: 'MENU',
          description: 'Открыть главное меню',
          x: 30,
          y: 40,
          size: 'medium'
        },
        {
          id: 4,
          type: 'info',
          label: 'INFO',
          description: 'Показать информацию о канале',
          x: 70,
          y: 40,
          size: 'medium'
        },
        {
          id: 5,
          type: 'ok',
          label: 'OK',
          description: 'Подтвердить выбор',
          x: 50,
          y: 50,
          size: 'large'
        },
        {
          id: 6,
          type: 'up',
          label: 'UP',
          description: 'Навигация вверх',
          x: 50,
          y: 42,
          size: 'small'
        },
        {
          id: 7,
          type: 'down',
          label: 'DOWN',
          description: 'Навигация вниз',
          x: 50,
          y: 58,
          size: 'small'
        },
        {
          id: 8,
          type: 'left',
          label: 'LEFT',
          description: 'Навигация влево',
          x: 42,
          y: 50,
          size: 'small'
        },
        {
          id: 9,
          type: 'right',
          label: 'RIGHT',
          description: 'Навигация вправо',
          x: 58,
          y: 50,
          size: 'small'
        },
        {
          id: 10,
          type: 'exit',
          label: 'EXIT',
          description: 'Выйти из меню',
          x: 70,
          y: 60,
          size: 'medium'
        },
        // Number buttons
        ...Array.from({ length: 10 }, (_, i) => ({
          id: 11 + i,
          type: `num-${i}`,
          label: i.toString(),
          description: `Цифра ${i}`,
          x: 30 + (i % 3) * 20,
          y: 70 + Math.floor(i / 3) * 8,
          size: 'small'
        }))
      ],
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z'
    },
    {
      id: 2,
      deviceId: 1,
      name: 'Пульт Openbox Standard',
      version: '1.0',
      image: '/images/remotes/openbox-standard-remote.jpg',
      buttons: [
        {
          id: 1,
          type: 'power',
          label: 'POWER',
          description: 'Включить/выключить приставку',
          x: 50,
          y: 10,
          size: 'medium'
        },
        {
          id: 2,
          type: 'menu',
          label: 'MENU',
          description: 'Открыть меню',
          x: 30,
          y: 30,
          size: 'medium'
        },
        {
          id: 3,
          type: 'ok',
          label: 'OK',
          description: 'Подтвердить',
          x: 50,
          y: 40,
          size: 'large'
        },
        {
          id: 4,
          type: 'up',
          label: 'UP',
          description: 'Вверх',
          x: 50,
          y: 30,
          size: 'small'
        },
        {
          id: 5,
          type: 'down',
          label: 'DOWN',
          description: 'Вниз',
          x: 50,
          y: 50,
          size: 'small'
        }
      ],
      created_at: '2024-01-10T09:00:00Z',
      updated_at: '2024-01-10T09:00:00Z'
    },
    {
      id: 3,
      deviceId: 2,
      name: 'Пульт HDBOX',
      version: '1.1',
      image: '/images/remotes/hdbox-remote.jpg',
      buttons: [
        {
          id: 1,
          type: 'power',
          label: 'POWER',
          description: 'Питание',
          x: 50,
          y: 12,
          size: 'medium'
        },
        {
          id: 2,
          type: 'menu',
          label: 'MENU',
          description: 'Меню',
          x: 50,
          y: 25,
          size: 'medium'
        }
      ],
      created_at: '2024-01-12T11:00:00Z',
      updated_at: '2024-01-14T15:30:00Z'
    }
  ]
})
