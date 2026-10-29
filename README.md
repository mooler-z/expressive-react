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

Color roles are CSS variables (`--md-primary`, `--md-surface-container-high`, …) mapped to Tailwind colors (`bg-primary`, `text-on-surface-variant`, `bg-on-surface/10`). There are three ways to change them:

- **Statically:** edit the values in `expressive.css`.
- **Dynamically:** pass `defaultSeed`, or call `useTheme().setSeed("#0B57D0")`. A full light and dark scheme is generated with the M3 2025 color spec. Available variants: `tonalSpot`, `vibrant`, `expressive`, `fidelity`, `content`, `neutral`, `monochrome`, `rainbow` and `fruitSalad`.
- **With a preset:** `defaultPreset="campus"` sets color, surfaces, type, shape and elevation in one go (below).

### Scrollbars

`expressive.css` gives every scrollable area M3 Expressive scrollbars: no track, a pill thumb in `on-surface-variant` that firms up on hover, grows under the pointer and turns primary while dragged. `no-scrollbar` hides one. Firefox gets a thin bar in the same colors through `scrollbar-width`/`scrollbar-color`, gated behind `@supports not selector(::-webkit-scrollbar)` because Chromium ignores the `::-webkit-scrollbar` rules on any element that sets either property. Don't add `[scrollbar-width:thin]` to your own containers.

### Theme presets

42 complete looks, each with hand-tuned canvas, card and hairline tones for light and dark, a typeface, a corner scale and an elevation style. Every preset passes WCAG AA (4.5:1 text, 3:1 outlines) in both modes; `pnpm test` checks it. Browse them in the [preset gallery](https://expressive-react.moolerz.et/themes/presets).

```tsx
<ThemeProvider defaultPreset="campus">
  <App />
</ThemeProvider>

const { preset, setPreset, presets } = useTheme()
setPreset("midnight") // or null for the defaults

<ThemeScope preset="paper" mode="dark">…</ThemeScope>
```

| Preset | Character | Seed · variant |
| --- | --- | --- |
| Quiet (`quiet`) | Calm neutral grays, one indigo accent and hairline edges. For tools that should get out of the way. | `#5B5BD6` · rainbow |
| Paper (`paper`) | Cream pages, ink-dark type in a reading serif and a brick-red accent. Editorial and unhurried. | `#A23B24` · content |
| Navy (`navy`) | Deep navy on cool gray, set in IBM Plex. Steady, buttoned-up enterprise. | `#1F3A8A` · fidelity |
| Forest (`forest`) | Pine greens with a lake-blue counterpoint on softly green-tinted surfaces. | `#2E6B3F` · content |
| Terracotta (`terracotta`) | Fired-clay orange on warm plaster with a cool teal counterpoint. Rounded and friendly. | `#C4572F` · fidelity |
| Sunset (`sunset`) | Vivid coral running into magenta on glowing peach surfaces. Loud in the best way. | `#F25C3A` · vibrant |
| Ocean (`ocean`) | Saturated cyan and deep-water blues on airy, sea-tinted surfaces. | `#0891B2` · vibrant |
| Lavender (`lavender`) | Soft violet on a lavender canvas with white cards. Gentle, airy and round. | `#8C7AE6` · vibrant |
| Ink (`ink`) | Black, white and nothing else, at medium contrast. Sharp corners, hairline edges, Archivo. | `#000000` · monochrome · contrast 0.5 |
| Mint (`mint`) | Fresh mint greens and white cards on a cool, clean canvas. | `#2BB673` · tonalSpot |
| Rosé (`rose`) | Dusty rose and mauve on blush-tinted surfaces. Quietly elegant. | `#B4536A` · tonalSpot |
| Dune (`dune`) | Sand and sun-baked ochre with olive in the shade. Warm and grounded. | `#A8692A` · tonalSpot |
| Midnight (`midnight`) | Dark-first: periwinkle on blue-black, Space Grotesk and crisp edges. Light mode keeps the cool tint. | `#7C8CFF` · vibrant |
| Sakura (`sakura`) | Cherry-blossom pink with a fresh leaf-green accent on blush white. Soft and round. | `#E8789E` · content |
| Meskel (`meskel`) | Ethiopian-inspired: highland green and Meskel-daisy gold, with red kept for errors. Renders Ge'ez script. | `#078930` · fidelity |
| Graphite (`graphite`) | A pro dashboard: graphite neutrals, an amber signal color, sharp corners and dense Geist type. | `#E0A100` · rainbow |
| Candy (`candy`) | Bubblegum pink and aqua with big round corners and Fredoka. Unapologetically playful. | `#FF4FA3` · vibrant |
| Frost (`frost`) | Nordic: muted steel blue on icy gray, and a slate dark mode instead of black. | `#5E81AC` · tonalSpot |
| Espresso (`espresso`) | Roasted browns on a crema canvas; a cozy dark roast at night. | `#6F4E37` · tonalSpot |
| Campus (`campus`) | A crisp school theme: royal blue and school-bus yellow, white cards on a light-blue canvas, Lexend for easy reading. | `#1D4ED8` · fidelity |
| Henon (`henon`) | The Henon school app: light-blue canvas, white cards with hairline borders, navy ink, Inter and small corners. | `#0074FF` · fidelity |
| Pulse (`pulse`) | Plain Material 3 Expressive in a bright cobalt: generated tonal surfaces, Roboto Flex and the full M3 corner scale. | `#1D4AFF` · fidelity |
| Olive Garden (`olive-garden`) | Olive and deep moss with caramel and burnt-orange accents on a cream canvas. Earthy and warm. Coolors: *Olive Garden Feast*. | `#606C38` · fidelity |
| Fiery Ocean (`fiery-ocean`) | Crimson on a cream canvas with navy and steel-blue counterpoints; at night the canvas turns deep-ocean navy. Coolors: *Fiery Ocean*. | `#C1121F` · fidelity |
| Pastel Dreamland (`pastel-dreamland`) | Lilac, candy pink and baby blue on an airy lilac-white canvas, with Quicksand and big soft corners. Coolors: *Pastel Dreamland Adventure*. | `#CDB4DB` · fidelity |
| Sunny Beach (`sunny-beach`) | Sea-green teal with saffron and burnt-sienna accents on warm sand; the dark mode is deep slate-teal. Coolors: *Sunny Beach Day*. | `#2A9D8F` · fidelity |
| Purple Raindrops (`purple-raindrops`) | Electric violet running from magenta to cyan, on cool violet-tinted surfaces and a deep indigo night. Coolors: *Purple Raindrops*. | `#7209B7` · fidelity |
| Black & Gold (`black-gold`) | Black-navy and gold on ivory, set in art-deco Josefin Sans with sharp corners; at night, gold on true black. Coolors: *Black & Gold Elegance*. | `#14213D` · fidelity |
| Neutral Earth (`neutral-earth`) | Slate charcoal and latte on a greige canvas, with umber in the shadows. Calm, natural and grown-up. Coolors: *Neutral Earth Tones*. | `#22333B` · fidelity |
| Enchanted Forest (`enchanted-forest`) | Misty sage and pine-teal over a sage-white canvas; the night mode is a soft slate instead of black. Coolors: *Enchanted Forest Night*. | `#51796F` · fidelity |
| Soft Lavender (`soft-lavender`) | Dusk: slate indigo with mauve and rosy beige, on a warm blush canvas. Quiet and romantic. Coolors: *Soft Lavender*. | `#4A4E69` · fidelity |
| Summer Fun (`summer-fun`) | Tangerine and amber on a sky-blue canvas with ocean-blue accents; a deep navy night. Bright and energetic. Coolors: *Refreshing Summer Fun*. | `#FC8500` · fidelity |
| Monochrome Harmony (`monochrome-harmony`) | Charcoal on pale celery paper with one sunflower highlight for selection and emphasis. Crisp and editorial. Coolors: *Monochrome Harmony*. | `#242423` · monochrome |
| Moonlit Forest (`moonlit-forest`) | Aubergine and dusty rose on a pale celery canvas, with sage in the undergrowth. Set in Lora. Coolors: *Mystic Moonlit Forest*. | `#51344D` · fidelity |
| Dark Sunset (`dark-sunset`) | Slate teal with mustard and maroon on a butter-yellow canvas; at night everything sinks into maroon-black. Coolors: *Dark Sunset*. | `#335C67` · fidelity |
| Watermelon Sorbet (`watermelon-sorbet`) | Watermelon pink with a mint-rind green and lemon sorbet, on a cool mint-white canvas; deep teal at night. Coolors: *Watermelon Sorbet*. | `#EF466F` · fidelity |
| Cherry Crush (`cherry-crush`) | All cherries: crimson to black-cherry reds on a blush canvas, and a wine-dark night. Bold and romantic. Coolors: *Cherry Crush*. | `#A41D30` · fidelity |
| Luminous Glow (`luminous-glow`) | Dark-first neon: lime-to-aqua glow on near-black, Chakra Petch and sharp edges. Light mode keeps the lime. Coolors: *Luminous Glow*. | `#C2F260` · fidelity |
| Vintage Charm (`vintage-charm`) | Bottle green and burnt orange on parchment, set in Fraunces; ink-blue at night. Like an old botanical print. Coolors: *Vintage Charm*. | `#183A37` · fidelity |
| Daybreak (`daybreak`) | Indigo and periwinkle giving way to a sunrise of amber and orange, on a warm white canvas. Coolors: *Colorful Daybreak*. | `#3E348B` · fidelity |
| Rustic Charm (`rustic-charm`) | Charcoal and stone on warm off-white with a single flame-orange accent. A workshop look, in Barlow. Coolors: *Rustic Charm*. | `#3F3D39` · fidelity |
| Color Blast (`color-blast`) | Cerulean with raspberry and marigold. Confident, saturated and a little loud, in Montserrat. Coolors: *Vibrant Color Blast*. | `#016BA6` · fidelity |

Henon and Pulse are the two looks of the Henon Pulse app. The last 20 rows are palette inspired by [coolors.co trending palettes](https://coolors.co/palettes/trending): seeds, accents, canvases and swatches are the palettes' own colors.

Let users choose with `AppearancePicker` (looks plus light / system / dark). `ThemeProvider` mirrors the active preset on `<html data-preset>` for preset-specific CSS.

A preset is a plain object (`ThemePreset`): pass your own to `ThemeScope`, or list it in `ThemeProvider`'s `presets` prop. Font stylesheets load only while a preset that needs them is active. `presetCss(preset)` (from `theme-presets`, no `"use client"`) renders one as CSS for SSR or a static file.

## What's included

**76 components:** accordion · alert · alert-dialog · app-bar · appearance-picker · aspect-ratio · attachment · avatar · badge · breadcrumb · button · button-group · calendar · card · carousel · chart · checkbox · chip · code-block · combobox · command · context-menu · data-table · date-field · date-picker · dialog · direction · divider · empty-state · fab · field · icon · icon-button · input-group · input-otp · kbd · link-button · list · loading-indicator · marker · menu · menubar · message · message-scroller · navigation-bar · navigation-drawer · navigation-menu · navigation-rail · pagination · popover · progress · questionnaire · radio · resizable · reveal · ripple · scroll-area · search · select · shape · sheet · sidebar · skeleton · slider · snackbar · switch · table · tabs · text-field · theme-presets · theme-provider · time-picker · toast · toolbar · tooltip · trace

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
