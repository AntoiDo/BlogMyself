<script setup lang="ts">
import BackgroundLayer from '@/components/BackgroundLayer.vue'
import OverlayLayer from '@/components/OverlayLayer.vue'
import HeroSection from '@/components/HeroSection.vue'
import MainContent from '@/components/MainContent.vue'
</script>

<template>
  <div id="app">
    <BackgroundLayer />
    <OverlayLayer />
    <HeroSection />
    <MainContent />
  </div>
</template>

<style scoped>
#app {
  margin: 0;
  padding: 0;
}
</style>
