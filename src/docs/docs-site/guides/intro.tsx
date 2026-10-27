import { Link } from "react-router"

import { Icon } from "@/components/ui/icon"
import { CardGrid, Check, Checklist, H2, InfoCard, Prose, Strong } from "@/docs/docs-site/guide"
import { InlineCode } from "@/docs/docs-site/primitives"
import { REGISTRY } from "@/docs/docs-site/registry"

export const lead = "Expressive React is a set of React components, hooks and blocks that implement Material 3 Expressive. You don't install it. You copy it."

const count = (type: string) => Object.values(REGISTRY).filter((i) => i.type === type).length

export default function Introduction() {
  return (
    <>
      <Prose>
        <p>
          Run <InlineCode>npx shadcn add @expressive/button</InlineCode> and <code className="font-mono text-body-md">button.tsx</code> lands in your repo as plain
          TypeScript. Change a spring, rename a variant, delete the sizes you never use. Nothing breaks on the next release, because there is no next release for
          code you own.
        </p>
        <H2>What's in the box</H2>
        <CardGrid>
          <InfoCard icon="widgets" title={`${count("registry:ui")} components`}>
            Every M3 component, grouped the M3 way, plus the shadcn staples people expect: command palette, data table, resizable, toast.
          </InfoCard>
          <InfoCard icon="view_quilt" title={`${count("registry:block")} blocks`}>
            Full templates, marketing sections, dashboard widgets, canonical layouts, auth, settings, shells, data and people.
          </InfoCard>
          <InfoCard icon="webhook" title={`${count("registry:hook")} hooks`}>
            useWindowSizeClass, useMediaQuery, useMotion, usePressScale, useMagnetic, useTilt, useDragScroll.
          </InfoCard>
          <InfoCard icon="palette" title="Dynamic color">
            Any seed, nine scheme variants, three contrast levels, light, dark and system. Generated with Google's 2025 spec.
          </InfoCard>
        </CardGrid>
        <H2>Principles</H2>
        <Checklist>
          <Check>
            <Strong>Behaviour from React Aria.</Strong> Focus, keyboard, ARIA, touch and RTL come from React Aria Components. We don't re-implement them.
          </Check>
          <Check>
            <Strong>Motion in CSS.</Strong> M3 Expressive springs are compiled to <code className="font-mono">linear()</code> curves. The default build ships no
            animation runtime.
          </Check>
          <Check>
            <Strong>Tokens are variables.</Strong> Color roles, shape scale and elevation live under Tailwind v4's <code className="font-mono">@theme</code>, so
            utilities like <code className="font-mono">bg-primary-container</code> just work.
          </Check>
        </Checklist>
      </Prose>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          to="/docs/install"
          className="state-layer focus-ring shape-morph inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-label-lg text-on-primary active:rounded-md"
        >
          Installation
          <Icon name="arrow_forward" size={20} />
        </Link>
        <Link
          to="/docs/button"
          className="state-layer focus-ring shape-morph inline-flex h-12 items-center gap-2 rounded-full bg-secondary-container px-6 text-label-lg text-on-secondary-container active:rounded-md"
        >
          See the Button page
        </Link>
      </div>
    </>
  )
}
