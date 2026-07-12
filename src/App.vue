<script setup lang="ts">
import BackgroundLayer from '@/components/BackgroundLayer.vue'
import OverlayLayer from '@/components/OverlayLayer.vue'
import HeroSection from '@/components/HeroSection.vue'
import MainContent from '@/components/MainContent.vue'
import { useDampedScroll } from '@/composables/useDampedScroll'
import { computed } from 'vue'

const { currentSection, scrollProgress, isTransitioning } = useDampedScroll()

// 计算页面滑动位置
const pageTransform = computed(() => {
  if (currentSection.value === 'main') {
    // 已经在 MainContent 区域
    if (isTransitioning.value) {
      // 正在切换，执行滑动动画
      return `translateY(-100vh)`
    }
    return `translateY(-100vh)`
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
    <OverlayLayer />
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
