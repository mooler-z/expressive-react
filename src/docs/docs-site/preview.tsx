import * as React from "react"

import { DirectionProvider } from "@/components/ui/direction"
import { Icon } from "@/components/ui/icon"
import { ThemeScope } from "@/components/ui/theme-provider"
import { CodePanel, copyText, Segmented } from "@/docs/docs-site/primitives"
import type { DocDemo, DocExample } from "@/docs/docs-site/types"
import { cn } from "@/lib/utils"

type PreviewTheme = "auto" | "light" | "dark"
const THEME_META: Record<PreviewTheme, { icon: string; label: string }> = {
  auto: { icon: "contrast", label: "Follows site" },
  light: { icon: "light_mode", label: "Light preview" },
  dark: { icon: "dark_mode", label: "Dark preview" },
}
const nextTheme = (t: PreviewTheme): PreviewTheme => (t === "auto" ? "light" : t === "light" ? "dark" : "auto")

const toolButton =
  "state-layer focus-ring inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full shape-morph data-pressed:rounded-md active:rounded-md"

/**
 * Stage that can be re-themed (light / dark via ThemeScope) and flipped to RTL without touching the page.
 * `auto` renders a plain element so the demo follows the site's own tokens exactly.
 */
function Stage({ theme, rtl, className, children }: { theme: PreviewTheme; rtl: boolean; className: string; children: React.ReactNode }) {
  const content = rtl ? (
    <DirectionProvider dir="rtl" className="contents">
      {children}
    </DirectionProvider>
  ) : (
    children
  )
  if (theme === "auto") return <div className={cn("bg-surface text-on-surface", className)}>{content}</div>
  return (
    <ThemeScope mode={theme} className={className}>
      {content}
    </ThemeScope>
  )
}

/** Theme + RTL controls shared by the main preview and the kit fallback preview. */
function StageControls({
  theme,
  setTheme,
  rtl,
  setRtl,
  copy,
}: {
  theme: PreviewTheme
  setTheme: (t: PreviewTheme) => void
  rtl: boolean
  setRtl: (v: boolean) => void
  copy?: string
}) {
  return (
    <div className="ml-auto flex items-center gap-1 text-on-surface-variant">
      <span className="hidden text-label-md sm:inline">{THEME_META[theme].label}</span>
      <button type="button" className={toolButton} onClick={() => setTheme(nextTheme(theme))} aria-label="Toggle preview theme" title="Preview theme">
        <Icon name={THEME_META[theme].icon} />
      </button>
      <button
        type="button"
        className={cn(toolButton, rtl && "bg-secondary-container text-on-secondary-container")}
        onClick={() => setRtl(!rtl)}
        aria-label="Toggle text direction"
        aria-pressed={rtl}
        title="RTL"
      >
        <Icon name="format_textdirection_r_to_l" />
      </button>
      {copy != null && (
        <button type="button" className={toolButton} onClick={() => copyText(copy, "demo code")} aria-label="Copy code" title="Copy code">
          <Icon name="content_copy" />
        </button>
      )}
    </div>
  )
}

const STAGE = "flex flex-wrap items-center justify-center gap-3 rounded-lg p-6 transition-colors duration-300"

/** Main demo at the top of a component page. */
export function MainPreview({ demo }: { demo: DocDemo }) {
  const [tab, setTab] = React.useState<"preview" | "code">("preview")
  const [theme, setTheme] = React.useState<PreviewTheme>("auto")
  const [rtl, setRtl] = React.useState(false)
  const Demo = demo.component
  return (
    <div className="overflow-hidden rounded-xl bg-surface-container-low">
      <div className="flex flex-wrap items-center gap-2 px-3 pt-3">
        <Segmented
          label="Preview or code"
          value={tab}
          onChange={setTab}
          options={[
            { id: "preview", label: "Preview" },
            { id: "code", label: "Code" },
          ]}
        />
        <StageControls theme={theme} setTheme={setTheme} rtl={rtl} setRtl={setRtl} copy={demo.source} />
      </div>
      {tab === "preview" ? (
        <Stage theme={theme} rtl={rtl} className={cn("m-3 min-h-80", STAGE, demo.className)}>
          <Demo />
        </Stage>
      ) : (
        <CodePanel code={demo.source} copyLabel="demo code" className="m-3" />
      )}
    </div>
  )
}

/** One numbered example with its own Preview / Code toggle. */
export function ExampleBlock({ example, n }: { example: DocExample; n: number }) {
  const [tab, setTab] = React.useState<"preview" | "code">("preview")
  const Demo = example.component
  return (
    <div id={`ex-${example.id}`} className="scroll-mt-24">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-label-md text-on-primary">{n}</span>
          <div className="min-w-0">
            <h3 className="text-title-lg">{example.title}</h3>
            {example.description && <p className="mt-1 max-w-prose text-body-md text-on-surface-variant">{example.description}</p>}
          </div>
        </div>
        <Segmented
          size="sm"
          label={`${example.title}: preview or code`}
          value={tab}
          onChange={setTab}
          options={[
            { id: "preview", label: "Preview" },
            { id: "code", label: "Code" },
          ]}
        />
      </div>
      <div className="mt-4 overflow-hidden rounded-xl bg-surface-container-low p-3">
        {tab === "preview" ? (
          <div className={cn("min-h-40 bg-surface text-on-surface", STAGE, example.className)}>
            <Demo />
          </div>
        ) : (
          <CodePanel code={example.source} copyLabel={`${example.title} code`} />
        )}
      </div>
    </div>
  )
}

/** Fallback preview: the kit section that demos this component, with the same theme / RTL controls. */
export function KitPreview({ load }: { load: () => Promise<{ default: React.ComponentType }> }) {
  const [Section, setSection] = React.useState<React.ComponentType | null>(null)
  const [theme, setTheme] = React.useState<PreviewTheme>("auto")
  const [rtl, setRtl] = React.useState(false)
  React.useEffect(() => {
    let live = true
    load().then((m) => live && setSection(() => m.default))
    return () => {
      live = false
    }
  }, [load])
  return (
    <div className="overflow-hidden rounded-xl bg-surface-container-low">
      <div className="flex flex-wrap items-center gap-2 px-4 pt-3">
        <span className="inline-flex items-center gap-2 text-label-lg text-on-surface-variant">
          <Icon name="widgets" size={20} />
          Kit demos
        </span>
        <StageControls theme={theme} setTheme={setTheme} rtl={rtl} setRtl={setRtl} />
      </div>
      {/* The kit section brings its own title and panel; hide its header, keep the demos. */}
      <Stage
        theme={theme}
        rtl={rtl}
        className="m-3 min-h-40 rounded-lg [&_[data-kit-section]>section]:space-y-0 [&_[data-kit-section]>section>div]:bg-transparent [&_[data-kit-section]>section>div]:p-3 md:[&_[data-kit-section]>section>div]:p-4 [&_[data-kit-section]>section>header]:hidden"
      >
        {Section ? (
          <div data-kit-section>
            <Section />
          </div>
        ) : (
          <div className="grid min-h-40 place-items-center text-body-md text-on-surface-variant">Loading demos…</div>
        )}
      </Stage>
    </div>
  )
}
