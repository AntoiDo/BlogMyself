<script setup lang="ts">
import summerBG from '@/assets/images/summerBG.jpg'
</script>

<template>
  <div class="background-layer" :style="{ backgroundImage: `url(${summerBG})` }"></div>
</template>

<style scoped>
.background-layer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: -1;
  animation: blurToClear 0.8s ease-out forwards;
  filter: blur(20px);
  transform: scale(1.1);
}

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

@media (prefers-reduced-motion: reduce) {
  .background-layer {
    animation: none;
    opacity: 1;
    filter: none;
    transform: none;
  }
}
</style>
