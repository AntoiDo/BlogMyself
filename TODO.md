# TODO

## Bug修复

- [x] **时钟显示问题**：秒位数字无法正确显示（如22:25:27无法显示27的7），冒号位置远低于数字位置
  - 文件：`src/components/HeroSection.vue`
  - 状态：已修复
  - 优先级：高
  - 完成时间：2026-06-30

## 功能优化

- [ ] **Scroll 阻尼感**：为页面滚动添加阻尼/惯性效果，提升浏览体验
  - 涉及：`src/App.vue`
  - 状态：待实现
  - 优先级：中

## Bug修复

- [ ] **文字边框动画只播放一次**：HeroSection 时钟字符的入场动画（charSlideIn）在第一次进入时播放，但回滚到顶部再下滑时不再触发
  - 文件：`src/components/HeroSection.vue`、`src/components/MainContent.vue`
  - 原因：Intersection Observer 只在 isIntersecting 时触发一次，缺少"离开后重置"逻辑
  - 状态：待修复
  - 优先级：高