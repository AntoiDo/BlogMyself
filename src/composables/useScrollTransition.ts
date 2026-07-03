import { onMounted, onUnmounted } from 'vue'

export function useScrollTransition() {
  const handleWheel = (e: WheelEvent) => {
    e.preventDefault()
    console.log('deltaY:', e.deltaY)
  }

  onMounted(() => {
    document.documentElement.style.overflow = 'hidden'
    window.addEventListener('wheel', handleWheel, { passive: false })
  })

  onUnmounted(() => {
    document.documentElement.style.overflow = ''
    window.removeEventListener('wheel', handleWheel)
  })
}
