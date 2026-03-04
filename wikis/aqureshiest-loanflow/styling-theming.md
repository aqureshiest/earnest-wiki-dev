---
title: Styling and Theming
description: guide documentation
---

<div style="border-bottom: 1px solid var(--vp-c-divider); padding-bottom: 1rem; margin-bottom: 2rem;">
  <h1 style="margin-bottom: 0.5rem;">Styling and Theming</h1>
  <div style="display: flex; gap: 1rem; flex-wrap: wrap; font-size: 0.9rem; color: var(--vp-c-text-2);">
    <span style="display: flex; align-items: center; gap: 0.25rem;">
      📖 <strong>Guide</strong>
    </span>
    <span style="display: flex; align-items: center; gap: 0.25rem;">
      📝 <strong>725</strong> words
    </span>
    <span style="display: flex; align-items: center; gap: 0.25rem;">
      ⏱️ <strong>4</strong> min read
    </span>
  </div>
</div>

LoanFlow uses **Tailwind CSS** as its primary styling framework, combined with **shadcn/ui** components built on Radix UI primitives. The styling system is configured around a slate-based color scheme with CSS variables for dynamic theming support, including light and dark modes.

## Tailwind CSS Configuration

Tailwind CSS is configured in `tailwind.config.js` with the following key settings:

- **Dark mode**: Class-based dark mode support (`darkMode: ["class"]`)
- **Content scanning**: Processes all HTML, JS, TS, JSX, and TSX files in `./src/`
- **Container**: Centered with 2rem padding, with a 2xl breakpoint at 1400px
- **Animation plugin**: Uses `tailwindcss-animate` for smooth transitions

The configuration extends Tailwind's default theme with custom color tokens and border radius utilities that reference CSS variables defined in the design system.

## Color Scheme and CSS Variables

The design system uses **HSL-based CSS variables** for all colors, enabling consistent theming across light and dark modes. These variables are defined in `src/index.css` and referenced throughout the Tailwind configuration.

### Light Mode (Default)

| Token | Value | Purpose |
|-------|-------|---------|
| `--primary` | 222.2 47.4% 11.2% | Primary action color (dark slate) |
| `--secondary` | 210 40% 96.1% | Secondary UI elements (light gray) |
| `--accent` | 210 40% 96.1% | Accent highlights |
| `--destructive` | 0 84.2% 60.2% | Error and destructive actions (red) |
| `--muted` | 210 40% 96.1% | Disabled or secondary text |
| `--background` | 0 0% 100% | Page background (white) |
| `--foreground` | 222.2 84% 4.9% | Primary text (dark slate) |
| `--border` | 214.3 31.8% 91.4% | Border colors |
| `--ring` | 222.2 84% 4.9% | Focus ring color |

### Dark Mode

Dark mode inverts the color scheme by applying the `.dark` class to the root element:

- **Background**: Switches to dark slate (222.2 84% 4.9%)
- **Foreground**: Switches to light (210 40% 98%)
- **Primary**: Inverted to light for contrast
- **Secondary/Accent**: Adjusted to mid-tone slate (217.2 32.6% 17.5%)
- **Destructive**: Darkened red (0 62.8% 30.6%)

All color tokens maintain semantic meaning across both modes while ensuring sufficient contrast and readability.

## Tailwind Color Tokens

The Tailwind configuration extends the default theme with semantic color tokens that map to CSS variables:

```javascript
colors: {
  border: "hsl(var(--border))",
  input: "hsl(var(--input))",
  ring: "hsl(var(--ring))",
  background: "hsl(var(--background))",
  foreground: "hsl(var(--foreground))",
  primary: { DEFAULT, foreground },
  secondary: { DEFAULT, foreground },
  destructive: { DEFAULT, foreground },
  muted: { DEFAULT, foreground },
  accent: { DEFAULT, foreground },
  popover: { DEFAULT, foreground },
  card: { DEFAULT, foreground },
}
```

Each semantic color includes both a default color and a foreground variant for text/content placed on that background. This enables consistent contrast and readability.

## Border Radius System

Border radius is configured with a base `--radius` variable (0.5rem) and three utility sizes:

- `lg`: `var(--radius)` — Full configured radius
- `md`: `calc(var(--radius) - 2px)` — Slightly reduced
- `sm`: `calc(var(--radius) - 4px)` — Minimal rounding

This allows consistent, scalable corner rounding across components.

## Radix UI and shadcn/ui Integration

LoanFlow uses **shadcn/ui** as a component library, which provides unstyled Radix UI primitives pre-styled with Tailwind CSS. The integration is configured in `components.json`:

```json
{
  "style": "default",
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/index.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

**Key configuration details:**

- **Base color**: Slate — determines the default color palette for shadcn/ui components
- **CSS variables**: Enabled — components use the HSL variables defined in `src/index.css`
- **Component alias**: `@/components` — shadcn/ui components are installed to the `components` directory
- **Utils alias**: `@/lib/utils` — utility functions (e.g., `cn()` for class merging) are located in `lib/utils`

This setup means all shadcn/ui components automatically respect the light/dark mode toggle and color scheme without additional configuration.

## Accordion Animations

Custom Radix UI accordion animations are defined in the Tailwind configuration:

```javascript
keyframes: {
  "accordion-down": {
    from: { height: "0" },
    to: { height: "var(--radix-accordion-content-height)" },
  },
  "accordion-up": {
    from: { height: "var(--radix-accordion-content-height)" },
    to: { height: "0" },
  },
}
```

These animations use Radix UI's exposed CSS variables (`--radix-accordion-content-height`) to smoothly expand and collapse accordion content over 0.2 seconds.

## Base Styling

Global base styles are applied in `src/index.css`:

- All elements inherit the `--border` color for consistent borders
- The `body` element applies `--background` and `--foreground` for page-level styling
- The `@layer base` directive ensures these styles have appropriate cascade priority

## Design System Approach

The styling system follows a **token-based design** where:

1. **CSS variables** define semantic color meanings (primary, secondary, destructive, etc.)
2. **Tailwind configuration** maps these variables to utility classes
3. **shadcn/ui components** consume these utilities automatically
4. **Dark mode** is implemented by redefining variables under the `.dark` class selector

This approach decouples component styling from specific color values, making theme changes and dark mode support straightforward without modifying component code.

> **Note**: The current implementation provides light and dark mode support through CSS variables and class-based dark mode. Custom styling patterns beyond the shadcn/ui component library are not evident in the provided configuration files. Component-specific styling would be found in individual component files within the `src/components` directory.

## Related Documentation

- [UI Components](./ui-components.md) — Component library and usage patterns
- [Technology Stack](./tech-stack.md) — Overview of Tailwind CSS and shadcn/ui in the project
- [Development Setup](./development-setup.md) — Environment configuration for styling tools