import { ref, onMounted, onUnmounted } from 'vue'

export function useDampedScroll() {
  // 当前所在的区域：'hero' | 'main'
  const currentSection = ref<'hero' | 'main'>('hero')

  // 滚动累计值（用于跟随效果）
  const scrollProgress = ref(0)

  // 是否正在执行切换动画
  const isTransitioning = ref(false)

  // 内部状态
  let accumulatedDelta = 0
  let decayTimer: number | null = null
  const DECAY_DELAY = 300 // 无输入后开始衰减的延迟 (ms)
  const DECAY_DURATION = 500 // 衰减动画时长 (ms)
  const THRESHOLD = 180 // 触发切换的阈值 (px)
  const MAX_DRAG_RATIO = 0.35 // 最大拖拽比例

  // 衰减动画
  let decayAnimationId: number | null = null
  let decayStartValue = 0
  let decayStartTime = 0

  // 处理滚轮事件
  const handleWheel = (e: WheelEvent) => {
    // 动画进行中禁止输入
    if (isTransitioning.value) return

    e.preventDefault()

    // 累计滚动值
    accumulatedDelta += e.deltaY

    // 限制最大拖拽范围
    const maxDelta = window.innerHeight * MAX_DRAG_RATIO
    if (currentSection.value === 'hero') {
      // 向下滚动限制
      accumulatedDelta = Math.max(0, Math.min(accumulatedDelta, maxDelta))
    } else {
      // 向上滚动限制（负值）
      accumulatedDelta = Math.min(0, Math.max(accumulatedDelta, -maxDelta))
    }

    // 更新进度
    scrollProgress.value = accumulatedDelta

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
    decayStartValue = accumulatedDelta
    decayStartTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - decayStartTime
      const progress = Math.min(elapsed / DECAY_DURATION, 1)

      // ease-out 缓动曲线
      const eased = 1 - Math.pow(1 - progress, 3)

      accumulatedDelta = decayStartValue * (1 - eased)
      scrollProgress.value = accumulatedDelta

      if (progress < 1) {
        decayAnimationId = requestAnimationFrame(animate)
      } else {
        accumulatedDelta = 0
        scrollProgress.value = 0
        decayAnimationId = null
      }
    }

    decayAnimationId = requestAnimationFrame(animate)
  }

  // 检查阈值
  const checkThreshold = () => {
    if (currentSection.value === 'hero' && accumulatedDelta >= THRESHOLD) {
      // 切换到 MainContent
      triggerTransition('main')
    } else if (currentSection.value === 'main' && accumulatedDelta <= -THRESHOLD) {
      // 切换回时钟页
      triggerTransition('hero')
    }
  }

  // 触发页面切换
  const triggerTransition = (target: 'hero' | 'main') => {
    isTransitioning.value = true

    // 清除衰减计时器
    if (decayTimer) {
      clearTimeout(decayTimer)
      decayTimer = null
    }
    if (decayAnimationId) {
      cancelAnimationFrame(decayAnimationId)
      decayAnimationId = null
    }

    // 执行切换动画（700ms）
    setTimeout(() => {
      currentSection.value = target
      accumulatedDelta = 0
      scrollProgress.value = 0
      isTransitioning.value = false
    }, 700)
  }

  // 生命周期
  onMounted(() => {
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
  })

  return {
    currentSection,
    scrollProgress,
    isTransitioning
  }
}
