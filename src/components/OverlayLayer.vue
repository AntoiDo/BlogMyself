<script setup lang="ts">
interface Props {
  scrollProgress: number
}

const props = withDefaults(defineProps<Props>(), {
  scrollProgress: 0
})
</script>

<template>
  <div
    class="overlay"
    :style="{
      backdropFilter: `blur(${props.scrollProgress * 0.08}px)`,
      WebkitBackdropFilter: `blur(${props.scrollProgress * 0.08}px)`,
      backgroundColor: `rgba(255, 249, 244, ${props.scrollProgress * 0.0085})`,
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
