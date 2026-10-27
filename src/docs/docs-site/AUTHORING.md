# Writing a docs page

Every component and hook gets a page at `/docs/<id>`, where `<id>` is its registry item name (`registry/<id>.json`, `src/components/ui/<id>.tsx`). Until a content file exists, the page falls back to the kit demo (`kit-map.ts`) plus auto-generated install steps. Writing the content file turns it into a full page like **/docs/button**, the exemplar. Copy its structure.

## Files

```
src/docs/docs-site/
  content/<id>.tsx            ← the page: default-exports a ComponentDoc (types.ts)
  examples/<id>/<name>.tsx    ← one real, self-contained demo per example
```

### 1. Examples are real modules

Each example default-exports a component and is written exactly as a user would paste it:

- import only from `@/components/ui/*`, `@/hooks/*`, `@/lib/utils` (never from `@/docs`);
- own its layout (`<div className="flex flex-wrap items-center justify-center gap-3">`);
- keep state inside it (`useState`), and use `snackbar()` for actions;
- no `"use client"`, no comments about the docs.

The page imports each file twice: once as a component and once with `?raw`. The Code tab shows that raw text, so code and demo can't drift.

```tsx
import Sizes from "@/docs/docs-site/examples/slider/sizes"
import sizesSrc from "@/docs/docs-site/examples/slider/sizes?raw"
```

`examples/<id>/demo.tsx` is the main preview at the top of the page.

### 2. The content file

```tsx
import type { ComponentDoc } from "@/docs/docs-site/types"

export default {
  description: "One or two sentences: what it is, the M3 variants it covers.",
  links: { m3: "https://m3.material.io/components/…", aria: "https://react-spectrum.adobe.com/react-aria/….html" },
  preview: { component: Demo, source: demoSrc },
  usage: `import { Slider } from "@/components/ui/slider"\n\n<Slider label="Volume" defaultValue={40} />`,
  examples: [{ id: "sizes", title: "Sizes", description: "…", component: Sizes, source: sizesSrc }],
  api: [{ name: "Slider", description: "Everything React Aria's Slider accepts, plus:", props: [{ name: "size", type: '"xs" | "sm"', default: '"sm"', description: "…" }] }],
  accessibility: { description: "…", keyboard: [{ keys: ["←", "→"], description: "…" }], notes: ["…"] },
  spec: { tables: [{ columns: ["Size", "Track", "Handle"], rows: [["XS", "16dp", "44dp"]] }], cards: [{ title: "Motion", items: ["…"] }], source: "androidx SliderTokens" },
} satisfies ComponentDoc
```

Every section except `description` and `preview` is optional, and the TOC only lists the sections you provide. Don't write the install command, breadcrumbs, prev/next or the Manual tab: those come from the registry and the nav.

## Rules

- **Accuracy over the design mock.** Read the component source before you write props. Use the real API: no props that don't exist, and every default checked. If the design's snippet differs from the real API, follow the code.
- **Spec values come from the code and androidx tokens**, as in CLAUDE.md, not from `design-reference/site/Docs.dc.html`, whose Button numbers are placeholders.
- **Keyboard tables** describe what React Aria actually does for that component. Leave out anything you haven't verified.
- **Voice:** short declarative sentences, M3 vocabulary (container, on-color, state layer), dp for sizes, no marketing.
- **Command palette demos** must pass `shortcut={null}` to `CommandDialog`, because the site header owns ⌘K.
- **Verify:** `pnpm typecheck`, then open `/docs/<id>` at 1440 / 840 / 400 in light and dark. Check the Preview/Code tabs, the light/dark preview toggle and the RTL toggle. No console errors, and no horizontal overflow at 400.

## Guides

Getting-started pages live in `guides/<id>.tsx`: export `lead` (the intro line) and a default component body built from `guide.tsx` (`Prose`, `H2`, `CardGrid`, `Checklist`, …) and `primitives.tsx` (`CodePanel`, `Terminal`, `DocTable`, `Steps`, `Callout`, `InlineCode`, `TextLink`). The page title comes from `DOCS_GROUPS` in `src/docs/site/site-nav.ts`.
