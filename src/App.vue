<script setup lang="ts">
import HeroSection from '@/components/HeroSection.vue'
import MainContent from '@/components/MainContent.vue'
import { useScrollTransition } from '@/composables/useScrollTransition'

const { progress } = useScrollTransition()
</script>

<template>
  <div id="app">
    <div
      class="overlay"
      :style="{
        backdropFilter: `blur(${progress * 8}px)`,
        WebkitBackdropFilter: `blur(${progress * 8}px)`,
        backgroundColor: `rgba(255, 249, 244, ${progress * 0.85})`,
      }"
    ></div>
    <div
      class="content-layer"
      :style="{ transform: `translateY(${-progress * 100}vh)` }"
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

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  pointer-events: none;
}

.content-layer {
  position: relative;
  z-index: 0;
}
</style>
