<script setup lang="ts">

import { ref, onMounted, onUnmounted } from 'vue'
import summerBG from '@/assets/images/summerBG.jpg'


const currentTime = ref('')
let timer: number | null = null

const updateTime = () => {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  currentTime.value = `${hours}:${minutes}:${seconds}`
}

onMounted(() => {
  updateTime()
  timer = window.setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<template>
  <div class="hero-section">
    <div class="hero-background" :style="{ backgroundImage: `url(${summerBG})` }"></div>
    <div class="hero-content">
      <div class="clock">{{ currentTime }}</div>
    </div>
  </div>
</template>

<style scoped>
.hero-section {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  animation: blurToClear 0.8s ease-out forwards;
  filter: blur(20px);
  transform: scale(1.1);
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.15);
  animation: fadeInOverlay 2s ease-out forwards;
  opacity: 0;
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
}

.clock {
  font-size: 4rem;
  font-family: 'Courier New', monospace;
  color: #8BC3E2;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.2rem;
  animation: clockAppear 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.8s forwards;
  opacity: 0;
  transform: scale(0.9);
}

/* 背景从模糊到清晰动画 */
@keyframes blurToClear {
  0% {
    filter: blur(20px);
    transform: scale(1.1);
    opacity: 0;
  }
  100% {
    filter: blur(0px);
    transform: scale(1);
    opacity: 1;
  }
}

/* 浅白色遮罩淡入动画 */
@keyframes fadeInOverlay {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

/* 时钟出现动画 - Apple风格弹性效果 */
@keyframes clockAppear {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* 支持减少动画的用户偏好 */
@media (prefers-reduced-motion: reduce) {
  .hero-section::before,
  .hero-background,
  .clock {
    animation: none;
    opacity: 1;
    filter: none;
    transform: none;
  }
}
</style>