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

// 监听切换开始，记录方向
watch(isTransitioning, (newVal) => {
  if (newVal) {
    transitionDirection.value = currentSection.value === 'hero' ? 'down' : 'up'
  }
})

// 计算 Overlay 遮罩进度（0-1）
const overlayProgress = computed(() => {
  const maxDelta = window.innerHeight * 0.35 // MAX_DRAG_RATIO

  // 正在切换动画中
  if (isTransitioning.value) {
    if (transitionDirection.value === 'down') {
      // 向下切换到 MainContent：遮罩保持最大
      return 1
    } else {
      // 向上切换回时钟页：遮罩从当前值逐渐消失
      // 使用 scrollProgress 计算，因为此时 scrollProgress 还没被重置
      return Math.min(Math.abs(scrollProgress.value) / maxDelta, 1)
    }
  }

  // 在时钟页：遮罩跟随向下滚动进度
  if (currentSection.value === 'hero' && scrollProgress.value > 0) {
    return Math.min(scrollProgress.value / maxDelta, 1)
  }

  // 在 MainContent 区域：遮罩 = 1 - 向上滚动进度
  if (currentSection.value === 'main') {
    if (scrollProgress.value < 0) {
      // 向上滚动时，遮罩逐渐减弱
      return 1 - Math.min(Math.abs(scrollProgress.value) / maxDelta, 1)
    }
    // 没有滚动时，保持最大遮罩
    return 1
  }

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
