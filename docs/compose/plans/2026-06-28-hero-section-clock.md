# Hero Section with Clock Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use compose:subagent (recommended) or compose:execute to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a hero section with background image and centered digital clock for the blog homepage

**Architecture:** Single component approach with HeroSection.vue containing full-screen background and clock display, integrated into App.vue

**Tech Stack:** Vue 3 Composition API, TypeScript, CSS3

## Global Constraints

- Vue 3 with `<script setup lang="ts">` syntax
- TypeScript strict mode
- No semicolons, single quotes, 100-char line width (Prettier)
- 2-space indent, LF endings
- Use `@` path alias for imports
- Primary colors: #8BC3E2, #ABCDE0, #D8E4EA, #AFDCCA, #8FD5B9

---

## Task 1: Create HeroSection.vue Component

**Covers:** [S1]

**Files:**
- Create: `src/components/HeroSection.vue`

**Interfaces:**
- Consumes: None (standalone component)
- Produces: HeroSection component with background and clock

- [ ] **Step 1: Create component file**

```vue
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

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
    <div class="hero-content">
      <div class="clock">{{ currentTime }}</div>
    </div>
  </div>
</template>

<style scoped>
.hero-section {
  height: 100vh;
  background-image: url('@/assets/images/summerBG.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
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
  background: rgba(0, 0, 0, 0.3);
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
}
</style>
```

- [ ] **Step 2: Verify background image exists**

Check that the background image file exists:
```bash
# Verify image file exists
Test-Path -Path "src/assets/images/summerBG.jpg"
# If not exists, create images directory and ask user to place image
mkdir -p src/assets/images
```

- [ ] **Step 3: Update component to use actual image**

The component already uses the correct image path. No changes needed to the style section.

- [ ] **Step 4: Commit changes**

```bash
git add src/components/HeroSection.vue
git commit -m "feat: add HeroSection component with clock display and background image"
```

## Task 2: Update App.vue to Use HeroSection

**Covers:** [S1]

**Files:**
- Modify: `src/App.vue`

**Interfaces:**
- Consumes: HeroSection component
- Produces: Updated App.vue with hero section

- [ ] **Step 1: Update App.vue template**

```vue
<script setup lang="ts">
import HeroSection from '@/components/HeroSection.vue'
</script>

<template>
  <div id="app">
    <HeroSection />
  </div>
</template>

<style scoped>
#app {
  margin: 0;
  padding: 0;
}
</style>
```

- [ ] **Step 2: Update global styles**

Update `src/assets/main.css`:

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}
```

- [ ] **Step 3: Import global styles in main.ts**

Update `src/main.ts`:

```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './assets/main.css'

const app = createApp(App)

app.use(createPinia())

app.mount('#app')
```

- [ ] **Step 4: Test the implementation**

Run development server:
```bash
npm run dev
```

Expected: Browser shows hero section with background image and working digital clock

- [ ] **Step 5: Commit changes**

```bash
git add src/App.vue src/assets/main.css src/main.ts
git commit -m "feat: integrate HeroSection into App with global styles"
```

## Task 3: Verification and Testing

**Covers:** [S1]

**Files:**
- None (verification only)

**Interfaces:**
- Consumes: All previous tasks
- Produces: Verified working implementation

- [ ] **Step 1: Run lint check**

```bash
npm run lint
```

Expected: No errors or warnings

- [ ] **Step 2: Run type check**

```bash
npm run type-check
```

Expected: No TypeScript errors

- [ ] **Step 3: Run build**

```bash
npm run build
```

Expected: Successful build without errors

- [ ] **Step 4: Visual verification**

1. Start dev server: `npm run dev`
2. Open browser to localhost:5173
3. Verify:
   - Hero section takes full viewport height
   - Background image displays correctly
   - Digital clock shows current time
   - Clock updates every second
   - Clock is centered both horizontally and vertically

- [ ] **Step 5: Final commit**

```bash
git add .
git commit -m "feat: complete hero section with clock implementation"
```

---

## Self-Review Checklist

1. **Spec coverage:** Task covers [S1] - Hero section with background and clock
2. **Placeholder scan:** No TBD/TODO placeholders found
3. **Type consistency:** TypeScript types are consistent across files
4. **Code quality:** Follows Vue 3 best practices and project coding standards