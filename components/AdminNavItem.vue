<template>
  <NuxtLink
    :to="to"
    class="flex items-center transition-colors text-sm font-medium"
    :class="sidebar ? sidebarClasses : horizontalClasses"
  >
    <component :is="iconComponent" class="w-5 h-5 flex-shrink-0" />
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
  const base = 'space-x-3 px-3 py-2 rounded-lg whitespace-nowrap'
  return isActive.value
    ? `${base} bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300`
    : `${base} text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200`
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
      fill: 'currentColor', 
      viewBox: '0 0 20 20' 
    }, [
      h('path', { 
        d: 'M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z' 
      })
    ]),
    device: () => h('svg', { 
      fill: 'currentColor', 
      viewBox: '0 0 20 20' 
    }, [
      h('path', { 
        d: 'M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z' 
      })
    ]),
    error: () => h('svg', { 
      fill: 'currentColor', 
      viewBox: '0 0 20 20' 
    }, [
      h('path', { 
        'fill-rule': 'evenodd',
        d: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z',
        'clip-rule': 'evenodd'
      })
    ]),
    steps: () => h('svg', { 
      fill: 'currentColor', 
      viewBox: '0 0 20 20' 
    }, [
      h('path', { 
        'fill-rule': 'evenodd',
        d: 'M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z',
        'clip-rule': 'evenodd'
      })
    ]),
    media: () => h('svg', { 
      fill: 'currentColor', 
      viewBox: '0 0 20 20' 
    }, [
      h('path', { 
        'fill-rule': 'evenodd',
        d: 'M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z',
        'clip-rule': 'evenodd'
            })
    ]),
    remote: () => h('svg', {
      fill: 'currentColor',
      viewBox: '0 0 20 20'
    }, [
      h('path', {
        d: 'M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z'
      })
    ]),
    settings: () => h('svg', { 
      fill: 'currentColor', 
      viewBox: '0 0 20 20' 
    }, [
      h('path', { 
        'fill-rule': 'evenodd',
        d: 'M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z',
        'clip-rule': 'evenodd'
      })
    ])
  }
  
  return iconMap[props.icon] || iconMap.home
})
</script>
