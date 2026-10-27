# expressive-react

Material 3 Expressive components for React: shape-morphing buttons, springy motion and dynamic color. Built on [React Aria Components](https://react-spectrum.adobe.com/react-aria/) and [Tailwind CSS v4](https://tailwindcss.com).

**Docs:** https://expressive-react.moolerz.et

There are two ways to use it:

- **npm (this package):** install once, update with your package manager.
- **Copy the source** with the shadcn CLI (`npx shadcn add @expressive/button`) when you want to own and edit the code. See [the registry docs](https://expressive-react.moolerz.et/docs/registry).

## Install

Requires React 19 and Tailwind CSS 4.1+.

```bash
npm i expressive-react
```

Import the theme in your main CSS file, right after Tailwind:

```css
@import "tailwindcss";
@import "expressive-react/styles.css";
```

That stylesheet also tells Tailwind to scan the package, so you don't need an `@source` line.

Load the fonts (Roboto Flex and Material Symbols Rounded):

```html
<link
  href="https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght@8..144,100..1000&family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
  rel="stylesheet"
/>
```

Wrap your app:

```tsx
import { ThemeProvider } from "expressive-react/theme-provider"

<ThemeProvider defaultMode="system" defaultSeed="#6750A4">
  <App />
</ThemeProvider>
```

## Use

Import each component from its own entry point for the smallest bundles:

```tsx
import { Button } from "expressive-react/button"
import { Icon } from "expressive-react/icon"
import { Dialog, DialogActions, DialogHeadline, DialogTrigger } from "expressive-react/dialog"

<Button icon={<Icon name="add" />}>Create</Button>
```

Everything is also re-exported from the root (`import { Button, Switch } from "expressive-react"`).

Each component's entry point is named after its docs page: `expressive-react/<name>` matches https://expressive-react.moolerz.et/docs/<name>. Hooks follow the same pattern (`expressive-react/use-window-size-class`), and `cn` / `tv` come from `expressive-react/utils`.

Components are client components (`"use client"`), so they work in Next.js App Router and other React Server Components setups.

## Theming

Color roles are CSS variables (`--md-primary`, `--md-surface-container-high`, …) mapped to Tailwind colors (`bg-primary`, `text-on-surface-variant`). Pass a `defaultSeed` to generate a full light and dark scheme with Google's 2025 color spec, or override the variables after the import. The [theme builder](https://expressive-react.moolerz.et/themes) exports ready-made CSS.

## License

MIT
