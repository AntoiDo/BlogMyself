<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const currentTime = ref('')
let timer: number | null = null

const clockRef = ref<HTMLElement | null>(null)
const isAnimating = ref(false)

let observer: IntersectionObserver | null = null

const updateTime = () => {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  currentTime.value = `${hours}:${minutes}:${seconds}`
}

const characters = computed(() => currentTime.value.split(''))

onMounted(() => {
  updateTime()
  timer = window.setInterval(updateTime, 1000)

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isAnimating.value = entry.isIntersecting
      })
    },
    { threshold: 0.3 }
  )

  if (clockRef.value) {
    observer.observe(clockRef.value)
  }
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
  if (observer) {
    observer.disconnect()
  }
})
</script>

<template>
  <div class="hero-section">
    <div class="hero-content">
      <div class="clock" ref="clockRef" :class="{ 'is-animating': isAnimating }">
        <span
          v-for="(char, index) in characters"
          :key="`${index}`"
          class="clock-char"
          :class="{ 'is-separator': char === ':' }"
          :style="{ animationDelay: `${0.3 + index * 0.05}s` }"
        >{{ char }}</span>
      </div>
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
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
}

.clock {
  font-size: 4rem;
  font-family: "Cormorant Garamond", "Times New Roman", serif;
  color: #F5F2E8;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.2rem;
  display: flex;
  gap: 0;
}

.clock-char {
  display: inline-block;
  opacity: 0;
  transform: translateY(20px);
}

.clock.is-animating .clock-char {
  animation: charSlideIn 0.5s cubic-bezier(0.33, 1, 0.68, 1) forwards;
}

.clock.is-animating .clock-char.is-separator {
  animation-name: separatorPulse;
  animation-duration: 2s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-delay: 1.5s;
}

@keyframes charSlideIn {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes separatorPulse {
  0%, 100% {
    opacity: 1;
    transform: translateY(0);
  }
  50% {
    opacity: 0.3;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .clock-char {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
</style>
