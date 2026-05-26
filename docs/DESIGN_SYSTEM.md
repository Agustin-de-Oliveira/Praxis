# Design System

**Last updated:** 2026-05-25 | → [PROJECT_INDEX.md](./PROJECT_INDEX.md)

---

## Status

**Transitional.** This document describes the current implementation, but it is no longer the creative north star for Praxis.

The current "Obsidian & Steel" system: serif editorial headings, excessive monospace labels, copper accents, dark cards, very low-opacity text, and uppercase tracking as decoration. Future work should follow [REALIGNMENT_PLAN.md](./REALIGNMENT_PLAN.md) and treat this file as a compatibility reference until the visual system is replaced.

---

## Overview

Praxis currently uses an **Obsidian & Steel** design language — dark, sharp, and technical. This is legacy context, not a mandate for new work.

All design tokens are defined in `app/globals.css` using Tailwind CSS v4's `@theme` directive.

---

## Color Palette

### Core

| Token                      | Value     | Usage                                    |
| -------------------------- | --------- | ---------------------------------------- |
| `--color-background`       | `#050505` | Page background (Obsidian)               |
| `--color-foreground`       | `#FFFFFF` | Primary text                             |
| `--color-card`             | `#0A0A0A` | Card and panel backgrounds               |
| `--color-card-foreground`  | `#FAFAFA` | Text on cards                            |
| `--color-muted`            | `#0F0F0F` | Muted backgrounds (inputs, hover states) |
| `--color-muted-foreground` | `#737373` | Secondary/disabled text                  |

### Brand & Accents

| Token                          | Value     | Usage                                     |
| ------------------------------ | --------- | ----------------------------------------- |
| `--color-copper`               | `#a86f44` | Legacy brand accent (Amber)               |
| `--accent`                     | Dynamic   | Current user-selected system accent color |
| `--color-accent`               | `#94A3B8` | Steel blue — technical UI accents         |
| `--color-steel-dim`            | `#2d3f44` | Dim steel (subtle borders, active states) |
| `--color-primary`              | `#FFFFFF` | Primary action color                      |
| `--color-primary-foreground`   | `#050505` | Text on primary buttons                   |
| `--color-secondary`            | `#0F0F0F` | Secondary buttons/surfaces                |
| `--color-secondary-foreground` | `#94A3B8` | Text on secondary elements                |

### System Accents (Customizable)

Users can select from the following palette in **Settings.exe**:

- **Amber**: `#a86f44` (Default)
- **Blue**: `#3b82f6`
- **Emerald**: `#10b981`
- **Rose**: `#f43f5e`
- **Purple**: `#8b5cf6`
- **Slate**: `#64748b`

### Borders & Inputs

| Token             | Value     | Usage                        |
| ----------------- | --------- | ---------------------------- |
| `--color-border`  | `#171717` | Default borders              |
| `--color-input`   | `#0F0F0F` | Input backgrounds            |
| `--color-ring`    | `#94A3B8` | Focus rings                  |
| `--color-popover` | `#0A0A0A` | Dropdown/popover backgrounds |

### Semantic

| Token             | Value     | Usage                        |
| ----------------- | --------- | ---------------------------- |
| `--color-error`   | `#991B1B` | Error states (desaturated)   |
| `--color-success` | `#065F46` | Success states (desaturated) |
| `--color-warning` | `#854D0E` | Warning states (desaturated) |
| `--color-info`    | `#1E293B` | Info states                  |

### Scenario Difficulty

| Token                  | Value     | Difficulty   |
| ---------------------- | --------- | ------------ |
| `--color-beginner`     | `#1E293B` | Beginner     |
| `--color-intermediate` | `#065F46` | Intermediate |
| `--color-advanced`     | `#475569` | Advanced     |
| `--color-expert`       | `#7F1D1D` | Expert       |

---

## Typography

### Fonts

New work should prefer restrained sans-serif UI typography. Monospace is reserved for code, terminal output, logs, file paths, ids, timestamps, and machine text. Serif should not be used as the default marker of importance or premium tone.

| Role      | Font           | Variable       | Usage                                          |
| --------- | -------------- | -------------- | ---------------------------------------------- |
| **Serif** | Noto Serif     | `--font-serif` | H1, H2, editorial headings, accents            |
| **Sans**  | Inter          | `--font-sans`  | Body text, UI labels, paragraphs               |
| **Mono**  | JetBrains Mono | `--font-mono`  | Code blocks, terminal output, technical labels |

Fonts are loaded via `next/font` in `app/layout.tsx` and injected as CSS variables.

### Type Scale (Tailwind defaults)

```
text-xs   → 12px — captions, badges, metadata
text-sm   → 14px — secondary UI text, table content
text-base → 16px — body text
text-lg   → 18px — large body, card headings
text-xl   → 20px — section headings
text-2xl  → 24px — page sub-headings
text-3xl  → 30px — page headings
text-4xl+ → 36px+ — hero text (Noto Serif)
```

---

## Spacing & Layout

### Border Radius

| Token         | Value            | Usage                                           |
| ------------- | ---------------- | ----------------------------------------------- |
| `--radius-sm` | `0.125rem (2px)` | Buttons, inputs, cards — sharp, engineered feel |
| `--radius-md` | `0.25rem (4px)`  | Moderate rounding                               |
| `--radius-lg` | `0.5rem (8px)`   | Larger containers, modals                       |

Praxis defaults to `rounded-sm` everywhere. Avoid `rounded-full` except for avatars.

### Surfaces

```
Background:   #050505   (page)
Surface 1:    #0A0A0A   (.bg-surface / card)
Surface 2:    #121212   (.bg-surface-hover / row hover)
Border:       #171717   (card borders)
```

---

## Animations

All animations are defined in `globals.css`.

### Named Utilities

| Class               | Effect                               | Duration                  |
| ------------------- | ------------------------------------ | ------------------------- |
| `.cursor-blink`     | Terminal cursor blink                | 1s step-end infinite      |
| `.typing-dot`       | Bouncing typing indicator dots       | 1.4s ease-in-out infinite |
| `.status-pulse`     | Pulsing status indicator             | 2s ease-out infinite      |
| `.icon-spin`        | 360° rotation (loading spinner)      | 2s linear infinite        |
| `.underline-reveal` | Animated underline on hover          | 0.3s ease-out             |
| `.interactive`      | Scale + opacity on active            | 200ms transition          |
| `.row-hover`        | Background color transition on hover | 150ms                     |
| `.card-hover`       | Border color transition on hover     | 300ms                     |

### Dialog / Modal Animations

Entry/exit animations use composable `@utility` classes:

```css
animate-in + fade-in-0 + zoom-in-95     → Fade + scale in (200ms ease-out)
animate-out + fade-out-0 + zoom-out-95  → Fade + scale out (150ms ease-in)
animate-in + slide-in-from-bottom-4     → Slide up from bottom (200ms)
```

### Checkbox Animation

Custom `checkmark-pop` keyframe: scale from 0 + rotate -45° → scale 1 + rotate 0°. Applied via `checkbox-indicator-animate` utility.

```css
@keyframes checkmark-pop {
  from {
    transform: scale(0) rotate(-45deg);
    opacity: 0;
  }
  to {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}
```

### Page-Level Animations

Framer Motion is used for:

- Scenario board modal open/close
- Landing page section reveals

### OS Window Interactions

The Workspace uses a windowed orchestrator:

- **Focus**: Clicking a window brings it to the front and highlights its title bar.
- **Draggable**: Windows are draggable via the `WindowFrame` title bar.
- **Contextual Initiation**: New files (like mission briefs) manifest on the desktop only after a "Save As" event.
- **Gated State**: IDE functionality is gated behind terminal operations (`git clone`).

---

## Scrollbar

Custom thin scrollbar across the entire app:

- **Width:** 6px horizontal, 6px vertical
- **Track:** Transparent
- **Thumb:** `#333333` (increased for visibility), hover: `#444444`
- **Firefox:** `scrollbar-color: #333333 transparent; scrollbar-width: thin`

---

## Component Conventions

### Cards

```tsx
// Standard card
<div className="bg-card border border-border rounded-sm p-4">
  ...
</div>

// Hoverable card
<div className="bg-card border border-border rounded-sm p-4 card-hover">
  ...
</div>
```

### Text Hierarchy

```tsx
// Primary heading
<h1 className="font-serif text-4xl text-foreground">

// Section heading
<h2 className="font-sans text-xl font-semibold text-foreground">

// Secondary text
<p className="text-sm text-muted-foreground">

// Copper accent text
<span className="text-copper font-mono text-xs">
```

### Badges / Difficulty Pills

```tsx
// Use the difficulty color tokens
<span className="bg-intermediate/20 text-intermediate text-xs px-2 py-0.5 rounded-sm">
  Intermediate
</span>
```

### Status Indicators

```tsx
// Live/active status
<span className="status-pulse w-1.5 h-1.5 rounded-full bg-success" />

// Completed
<span className="w-1.5 h-1.5 rounded-full bg-accent" />
```

---

## Do / Don't

| Do                                                | Don't                                     |
| ------------------------------------------------- | ----------------------------------------- |
| Use `rounded-sm` (2px) as default                 | Use `rounded-full` on non-avatar elements |
| Use copper (`#a86f44`) sparingly for key CTAs     | Use copper as a background color          |
| Keep hover states subtle (12px surface shift)     | Use bright hover colors                   |
| Use JetBrains Mono for all code and terminal text | Mix monospace fonts                       |
| Desaturate semantic colors (error, success)       | Use vivid red/green for status            |
| Use Framer Motion for meaningful transitions      | Animate everything                        |
| Use Noto Serif for editorial, hero headings       | Use serif for body copy                   |

---

## Open Questions

- [ ] Dark mode only? Or should we support a light mode for bootcamp/enterprise customers?
- [ ] Is copper the right accent, or should we explore a cooler option (teal, indigo)?
- [ ] Standardize all icon usage — Phosphor vs. Lucide overlap needs cleanup
