<script setup lang="ts">
import BackgroundLayer from '@/components/BackgroundLayer.vue'
import OverlayLayer from '@/components/OverlayLayer.vue'
import HeroSection from '@/components/HeroSection.vue'
import MainContent from '@/components/MainContent.vue'
import { useDampedScroll } from '@/composables/useDampedScroll'
import { computed, ref, watch } from 'vue'

const { currentSection, scrollProgress, isTransitioning } = useDampedScroll()

// 记录切换前的滚动方向
const transitionDirection = ref<'down' | 'up'>('down')

// 遮罩过渡动画相关
const overlayCurrent = ref(0) // 当前遮罩值
let overlayAnimationId: number | null = null
let overlayStartValue = 0
let overlayTargetValue = 0
let overlayStartTime = 0
const OVERLAY_TRANSITION_DURATION = 700 // 遮罩过渡时长（与页面切换同步）

// 监听切换开始，记录方向并启动遮罩过渡
watch(isTransitioning, (newVal) => {
  if (newVal) {
    transitionDirection.value = currentSection.value === 'hero' ? 'down' : 'up'

    // 启动遮罩过渡动画
    startOverlayTransition()
  }
})

// 启动遮罩过渡动画
const startOverlayTransition = () => {
  // 取消之前的动画
  if (overlayAnimationId) {
    cancelAnimationFrame(overlayAnimationId)
    overlayAnimationId = null
  }

  overlayStartValue = overlayCurrent.value

  // 计算目标值
  if (transitionDirection.value === 'down') {
    // Hero → Main：遮罩从当前值过渡到 1
    overlayTargetValue = 1
  } else {
    // Main → Hero：遮罩从当前值过渡到 0
    overlayTargetValue = 0
  }

  overlayStartTime = performance.now()

  const animate = (currentTime: number) => {
    const elapsed = currentTime - overlayStartTime
    const progress = Math.min(elapsed / OVERLAY_TRANSITION_DURATION, 1)

    // ease-out 缓动曲线
    const eased = 1 - Math.pow(1 - progress, 3)

    overlayCurrent.value = overlayStartValue + (overlayTargetValue - overlayStartValue) * eased

    if (progress < 1) {
      overlayAnimationId = requestAnimationFrame(animate)
    } else {
      overlayCurrent.value = overlayTargetValue
      overlayAnimationId = null
    }
  }

  overlayAnimationId = requestAnimationFrame(animate)
}

// 计算 Overlay 遮罩进度（0-1）
const overlayProgress = computed(() => {
  const maxDelta = window.innerHeight * 0.35 // MAX_DRAG_RATIO

  // 正在切换动画中
  if (isTransitioning.value) {
    return overlayCurrent.value
  }

  // 在时钟页：遮罩跟随向下滚动进度
  if (currentSection.value === 'hero' && scrollProgress.value > 0) {
    const value = Math.min(scrollProgress.value / maxDelta, 1)
    overlayCurrent.value = value
    return value
  }

  // 在 MainContent 区域：遮罩 = 1 - 向上滚动进度
  if (currentSection.value === 'main') {
    if (scrollProgress.value < 0) {
      // 向上滚动时，遮罩逐渐减弱
      const value = 1 - Math.min(Math.abs(scrollProgress.value) / maxDelta, 1)
      overlayCurrent.value = value
      return value
    }
    // 没有滚动时，保持最大遮罩
    overlayCurrent.value = 1
    return 1
  }

  overlayCurrent.value = 0
  return 0
})

// 计算页面滑动位置（使用 px 单位）
const pageTransform = computed(() => {
  const viewportHeight = window.innerHeight

  if (isTransitioning.value) {
    // 正在切换动画中
    if (transitionDirection.value === 'down') {
      // 向下切换到 MainContent
      return `translateY(-${viewportHeight}px)`
    } else {
      // 向上切换回时钟页
      return 'translateY(0)'
    }
  }

  if (currentSection.value === 'main') {
    // 已经在 MainContent 区域，向上滚动时跟随
    // scrollProgress 是负值
    return `translateY(-${viewportHeight + scrollProgress.value}px)`
  }

  // 在时钟页，根据滚动进度移动
  return `translateY(-${scrollProgress.value}px)`
})

// 计算滑动动画的过渡效果
const pageTransition = computed(() => {
  if (isTransitioning.value) {
    return 'transform 0.7s cubic-bezier(0.25, 0.1, 0.25, 1)'
  }
  return 'none'
})
</script>

<template>
  <div id="app">
    <BackgroundLayer />
    <OverlayLayer :scroll-progress="overlayProgress * 100" />
    <div
      class="page-container"
      :style="{
        transform: pageTransform,
        transition: pageTransition,
      }"
    >
      <HeroSection />
      <MainContent />
    </div>
  </div>
</template>

<style scoped>
#app {
  margin: 0;
  padding: 0;
  overflow: hidden;
  height: 100vh;
}

.page-container {
  will-change: transform;
}
</style>
