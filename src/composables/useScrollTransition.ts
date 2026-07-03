import { ref, onMounted, onUnmounted } from 'vue'

const progress = ref(0)

export function useScrollTransition() {
  const handleWheel = (e: WheelEvent) => {
    e.preventDefault()
    progress.value = Math.max(0, Math.min(1, progress.value + e.deltaY * 0.001))
  }

  onMounted(() => {
    document.documentElement.style.overflow = 'hidden'
    window.addEventListener('wheel', handleWheel, { passive: false })
  })

  onUnmounted(() => {
    document.documentElement.style.overflow = ''
    window.removeEventListener('wheel', handleWheel)
  })

  return { progress }
}
