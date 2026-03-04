---
title: Build Configuration
description: reference documentation
---

<div style="border-bottom: 1px solid var(--vp-c-divider); padding-bottom: 1rem; margin-bottom: 2rem;">
  <h1 style="margin-bottom: 0.5rem;">Build Configuration</h1>
  <div style="display: flex; gap: 1rem; flex-wrap: wrap; font-size: 0.9rem; color: var(--vp-c-text-2);">
    <span style="display: flex; align-items: center; gap: 0.25rem;">
      📚 <strong>Reference</strong>
    </span>
    <span style="display: flex; align-items: center; gap: 0.25rem;">
      📝 <strong>516</strong> words
    </span>
    <span style="display: flex; align-items: center; gap: 0.25rem;">
      ⏱️ <strong>3</strong> min read
    </span>
  </div>
</div>

Build configuration in LoanFlow is managed through **Vite**, a modern frontend build tool optimized for fast development and efficient production builds. This page documents the build setup, configuration files, and the development and production workflows.

## Build Tool: Vite

LoanFlow uses **Vite 5.0.8** as its primary build tool. Vite provides:

- **Fast development server** with Hot Module Replacement (HMR) for instant feedback during development
- **Optimized production builds** with automatic code splitting and asset optimization
- **Native ES modules support** for modern JavaScript development

The Vite configuration is defined in `vite.config.ts` at the project root.

## Configuration Files

### vite.config.ts

The main Vite configuration file defines the build behavior and plugin setup:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

**Key configuration elements:**

| Element | Purpose |
|---------|---------|
| `react()` plugin | Enables React Fast Refresh and JSX transformation during development and builds |
| `@` path alias | Maps `@` to the `./src` directory, allowing imports like `import { Component } from "@/components"` instead of relative paths |

### tsconfig.node.json

This TypeScript configuration is specific to Node.js files (like `vite.config.ts`) and is separate from the main application TypeScript configuration:

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

This ensures the Vite configuration file itself is properly type-checked while using modern module syntax.

### package.json Scripts

Build-related npm scripts are defined in `package.json`:

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `vite` | Starts the Vite development server with HMR |
| `build` | `tsc && vite build` | Compiles TypeScript, then builds for production |
| `preview` | `vite preview` | Previews the production build locally |
| `lint` | `eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0` | Lints TypeScript and TSX files |

## Development Workflow

### Starting the Development Server

Run the development server with:

```bash
npm run dev
```

This command:
1. Starts the Vite dev server on a local port (typically `http://localhost:5173`)
2. Enables **Hot Module Replacement (HMR)**, which automatically refreshes the browser when source files change
3. Provides fast feedback during development without full page reloads

The React plugin (`@vitejs/plugin-react`) enables React Fast Refresh, allowing state to persist during edits to component files.

## Production Build Process

The production build follows a two-step process defined in the `build` script:

```
npm run build
```

### Step 1: TypeScript Compilation

```bash
tsc
```

The TypeScript compiler performs type checking and transpiles `.ts` and `.tsx` files. This step validates the entire codebase for type safety before proceeding to bundling.

> **Note:** The actual compiled output from `tsc` is not used directly in the final bundle. This step serves primarily as a type-checking gate.

### Step 2: Vite Build

```bash
vite build
```

After type checking passes, Vite:
1. Bundles all application code and dependencies
2. Applies optimizations (tree-shaking, minification, code splitting)
3. Generates optimized assets in the `dist/` directory
4. Produces a production-ready application

## Path Aliases

The `@` alias is configured to resolve to the `src` directory, enabling cleaner imports throughout the application:

**Without alias (relative paths):**
```typescript
import { Button } from "../../../components/ui/Button";
```

**With alias:**
```typescript
import { Button } from "@/components/ui/Button";
```

This alias is defined in `vite.config.ts` and applies to both development and production builds.

## React Plugin Support

The `@vitejs/plugin-react` plugin (version 4.2.1) provides:

- **JSX transformation** for `.jsx` and `.tsx` files
- **React Fast Refresh** during development for preserving component state during edits
- **Automatic React import injection** (in compatible Vite versions)

This plugin is essential for the React development experience in LoanFlow and is included in the build pipeline automatically.

## Related Documentation

For additional context on the development environment and setup, see [Development Setup](./development-setup.md).

For information on the overall technology stack, see [Technology Stack](./tech-stack.md).