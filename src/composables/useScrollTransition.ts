import { ref, onMounted, onUnmounted } from 'vue'

const targetProgress = ref(0)
const currentProgress = ref(0)
const velocity = ref(0)

const stiffness = 0.08
const damping = 0.85

let animFrameId: number | null = null

const tick = () => {
  velocity.value += (targetProgress.value - currentProgress.value) * stiffness
  velocity.value *= damping
  currentProgress.value += velocity.value
  animFrameId = requestAnimationFrame(tick)
}

export function useScrollTransition() {
  const handleWheel = (e: WheelEvent) => {
    e.preventDefault()
    targetProgress.value = Math.max(0, Math.min(1, targetProgress.value + e.deltaY * 0.001))
    console.log('target:', targetProgress.value, 'current:', currentProgress.value)
  }

  onMounted(() => {
    document.documentElement.style.overflow = 'hidden'
    window.addEventListener('wheel', handleWheel, { passive: false })
    animFrameId = requestAnimationFrame(tick)
  })

  onUnmounted(() => {
    document.documentElement.style.overflow = ''
    window.removeEventListener('wheel', handleWheel)
    if (animFrameId) cancelAnimationFrame(animFrameId)
  })

  return { targetProgress, currentProgress, velocity }
}
