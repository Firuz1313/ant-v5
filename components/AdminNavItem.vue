<template>
  <NuxtLink
    :to="to"
    class="flex items-center transition-all duration-200 text-sm font-medium group"
    :class="sidebar ? sidebarClasses : horizontalClasses"
  >
    <component :is="iconComponent" class="w-6 h-6 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
    <span>{{ label }}</span>
  </NuxtLink>
</template>

<script setup>
const props = defineProps({
  to: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  sidebar: {
    type: Boolean,
    default: false
  }
})

const route = useRoute()

const isActive = computed(() => {
  return route.path === props.to || (props.to !== '/admin' && route.path.startsWith(props.to))
})

const sidebarClasses = computed(() => {
  const base = 'space-x-3 px-3 py-3 rounded-lg whitespace-nowrap transform'
  return isActive.value
    ? `${base} bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 shadow-md scale-105`
    : `${base} text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200 hover:shadow-lg hover:scale-105`
})

const horizontalClasses = computed(() => {
  const base = 'space-x-2 py-4 px-1 border-b-2 whitespace-nowrap'
  return isActive.value
    ? `${base} border-primary-500 text-primary-600 dark:text-primary-400`
    : `${base} border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300`
})

const icons = {
  home: 'svg',
  device: 'svg', 
  error: 'svg',
  steps: 'svg',
  media: 'svg',
  settings: 'svg'
}

const iconComponent = computed(() => {
  const iconMap = {
    home: () => h('svg', {
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        d: 'm3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'
      }),
      h('polyline', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        points: '9,22 9,12 15,12 15,22'
      })
    ]),
    device: () => h('svg', {
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      viewBox: '0 0 24 24'
    }, [
      h('rect', {
        x: '2',
        y: '3',
        width: '20',
        height: '14',
        rx: '2',
        ry: '2',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      }),
      h('line', {
        x1: '8',
        y1: '21',
        x2: '16',
        y2: '21',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      }),
      h('line', {
        x1: '12',
        y1: '17',
        x2: '12',
        y2: '21',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      })
    ]),
    error: () => h('svg', {
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      viewBox: '0 0 24 24'
    }, [
      h('circle', {
        cx: '12',
        cy: '12',
        r: '10',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      }),
      h('path', {
        d: 'm15 9-6 6',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      }),
      h('path', {
        d: 'm9 9 6 6',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      })
    ]),
    steps: () => h('svg', {
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        d: 'M9 6 9 4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      }),
      h('path', {
        d: 'M8 2v4',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      }),
      h('path', {
        d: 'M16 2v4',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      }),
      h('rect', {
        width: '18',
        height: '18',
        x: '3',
        y: '4',
        rx: '2',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      }),
      h('path', {
        d: 'M11 14h1l2 2 4-4',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      })
    ]),
    media: () => h('svg', {
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      viewBox: '0 0 24 24'
    }, [
      h('rect', {
        width: '18',
        height: '18',
        x: '3',
        y: '3',
        rx: '2',
        ry: '2',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      }),
      h('circle', {
        cx: '9',
        cy: '9',
        r: '2',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      }),
      h('path', {
        d: 'm21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      })
    ]),
    remote: () => h('svg', {
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      viewBox: '0 0 24 24'
    }, [
      h('rect', {
        x: '8',
        y: '2',
        width: '8',
        height: '20',
        rx: '2',
        ry: '2',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      }),
      h('circle', {
        cx: '12',
        cy: '8',
        r: '2',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      }),
      h('circle', {
        cx: '10',
        cy: '16',
        r: '1',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      }),
      h('circle', {
        cx: '14',
        cy: '16',
        r: '1',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      }),
      h('circle', {
        cx: '12',
        cy: '18',
        r: '1',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      })
    ]),
    analytics: () => h('svg', {
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        d: 'M3 3v18h18',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      }),
      h('path', {
        d: 'm19 9-5 5-4-4-3 3',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      })
    ]),
    reports: () => h('svg', {
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      }),
      h('polyline', {
        points: '14,2 14,8 20,8',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      }),
      h('line', {
        x1: '16',
        y1: '13',
        x2: '8',
        y2: '13',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      }),
      h('line', {
        x1: '16',
        y1: '17',
        x2: '8',
        y2: '17',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      }),
      h('polyline', {
        points: '10,9 9,9 8,9',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      })
    ]),
    settings: () => h('svg', {
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      viewBox: '0 0 24 24'
    }, [
      h('circle', {
        cx: '12',
        cy: '12',
        r: '3',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      }),
      h('path', {
        d: 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      })
    ])
  }

  return iconMap[props.icon] || iconMap.home
})
</script>
