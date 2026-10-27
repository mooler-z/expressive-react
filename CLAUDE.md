# Expressive React

Material 3 Expressive components for React. They're distributed the way shadcn/ui is: as a **shadcn registry**, so consumers copy the source into their own app with `npx shadcn add @expressive/<name>`. The library is used by our internal projects and is also public.

Stack: React 19 · **React Aria Components** (behavior and accessibility) · **Tailwind CSS v4** (styling) · **tailwind-variants** (variants) · CSS-first motion · `@material/material-color-utilities` (dynamic color).

## Design source of truth: `design-reference/`

`design-reference/` is a **local-only, gitignored** copy of the M3 Expressive HTML/Tailwind kit (originally `~/00workSpace/boilers/M3Expressive`). Every visual decision should come from it. If the folder is missing, recopy it from that path. Never commit it.

| Path | What it holds |
| --- | --- |
| `design-reference/Components.dc.html` | **The spec.** One `<article id="…">` per component with every state and variant as Tailwind markup. |
| `design-reference/m3/tokens.css` | Color roles (light/dark), motion easings, state-layer rules, icon rules. Already ported to `src/styles/expressive.css`. |
| `design-reference/m3/tailwind.config.js` | Type scale, shape scale, elevation, M3 breakpoints, keyframes. Already ported. |
| `design-reference/m3/shapes.js` | Shape-library math. Ported to `src/components/ui/shape.tsx`. |
| `design-reference/m3/interactions.js` | Imperative `data-*` behaviors (GSAP). **Don't port this code.** Replace each behavior with a React Aria component (see the mapping below). |
| `design-reference/m3/theme.js` | Dark mode and seed color. Ported to `theme-provider.tsx`. |
| `design-reference/Blocks *.dc.html`, `Dashboard Kit`, `Layouts`, `Landing*` | Compositions. Use them for blocks/examples later, not for primitives. |
| `design-reference/screenshots/`, `uploads/` | Visual references. |

`.dc.html` files use a template format: `{{ … }}` bindings and a `<helmet>` head. Ignore `support.js` and `_kit.js`.

Article ids in `Components.dc.html`: color typography shape elevation motion interactions icons layout buttons icon-buttons fab button-groups badges progress loading snackbar tooltips cards carousel dialogs dividers lists sheets app-bars navigation-bar navigation-rail navigation-drawer tabs search toolbars checkbox chips date-pickers menus radio sliders switch time-pickers text-fields accordion avatar breadcrumb aspect-ratio code-block empty skeleton scroll-area marker direction alert alert-dialog popover context-menu navigation-menu command combobox toast data-table table pagination chart calendar trace field input-group input-otp questionnaire attachment message message-scroller sidebar.

To read one component's spec without loading the 1 MB file, slice out its article:

```bash
python3 -c "import sys;s=open('design-reference/Components.dc.html').read();a=s.find('<article id=\"%s\"'%sys.argv[1]);print(s[a:s.find('</article>',a)])" switch
```

Each article has a header paragraph with the sizes and colors, the main demo, and a "N variants" panel. Build the main demo first and treat the variants panel as docs examples.

**For shape and motion, M3 wins over the reference.** Take the values from Google's Compose implementation, which is the canonical token source: `androidx/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/` (`ButtonXxxTokens`, `XxxIconButtonTokens`, `ShapeTokens`, `ExpressiveMotionTokens`). Use `gh api repos/androidx/androidx/contents/<path> -H "Accept: application/vnd.github.raw"` to read them. Leave a comment in the component citing the tokens. The reference still decides layout and composition.

Verified so far:
- **Buttons:** resting round = full, square = 12/12/16/28/28. **Pressed = 8/8/12/16/16 for both shapes.** A toggle's selected state = the square radius, whatever the resting shape. (The reference morphs square buttons to full on press; that's wrong.)
- **Icon buttons:** same resting and pressed values, but selected **flips** the family: round → square radius, square → full. Widths are icon + 2 × leading space: XS 28/32/40 · S 32/40/52 · M 48/56/72 · L 64/96/128 · XL 104/136/184.
- **Motion:** shape and position changes use the Expressive **FastSpatial** spring (ζ 0.6, k 800); colors use **DefaultEffects**. Both directions use the same spring, so there's no separate fast-press timing. The springs are compiled to `linear()` plus a settle duration as `--md-spring-*` in `expressive.css`. Use them through the `shape-morph` utility, or `ease-fast-spatial duration-(--md-spring-fast-spatial-duration)`.

## Porting the reference markup

The class strings carry over almost verbatim. Translate the state hooks:

| Reference | Expressive React |
| --- | --- |
| `hover:` / `active:` / `focus-visible:` on a RAC element | `data-hovered:` / `data-pressed:` / `data-focus-visible:` |
| `peer-checked:` (hidden input) | `data-selected:` on the RAC element, or `group-data-selected:` on children |
| `disabled:` / `aria-disabled` | `data-disabled:` (RAC uses `isDisabled`) |
| `.state-layer` | `state-layer` utility. It reads RAC data attributes and falls back to `:hover`/`:active` on plain elements. Add `<Ripple />` as a child for the press ripple. |
| `outline … secondary` focus | `focus-ring` utility |
| `<span class="material-symbols-rounded icon-20">x</span>` | `<Icon size={20}>x</Icon>`. Inside sized components, the parent sets `[--icon-size:20px]`. |
| `icon-fill` / `peer-checked:[--icon-fill:1]` | `<Icon filled>` / `data-selected:[--icon-fill:1]` |
| `data-shape*` polygons | `<Shape shape cycle interval hoverShape />` |
| `data-toggle` / `data-open` / `data-close` / `data-layer` | `DialogTrigger` + `Dialog`/`Modal`/`Popover`; buttons use `slot="close"` |
| `data-autoclose` floating menus | RAC `MenuTrigger` + `Popover` (positioning and flipping are built in) |
| `data-select-group` / `data-select-item` | `ToggleButtonGroup`, `RadioGroup`, `Tabs`, `ListBox` or `TagGroup`, whichever matches the semantics |
| `data-snackbar` / `data-toast` | RAC `UNSTABLE_Toast*` (todo) |
| `data-slider` | RAC `Slider` |
| `data-async` | `isPending` on `Button` |
| `data-anim="pop"` and similar enter animations | `data-entering:animate-[…]` / `data-exiting:animate-[…]` (RAC waits for exit animations) |

## Code conventions

- **Layout mirrors a shadcn consumer app** so the registry CLI can rewrite imports:
  - `src/components/ui/*.tsx`: shipped components, one per file, kebab-case.
  - `src/lib/utils.ts`: `cn`, `tv`, `composeTailwindRenderProps`.
  - `src/hooks/*`: shipped hooks.
  - `src/styles/expressive.css`: the theme.
  - `src/components/blocks/*.tsx`: shipped blocks and full pages (`registry:block`), composed only from `@/components/ui/*`.
  - `src/docs/*`: the docs/playground app. **Not shipped.**
- Shipped files may import only `@/lib/utils`, `@/components/ui/<name>` and `@/hooks/<name>`. Never import from `@/docs` or use relative paths across folders.
- Start every component with `"use client"`. Use named function components and named exports, and export the `xxxVariants` too. Put `data-slot="<name>"` on the root and on meaningful parts.
- Behavior comes from React Aria Components. Compose className and children with `composeRenderProps`. Don't hand-roll focus, keyboard, ARIA or overlay logic.
- Variants use `tv` from `@/lib/utils`, not a bare `tailwind-variants` import, so the merge config applies. Put the M3 spec numbers in a comment at the top of the file.
- **Use color role tokens only** (`bg-primary-container`, `text-on-surface-variant`, `bg-on-surface/10`). No raw hex values or Tailwind palette colors in components. Disabled is `on-surface` at 10% (container) and 38% (content).
- Motion is CSS-first: transitions with `ease-emphasized`/`ease-spring`, keyframes in `expressive.css`, and RAC `data-entering`/`data-exiting`. Only add `motion` for gesture or physics work (drag sheets, carousel) and note it in the registry deps. Respect `motion-reduce`.
- Icon buttons require `aria-label` or `aria-labelledby` (enforced by the type).
- **No eyebrows** (user rule). Don't put kicker/overline text above headings or titles: no "GETTING STARTED" above a page title, no uppercase or primary-colored label above a section, card or chart title, no "New in Expressive" kickers. Keep only what is strictly necessary; if removing one loses information, put that information in the heading or description. These aren't eyebrows: labels that name a control or group of controls, table column headers, nav and sidebar group headings, legends, badges and chips, and M3 list-item overlines on the page that documents them.

## Adding a token or theme value

1. Add it to `src/styles/expressive.css` (`@theme` for static values, `@theme inline` for anything that reads `--md-*`).
2. **Register new type, radius, shadow, ease or animate names in `twMergeConfig` in `src/lib/utils.ts`.** Otherwise tailwind-merge silently drops classes (for example, it would read `text-label-lg` as a color).

## Adding a component (checklist)

1. Read its `<article>` in `design-reference/Components.dc.html` and the m3.material.io page linked in its header.
2. Write `src/components/ui/<name>.tsx` following the conventions above.
3. Add `registry/<name>.json` (one item per file; the file name must match `name`) with `dependencies` (npm) and `registryDependencies` (`@expressive/<dep>`). `pnpm registry:build` merges these into `registry.json`, so never edit `registry.json` by hand.
4. Add `src/docs/sections/<article-id>.tsx` (`export default function XSection()`, rendering `<Section id="<article-id>">`). It appears on the Components page automatically, in the kit's order (`src/docs/catalog.ts`). Mirror the reference article: the main demo first, then the numbered variants using `Variants`/`Variant` from `@/docs/section`.
5. Run `pnpm typecheck && pnpm registry:build && pnpm build`.
6. Check it visually in `pnpm dev`, in both light and dark mode and with a seed color.

## The Expressive React site: `design-reference/site/`

`design-reference/site/` is the user's design for the library's own website, made in Claude Design. It reuses the kit's `m3/` runtime, plus `m3/site.js` (theme state, scoped recolor, Specs overlay) and a patched `m3/theme.js`.

| Route | Design file | Notes |
| --- | --- | --- |
| `/` | `Landing.dc.html` | Homepage |
| `/docs/:page?` | `Docs.dc.html` (`?p=<id>`) | Sidebar groups, rail/drawer, TOC. The design writes out only `intro`, `install` and `button`; every other component and hook page follows the Button template (Preview · Installation · Usage · Examples · API reference · Accessibility · M3 spec values). "Charts" = `/docs/charts`. "Components" = `/docs/button`. |
| `/blocks` (`?cat=`) | `Blocks.dc.html` | Gallery of the registry blocks; Templates link to `/landing`, `/admin`, … |
| `/themes`, `/tokens` | `Themes.dc.html`, `Tokens.dc.html` | Theme builder; token reference (Docs "Foundations" link here) |
| `/annotations`, `/review` | `Annotations.dc.html`, `Review Board.dc.html` | Motion spec sheet; review board of live frames |
| shared chrome | `SiteHeader.dc.html` | `SiteLayout` in `src/docs/site/site-layout.tsx` (header, footer, compact bottom nav, Specs overlay) |

The design's code samples define the public API the docs show: `<Icon name="add" />`, and `Button`'s `icon` / `trailingIcon` / `color` props. Docs code must be real: examples live as `.tsx` files and the Code tab shows their source (`?raw`).

Use `ThemeScope` (theme-provider) for any subtree with its own seed or light/dark mode, such as preview frames.

## Kit mirror: `/kit` and the templates

`src/docs/catalog.ts` lists the pages and the Components-page groups, matching `design-reference/*.dc.html`. Every file in `src/docs/pages/` is a route (`export const meta = { path }` plus a default export):

| Route | Reference |
| --- | --- |
| `/kit` | `Components.dc.html` (sections from `src/docs/sections/*`) |
| `/landing/*` (6 sub-pages), `/landing-v1`, `/landing-v3`, `/landing-variants` | `Landing*.dc.html` |
| `/admin/*` (6 sub-pages) | `Admin Dashboard.dc.html` |
| `/dashboard-kit`, `/layouts` | `Dashboard Kit.dc.html`, `Layouts.dc.html` |
| `/kit/blocks/{shell,data,auth,settings,people}` | `Blocks *.dc.html` (use `BlocksLayout`/`BlockSection`/`BlockPreview` from `@/docs/blocks-layout`) |

Pages that are really apps (Landing, Admin) render their own chrome. The others use `DocsHeader`. Page content that users would want to install (blocks, landing and dashboard templates) belongs in `src/components/blocks/` with a registry item, and the docs page just renders it.

## Working in parallel (several agents at once)

- **Only touch files you own:** your `src/components/ui/<name>.tsx`, `src/hooks/<name>.ts`, `src/components/blocks/<name>.tsx`, `src/docs/sections/<id>.tsx`, `src/docs/pages/<page>.tsx` and `registry/<name>.json`.
- **`src/styles/expressive.css`:** append only, in one `cat >> … <<'EOF'` block headed `/* ---------- <component> ---------- */` (keyframes, `@utility`). Never edit existing lines.
- **Don't edit** `src/lib/utils.ts`, `package.json`, `catalog.ts`, `section.tsx`, `docs-header.tsx`, `app.tsx` or `registry.json`, and don't run `pnpm add`. Report what you need (new twMerge names, npm packages) instead. Already installed: react-router, recharts, embla-carousel-react, react-resizable-panels, @internationalized/date, motion.
- `pnpm typecheck` covers the whole repo. Errors in files you don't own are other agents' work in progress, so ignore them.

## npm package: `packages/expressive-react`

The registry and the npm package ship **the same source**. `packages/expressive-react/scripts/build.mjs` does the following:

1. Stages `src/components/ui/*`, `src/hooks/*` and `src/lib/utils.ts` flat, rewriting `@/…` imports to `./x.js`.
2. Generates an `index.ts` barrel.
3. Compiles each file with `tsc` to ESM plus `.d.ts`.
4. Writes `dist/styles.css` (the theme plus `@source "./"`, so Tailwind scans the package).

The package's subpath exports (`expressive-react/<name>`) match registry names and `/docs/<name>`. **Never edit `dist/`** — change the source in `src/` and both the registry and the package follow.

The build fails on export-name collisions in the barrel and on any `@/` import outside ui, hooks and lib/utils. Keep every shipped module's exported names unique across the library.

**Releases:**
1. Bump `"version"` in `packages/expressive-react/package.json` and commit.
2. Tag and push: `git tag vX.Y.Z && git push --tags`.
3. `.github/workflows/release.yml` checks the tag against the version, builds and publishes with provenance through npm trusted publishing, then creates the GitHub release.

CI (`deploy.yml`) also builds and packs the package on every push.

## Commands

```bash
pnpm dev             # docs/playground at localhost:5173
pnpm typecheck       # tsc -b
pnpm registry:build  # registry.json → public/r/*.json (gitignored, served at /r/{name}.json)
pnpm build           # registry + typecheck + docs build (dist/ includes /r)
pnpm package:build   # npm package → packages/expressive-react/dist
pnpm package:pack    # build + npm pack (inspect the tarball)
```

## Gotchas

- The Google Fonts CSS styles `.material-symbols-rounded` **unlayered** (`font-size: 24px`), which beats every Tailwind utility. `<Icon>` uses its own `.md-icon` class for this reason. Don't switch it back.
- Tailwind v4 orders same-kind variants alphabetically, so `data-selected:` beats `data-pressed:`. Write selected-state radii as `data-selected:not-data-pressed:rounded-…` so the press morph still wins.
- Round radii are set to exactly half the height (`rounded-[20px]` for 40px), not `rounded-full`. That way the corner morph animates from the first frame.
- `expressive.css` overrides Tailwind's `sm…2xl` breakpoints with M3 window size classes (480/600/840/1200/1600) and replaces the `rounded-xs…2xl` scale with M3 values.
- Live site and registry: https://expressive-react.moolerz.et (registry at `/r/{name}.json`); repo: https://github.com/mooler-z/expressive-react. Pushing to `main` deploys (see `.github/workflows/deploy.yml`).

## Status

Everything in `design-reference/` is ported: all 71 Components-page sections, and all 14 pages (Landing ×4, Admin with 21 sub-pages, Dashboard kit, Layouts, 5 Blocks pages). The registry has 180 items: 73 ui, 7 hooks, 97 blocks, plus init, theme and utils.

Quality gates. Run these after any change:
- `pnpm registry:build` first runs `scripts/check-registry.mjs`. It fails if an item's `files`, `registryDependencies` or npm `dependencies` don't match what its code actually imports. `node scripts/check-registry.mjs --fix` syncs them from the imports, so never hand-maintain dependency lists.
- Blocks keep their demo data inside the files and take callbacks/props for real use. Multi-file blocks live in a folder (`blocks/admin/`, `blocks/landing/`, `blocks/marketing/`, `blocks/dashboard-kit/`, `blocks/layouts/`) and import siblings relatively.
- For a docs-wide smoke test, load every route at 1440px and 400px. Expect zero console errors or warnings and no horizontal overflow.

Known deviations from the kit (intentional, M3 wins): shape/motion tokens from androidx, menus use M3 Expressive segmented styling, the compact nav bar is 64dp, and corner radii follow the declared M3 scale (served standalone, the kit's CDN build fell back to Tailwind defaults).
