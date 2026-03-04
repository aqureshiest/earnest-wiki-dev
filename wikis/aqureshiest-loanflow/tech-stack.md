---
title: Technology Stack
description: reference documentation
---

<div style="border-bottom: 1px solid var(--vp-c-divider); padding-bottom: 1rem; margin-bottom: 2rem;">
  <h1 style="margin-bottom: 0.5rem;">Technology Stack</h1>
  <div style="display: flex; gap: 1rem; flex-wrap: wrap; font-size: 0.9rem; color: var(--vp-c-text-2);">
    <span style="display: flex; align-items: center; gap: 0.25rem;">
      📚 <strong>Reference</strong>
    </span>
    <span style="display: flex; align-items: center; gap: 0.25rem;">
      📝 <strong>614</strong> words
    </span>
    <span style="display: flex; align-items: center; gap: 0.25rem;">
      ⏱️ <strong>4</strong> min read
    </span>
  </div>
</div>

LoanFlow is built on a modern, JavaScript-based technology stack optimized for rapid development and maintainable code. This page documents the core technologies, libraries, and tools that power the application.

## Frontend Framework

**React 18.2.0** serves as the primary UI framework. React provides the component-based architecture that structures the application's user interface, enabling reusable, composable UI elements and efficient rendering through its virtual DOM.

**TypeScript 5.2.2** is used throughout the codebase for static type checking. All source files use `.ts` and `.tsx` extensions, providing type safety during development and catching errors at compile time rather than runtime.

## Build Tool

**Vite 5.0.8** handles bundling, development server, and production builds. The build process is configured in `vite.config.ts` with the React plugin (`@vitejs/plugin-react` v4.2.1) to enable JSX transformation and fast refresh during development.

The build script runs TypeScript compilation before Vite bundling:
```
"build": "tsc && vite build"
```

Development is initiated with `vite dev`, which provides hot module replacement for rapid iteration.

## Routing

**React Router DOM 6.21.1** manages client-side navigation and URL-based routing. This enables multi-page application behavior within a single-page application structure, allowing users to navigate between different views while maintaining application state.

For detailed routing configuration, see [Application Routes](./application-routes.md).

## Component Library

**shadcn/ui** provides a collection of accessible, customizable UI components built on top of Radix UI primitives. The project includes the following Radix UI dependencies:

| Component | Version | Purpose |
|-----------|---------|---------|
| @radix-ui/react-avatar | 1.0.4 | User profile images |
| @radix-ui/react-checkbox | 1.0.4 | Checkbox form inputs |
| @radix-ui/react-dialog | 1.0.5 | Modal dialogs |
| @radix-ui/react-dropdown-menu | 2.0.6 | Dropdown menus |
| @radix-ui/react-label | 2.0.2 | Form labels |
| @radix-ui/react-progress | 1.0.3 | Progress indicators |
| @radix-ui/react-radio-group | 1.1.3 | Radio button groups |
| @radix-ui/react-select | 2.0.0 | Select dropdowns |
| @radix-ui/react-slot | 1.0.2 | Slot composition utility |
| @radix-ui/react-tabs | 1.0.4 | Tabbed interfaces |
| @radix-ui/react-toast | 1.1.5 | Toast notifications |

These primitives are wrapped by shadcn/ui components to provide consistent styling and behavior across the application. See [UI Components](./ui-components.md) for component usage details.

## Styling

**Tailwind CSS 3.4.1** provides utility-first CSS for styling. Tailwind is configured with PostCSS (8.4.33) and Autoprefixer (10.4.16) for vendor prefix handling.

Supporting styling utilities include:
- **tailwind-merge** (2.2.0): Intelligently merges Tailwind class names to prevent conflicts
- **tailwindcss-animate** (1.0.7): Animation utilities extending Tailwind's animation capabilities
- **class-variance-authority** (0.7.0): Type-safe component variant management
- **clsx** (2.1.0): Conditional class name concatenation

For styling architecture and theming approach, see [Styling and Theming](./styling-theming.md).

## Icons

**Lucide React 0.309.0** provides a comprehensive icon library as React components. Icons are imported directly and rendered as components, enabling consistent icon usage throughout the application with support for sizing, color, and animation props.

## Development Tools

| Tool | Version | Purpose |
|------|---------|---------|
| TypeScript | 5.2.2 | Static type checking |
| ESLint | 8.55.0 | Code linting and quality |
| @typescript-eslint/parser | 6.14.0 | TypeScript support for ESLint |
| @typescript-eslint/eslint-plugin | 6.14.0 | TypeScript-specific linting rules |
| eslint-plugin-react-hooks | 4.6.0 | React Hooks best practices |
| eslint-plugin-react-refresh | 0.4.5 | Vite React refresh validation |
| @types/react | 18.2.43 | React type definitions |
| @types/react-dom | 18.2.17 | React DOM type definitions |
| @types/node | 20.11.0 | Node.js type definitions |

## Module Resolution

Vite is configured with a path alias for cleaner imports:

```
"@": path.resolve(__dirname, "./src")
```

This allows imports like `import { Component } from "@/components/Component"` instead of relative paths, improving code readability and maintainability.

## Package Configuration

The project is configured as an ES module (`"type": "module"` in package.json), enabling modern JavaScript import/export syntax throughout the codebase.

> **Note:** The technology stack is optimized for a modern development environment. Specific version constraints and compatibility requirements should be verified in `package.json` when setting up the development environment. See [Development Setup](./development-setup.md) for installation instructions.