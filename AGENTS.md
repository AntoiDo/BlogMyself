# Agent Instructions

## Project

Vue 3 blog frontend. Backend (FastAPI + SQLite) lives in a separate repo/folder.
State: Pinia. Routing: Vue Router 5. Language: TypeScript 6 + `<script setup lang="ts">`.

## Commands

```sh
npm run dev          # Vite dev server
npm run build        # type-check + vite build (parallel via run-p)
npm run test:unit    # Vitest (jsdom env, excludes e2e/)
npm run lint         # oxlint --fix, then eslint --fix (sequential, run-s)
npm run format       # Prettier on src/ only
```

`lint` must run **oxlint first, eslint second** — the eslint config disables formatting rules via `eslint-config-prettier` to avoid conflicts.

## Code Style

- No semicolons, single quotes, 100-char line width (Prettier)
- 2-space indent, LF endings, final newline (.editorconfig)
- Vue components: `<script setup lang="ts">` style

## Structure

```
src/
  views/        # Route-level components (HomeView, AboutView)
  components/   # Reusable UI components
  stores/       # Pinia stores
  router/       # Vue Router config
  assets/       # Static assets, CSS
```

Path alias: `@` → `./src` (vite.config.ts).

## Testing

- Vitest with jsdom. Unit tests live in `src/**/__tests__/*`.
- E2e tests excluded from `npm run test:unit`.

## Gotchas

- `npm run build` uses `run-p` (npm-run-all2) to run `type-check` and `build-only` in parallel — both must pass.
- Type-check uses `vue-tsc` (not raw `tsc`) because `.vue` files need special handling.
- Lint order matters: `lint:oxlint` → `lint:eslint`. Don't reorder.

## Tutoring Mode

When working with the user, follow these principles:
1. Explain reasoning before coding
2. One small task at a time
3. Describe the design before generating code
4. Teach, don't just complete the work
5. **Incremental Code Generation**: Generate code for only one feature or module at a time. Never generate complete implementations all at once.
6. **Syntax Explanation**: When generating frontend code, explain the syntax structure used in the code snippet, including Vue components, TypeScript patterns, and template syntax.

## Learning Student Guidelines

This project is for a student learning frontend development. When assisting:
- Focus on teaching Vue.js concepts and patterns
- Explain why each code structure is used
- Provide clear, simple implementations that build upon each other
- Help the student understand the relationship between frontend (Vue) and backend (FastAPI + SQLite)
- Break down complex features into manageable learning steps

## Blog Demo Design Structure

### Color Palette
- Primary colors: #8BC3E2, #ABCDE0, #D8E4EA, #AFDCCA, #8FD5B9
- These colors will be used for backgrounds, accents, and UI elements throughout the blog

### Page Layout

#### 1. Hero Section (First Screen)
- Full viewport height background with blog title/header
- Clock display (real-time clock)
- Smooth scroll transition to next section

#### 2. Main Content Section
Two-column layout with equal height:
- **Left Column (Sidebar)**:
  - Profile/avatar at top
  - Navigation menu below avatar
  - Menu items: Personal Introduction, Daily Thoughts, etc.
  
- **Right Column (Main Content)**:
  - Article display area
  - Shows selected article content based on sidebar navigation

### Component Structure (Vue)
- `HomeView.vue` - Main page container
- `HeroSection.vue` - Background and clock component
- `MainContent.vue` - Two-column layout container
- `Sidebar.vue` - Left column with profile and menu
- `ArticleDisplay.vue` - Right column for articles
