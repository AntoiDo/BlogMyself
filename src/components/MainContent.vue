<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const leftPanelRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)

let observer: IntersectionObserver | null = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isVisible.value = entry.isIntersecting
      })
    },
    { threshold: 0.1 }
  )

  if (leftPanelRef.value) {
    observer.observe(leftPanelRef.value)
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<template>
  <div class="main-content">
    <div class="content-container">
      <div
        ref="leftPanelRef"
        class="left-panel"
        :class="{ 'is-visible': isVisible }"
      >
        <div class="panel-inner">
          <div class="avatar"></div>
          <nav class="sidebar-menu">
            <a href="#" class="menu-item active">个人介绍</a>
            <a href="#" class="menu-item">日常随想</a>
            <a href="#" class="menu-item">技术笔记</a>
            <a href="#" class="menu-item">照片墙</a>
          </nav>
        </div>
      </div>

      <div
        ref="rightPanelRef"
        class="right-panel"
        :class="{ 'is-visible': isVisible }"
      >
        <div class="panel-inner">
          <h2 class="article-title">欢迎来到我的博客</h2>
          <p class="article-text">这里是我的个人空间，记录生活与思考。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-content {
  position: relative;
  min-height: 100vh;
}

.content-container {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 24px;
  min-height: 500px;
}

.left-panel,
.right-panel {
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  opacity: 0;
  transform: translateY(60px);
  transition:
    opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.left-panel.is-visible {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 0s;
}

.right-panel.is-visible {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 0.2s;
}

.left-panel {
  flex: 0 0 25%;
  padding: 32px 20px;
}

.right-panel {
  flex: 1;
  padding: 32px 28px;
}

.panel-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8bc3e2, #afdcca);
  margin: 0 auto 24px;
}

.sidebar-menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.menu-item {
  display: block;
  padding: 10px 16px;
  border-radius: 8px;
  color: #555;
  text-decoration: none;
  font-size: 15px;
  transition: all 0.2s ease;
}

.menu-item:hover,
.menu-item.active {
  background: rgba(139, 195, 226, 0.15);
  color: #333;
}

.article-title {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 16px;
}

.article-text {
  color: #666;
  line-height: 1.8;
}

@media (prefers-reduced-motion: reduce) {
  .left-panel,
  .right-panel {
    animation: none;
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>