---
title: UI Components
description: reference documentation
---

<div style="border-bottom: 1px solid var(--vp-c-divider); padding-bottom: 1rem; margin-bottom: 2rem;">
  <h1 style="margin-bottom: 0.5rem;">UI Components</h1>
  <div style="display: flex; gap: 1rem; flex-wrap: wrap; font-size: 0.9rem; color: var(--vp-c-text-2);">
    <span style="display: flex; align-items: center; gap: 0.25rem;">
      📚 <strong>Reference</strong>
    </span>
    <span style="display: flex; align-items: center; gap: 0.25rem;">
      📝 <strong>713</strong> words
    </span>
    <span style="display: flex; align-items: center; gap: 0.25rem;">
      ⏱️ <strong>4</strong> min read
    </span>
  </div>
</div>

## Overview

LoanFlow uses **shadcn/ui**, a collection of unstyled, accessible React components built on Radix UI primitives, combined with **Tailwind CSS** for styling. The component library is configured with a **slate color scheme** and organized in `src/components/ui/` for easy reuse across the application.

This architecture enables consistent, accessible UI patterns throughout the multi-step loan application flow while maintaining flexibility through Tailwind's utility-first approach.

## Configuration

The component library is configured via `components.json`:

| Setting | Value | Purpose |
|---------|-------|---------|
| **Base Color** | slate | Defines the default color palette for all themed components |
| **CSS Variables** | enabled | Allows dynamic theming through CSS custom properties |
| **Tailwind Config** | `tailwind.config.js` | Central configuration for spacing, colors, and animations |
| **Tailwind CSS** | `src/index.css` | Global styles and CSS variable definitions |
| **Aliases** | `@/components`, `@/lib/utils` | Simplifies import paths across the codebase |

The Tailwind configuration extends the default theme with:
- **Color tokens**: border, input, ring, background, foreground, primary, secondary, destructive, muted, accent, popover, and card
- **Border radius utilities**: lg, md, sm (calculated relative to `--radius` CSS variable)
- **Animations**: accordion-down and accordion-up for collapsible content
- **Dark mode support**: Class-based dark mode switching

## Core Components

### Buttons

The `Button` component provides a reusable, accessible button element. In practice, it is used throughout the application for primary actions (e.g., "Next" navigation in multi-step forms) and supports size and styling variants.

**Example usage** (from PersonalInfoPage):
```tsx
<Button
  size="lg"
  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-full py-6 text-lg mt-8"
  onClick={handleNext}
>
  Next
</Button>
```

### Inputs

The `Input` component is a text input field with support for various types (text, email, tel, password). It integrates with Tailwind's form styling and supports custom className overrides.

**Example usage** (from PersonalInfoPage):
```tsx
<Input
  id="email"
  name="email"
  type="email"
  value={formData.email}
  onChange={handleChange}
  className="h-12"
  required
/>
```

### Labels

The `Label` component provides accessible form labels, typically paired with inputs and other form controls.

### Selects

The `Select` component is built on Radix UI's select primitive and provides a fully accessible dropdown menu. It includes:

- **SelectTrigger**: The clickable button that opens the dropdown
- **SelectContent**: The dropdown menu container with scroll support
- **SelectItem**: Individual selectable options with checkmark indicators
- **SelectLabel**: Optional group labels for organizing options
- **SelectSeparator**: Visual dividers between option groups
- **SelectScrollUpButton** / **SelectScrollDownButton**: Navigation for long option lists

The component uses Tailwind classes for styling and includes animations for open/close states. The trigger displays a `ChevronDown` icon and supports disabled states.

### Badges

Badges are small, labeled UI elements used for categorization or status indication. While not shown in the provided code samples, they are referenced in the content guidelines as part of the standard component library.

### Toasts

Toast notifications provide non-blocking feedback to users. They are referenced in the content guidelines as a standard component but are not directly inspected in the provided codebase.

## Custom Components

### ProgressBar

The `ProgressBar` component is a custom element designed specifically for LoanFlow's multi-step application flow. It tracks and displays the user's current position within the loan application process.

**Usage** (from PersonalInfoPage):
```tsx
<ProgressBar currentStep={2} totalSteps={3} />
```

The component accepts:
- **currentStep**: The active step number (1-indexed)
- **totalSteps**: The total number of steps in the flow

In PersonalInfoPage, the progress bar shows step 2 of 3, indicating the user is on the personal information collection step. The component visually communicates progress through the application and helps users understand where they are in the multi-step process.

> **Note**: The ProgressBar implementation details are not included in the provided codebase inspection. Refer to `src/components/ProgressBar.tsx` for implementation specifics.

## Component Organization

All reusable UI components are located in `src/components/ui/`. This centralized structure enables:

- **Consistency**: All components follow the same shadcn/ui + Tailwind pattern
- **Discoverability**: Developers can easily locate and import components
- **Maintainability**: Updates to component styling or behavior are isolated to a single location

Components are imported using path aliases (e.g., `@/components/ui/button`) to keep import statements clean and readable.

## Styling and Theming

All components are styled using **Tailwind CSS utility classes** and respect the **slate color scheme** defined in the configuration. The system uses CSS custom properties (CSS variables) for theming, allowing:

- Dynamic color adjustments without modifying component code
- Consistent application of the slate palette across all components
- Support for dark mode through class-based switching

For detailed information on theming and color customization, see [Styling and Theming](./styling-theming.md).

## Related Documentation

- [Styling and Theming](./styling-theming.md) — Color scheme, CSS variables, and dark mode configuration
- [Application Architecture](./application-architecture.md) — How components fit into the overall application structure
- [Technology Stack](./tech-stack.md) — Dependencies and framework choices