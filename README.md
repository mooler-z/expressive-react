<picture>
  <source media="(prefers-color-scheme: dark)" srcset="public/logo-dark.svg">
  <img src="public/logo.svg" alt="Expressive React logo" width="88" height="88">
</picture>

# Expressive React

**[Docs](https://expressive-react.moolerz.et)** · **[npm](https://www.npmjs.com/package/expressive-react)** · **[Blocks](https://expressive-react.moolerz.et/blocks)** · **[Theme builder](https://expressive-react.moolerz.et/themes)** · registry: `https://expressive-react.moolerz.et/r/{name}.json`

Material 3 Expressive components for React, built on React Aria Components and Tailwind CSS v4. Use it two ways: copy the components into your project with the shadcn CLI and own the code, or install the `expressive-react` npm package and update it like any dependency.

## Install

Requires React 18+ and Tailwind CSS v4.

**1. Point the shadcn CLI at the registry** in `components.json`. Run `npx shadcn init` first if you don't have one.

```json
{
  "registries": {
    "@expressive": "https://expressive-react.moolerz.et/r/{name}.json"
  }
}
```

**2. Add the foundation, then any components you want:**

```bash
npx shadcn add @expressive/init
npx shadcn add @expressive/button @expressive/dialog @expressive/switch
```

**3. Import the theme** right after Tailwind in your main CSS file:

```css
@import "tailwindcss";
@import "./styles/expressive.css";
```

**4. Load the fonts** (Roboto Flex and Material Symbols Rounded):

```html
<link
  href="https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght@8..144,100..1000&family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
  rel="stylesheet"
/>
```

**5. Wrap your app:**

```tsx
import { ThemeProvider } from "@/components/ui/theme-provider"

<ThemeProvider defaultMode="system" defaultSeed="#6750A4" defaultVariant="expressive">
  <App />
</ThemeProvider>
```

## Or install from npm

The same components are published as the [`expressive-react`](https://www.npmjs.com/package/expressive-react) package: one entry point per component, ESM with types, `"use client"` kept.

```bash
npm i expressive-react
```

```css
@import "tailwindcss";
@import "expressive-react/styles.css"; /* also registers the package as a Tailwind source */
```

```tsx
import { Button } from "expressive-react/button"
import { ThemeProvider } from "expressive-react/theme-provider"
```

## Usage

```tsx
<Button variant="filled" size="md">
  <Icon>add</Icon>
  Create
</Button>

<DialogTrigger>
  <Button variant="tonal">Reset</Button>
  <Dialog>
    <DialogIcon>restart_alt</DialogIcon>
    <DialogHeadline>Reset settings?</DialogHeadline>
    <DialogBody>Your preferences return to their defaults.</DialogBody>
    <DialogActions>
      <Button variant="text" slot="close">Cancel</Button>
      <Button variant="text" slot="close">Reset</Button>
    </DialogActions>
  </Dialog>
</DialogTrigger>
```

## Theming

Color roles are CSS variables (`--md-primary`, `--md-surface-container-high`, …) mapped to Tailwind colors (`bg-primary`, `text-on-surface-variant`, `bg-on-surface/10`). There are two ways to change them:

- **Statically:** edit the values in `expressive.css`.
- **Dynamically:** pass `defaultSeed`, or call `useTheme().setSeed("#0B57D0")`. A full light and dark scheme is generated with the M3 2025 color spec. Available variants: `tonalSpot`, `vibrant`, `expressive`, `fidelity`, `content`, `neutral`, `monochrome`, `rainbow` and `fruitSalad`.

## What's included

**73 components:** accordion · alert · alert-dialog · app-bar · aspect-ratio · attachment · avatar · badge · breadcrumb · button · button-group · calendar · card · carousel · chart · checkbox · chip · code-block · combobox · command · context-menu · data-table · date-field · date-picker · dialog · direction · divider · empty-state · fab · field · icon · icon-button · input-group · input-otp · kbd · list · loading-indicator · marker · menu · menubar · message · message-scroller · navigation-bar · navigation-drawer · navigation-menu · navigation-rail · pagination · popover · progress · questionnaire · radio · resizable · reveal · ripple · scroll-area · search · select · shape · sheet · sidebar · skeleton · slider · snackbar · switch · table · tabs · text-field · theme-provider · time-picker · toast · toolbar · tooltip · trace

**Hooks:** use-drag-scroll · use-magnetic · use-media-query · use-motion · use-press-scale · use-tilt · use-window-size-class

**97 blocks** (install any of them with `npx shadcn add @expressive/<name>`): full templates (`landing`, `landing-v1`, `landing-v3`, 10 `landing-*` variants, `admin-dashboard`, `dashboard-kit`, `incidents-app`), page sections (`marketing-*`), dashboard widgets (`kpi-cards`, chart galleries, `chart-states`…), M3 canonical layouts (`list-detail-layout`, `supporting-pane-layout`, `feed-layout`, `pane-layout`, `adaptive-scaffold`), and app blocks: auth (`login-*`, `signup-*`, `reset-*`, `two-factor-*`, `verify-*`), settings (`profile-settings-*`, `members-settings-*`, `notifications-*`, `integrations-*`), shell (`app-shell-*`, `sidebar-block-*`), data (`dashboard-*`, `data-table-block-*`, `stats-*`, `chart-card-*`) and people (`invite-user-*`, `user-profile-*`, `member-list-*`).

The docs site mirrors the original kit page by page: Components, Landing (+ v1, v3, variants), Dashboard (Admin), Dashboard kit, Blocks and Layouts.

## Develop

```bash
pnpm install
pnpm dev             # playground
pnpm registry:build  # → public/r/*.json
pnpm build
```

See `CLAUDE.md` for conventions and how to add a component.
