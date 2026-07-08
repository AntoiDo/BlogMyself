<script setup lang="ts">
import { useScrollProgress } from '@/composables/useScrollProgress'

const { progress } = useScrollProgress()
</script>

<template>
  <div
    class="overlay"
    :style="{
      backdropFilter: `blur(${progress * 8}px)`,
      WebkitBackdropFilter: `blur(${progress * 8}px)`,
      backgroundColor: `rgba(255, 249, 244, ${progress * 0.85})`,
    }"
  ></div>
</template>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  pointer-events: none;
}
</style>
