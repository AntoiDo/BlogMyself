import { ref, onMounted, onUnmounted } from 'vue'

export function useDampedScroll() {
  // 当前所在的区域：'hero' | 'main'
  const currentSection = ref<'hero' | 'main'>('hero')

  // 滚动累计值（用于跟随效果）
  const scrollProgress = ref(0)

  // 是否正在执行切换动画
  const isTransitioning = ref(false)

  // 检测用户是否开启减少动画
  const prefersReducedMotion = ref(false)

  // 内部状态
  let accumulatedDelta = 0
  let targetDelta = 0 // 目标值
  let decayTimer: number | null = null
  const DECAY_DELAY = 300 // 无输入后开始衰减的延迟 (ms)
  const DECAY_DURATION = 500 // 衰减动画时长 (ms)
  const THRESHOLD = 180 // 触发切换的阈值 (px)
  const MAX_DRAG_RATIO = 0.35 // 最大拖拽比例
  const SMOOTH_DURATION = 150 // 平滑过渡时长 (ms)

  // 平滑过渡动画
  let smoothAnimationId: number | null = null
  let smoothStartValue = 0
  let smoothStartTime = 0
  let smoothTargetValue = 0

  // 衰减动画
  let decayAnimationId: number | null = null
  let decayStartValue = 0
  let decayStartTime = 0

  // 检测减少动画偏好
  const checkReducedMotion = () => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    prefersReducedMotion.value = mediaQuery.matches

    // 监听变化
    mediaQuery.addEventListener('change', (e) => {
      prefersReducedMotion.value = e.matches
    })
  }

  // 平滑过渡到目标值
  const smoothTo = (target: number) => {
    // 如果开启减少动画，直接跳转
    if (prefersReducedMotion.value) {
      accumulatedDelta = target
      targetDelta = target
      scrollProgress.value = target
      return
    }

    // 取消之前的动画
    if (smoothAnimationId) {
      cancelAnimationFrame(smoothAnimationId)
      smoothAnimationId = null
    }

    smoothStartValue = accumulatedDelta
    smoothTargetValue = target
    smoothStartTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - smoothStartTime
      const progress = Math.min(elapsed / SMOOTH_DURATION, 1)

      // ease-out 缓动曲线
      const eased = 1 - Math.pow(1 - progress, 3)

      accumulatedDelta = smoothStartValue + (smoothTargetValue - smoothStartValue) * eased
      scrollProgress.value = accumulatedDelta

      if (progress < 1) {
        smoothAnimationId = requestAnimationFrame(animate)
      } else {
        accumulatedDelta = smoothTargetValue
        scrollProgress.value = smoothTargetValue
        smoothAnimationId = null
      }
    }

    smoothAnimationId = requestAnimationFrame(animate)
  }

  // 处理滚轮事件
  const handleWheel = (e: WheelEvent) => {
    // 动画进行中禁止输入
    if (isTransitioning.value) return

    e.preventDefault()

    // 计算目标累计值
    targetDelta += e.deltaY

    // 限制最大拖拽范围
    const maxDelta = window.innerHeight * MAX_DRAG_RATIO
    if (currentSection.value === 'hero') {
      // 向下滚动限制（禁止向上）
      targetDelta = Math.max(0, Math.min(targetDelta, maxDelta))
    } else {
      // 向上滚动限制（禁止向下）
      targetDelta = Math.min(0, Math.max(targetDelta, -maxDelta))
    }

    // 平滑过渡到目标值
    smoothTo(targetDelta)

    // 重置衰减计时器
    resetDecayTimer()

    // 检查是否超过阈值
    checkThreshold()
  }

  // 重置衰减计时器
  const resetDecayTimer = () => {
    if (decayTimer) {
      clearTimeout(decayTimer)
    }
    if (decayAnimationId) {
      cancelAnimationFrame(decayAnimationId)
      decayAnimationId = null
    }

    decayTimer = window.setTimeout(() => {
      startDecay()
    }, DECAY_DELAY)
  }

  // 开始衰减动画
  const startDecay = () => {
    // 如果开启减少动画，直接重置
    if (prefersReducedMotion.value) {
      accumulatedDelta = 0
      targetDelta = 0
      scrollProgress.value = 0
      return
    }

    // 取消平滑动画
    if (smoothAnimationId) {
      cancelAnimationFrame(smoothAnimationId)
      smoothAnimationId = null
    }

    decayStartValue = accumulatedDelta
    decayStartTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - decayStartTime
      const progress = Math.min(elapsed / DECAY_DURATION, 1)

      // ease-out 缓动曲线
      const eased = 1 - Math.pow(1 - progress, 3)

      accumulatedDelta = decayStartValue * (1 - eased)
      targetDelta = accumulatedDelta
      scrollProgress.value = accumulatedDelta

      if (progress < 1) {
        decayAnimationId = requestAnimationFrame(animate)
      } else {
        accumulatedDelta = 0
        targetDelta = 0
        scrollProgress.value = 0
        decayAnimationId = null
      }
    }

    decayAnimationId = requestAnimationFrame(animate)
  }

  // 检查阈值
  const checkThreshold = () => {
    if (currentSection.value === 'hero' && targetDelta >= THRESHOLD) {
      // 切换到 MainContent
      triggerTransition('main')
    } else if (currentSection.value === 'main' && targetDelta <= -THRESHOLD) {
      // 切换回时钟页
      triggerTransition('hero')
    }
  }

  // 触发页面切换
  const triggerTransition = (target: 'hero' | 'main') => {
    isTransitioning.value = true

    // 清除所有动画
    if (decayTimer) {
      clearTimeout(decayTimer)
      decayTimer = null
    }
    if (decayAnimationId) {
      cancelAnimationFrame(decayAnimationId)
      decayAnimationId = null
    }
    if (smoothAnimationId) {
      cancelAnimationFrame(smoothAnimationId)
      smoothAnimationId = null
    }

    // 根据动画偏好决定切换时长
    const duration = prefersReducedMotion.value ? 0 : 700

    // 执行切换动画
    setTimeout(() => {
      currentSection.value = target
      accumulatedDelta = 0
      targetDelta = 0
      scrollProgress.value = 0
      isTransitioning.value = false
    }, duration)
  }

  // 生命周期
  onMounted(() => {
    checkReducedMotion()
    window.addEventListener('wheel', handleWheel, { passive: false })
  })

  onUnmounted(() => {
    window.removeEventListener('wheel', handleWheel)
    if (decayTimer) {
      clearTimeout(decayTimer)
    }
    if (decayAnimationId) {
      cancelAnimationFrame(decayAnimationId)
    }
    if (smoothAnimationId) {
      cancelAnimationFrame(smoothAnimationId)
    }
  })

  return {
    currentSection,
    scrollProgress,
    isTransitioning,
    prefersReducedMotion
  }
}
