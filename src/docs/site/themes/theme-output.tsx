import * as React from "react"
import { Button as AriaButton } from "react-aria-components"
import { Link } from "react-router"

import { ConnectedButton, ConnectedButtonGroup } from "@/components/ui/button-group"
import { CopyButton } from "@/components/ui/code-block"
import { Icon } from "@/components/ui/icon"
import { snackbar } from "@/components/ui/snackbar"
import { copy, roleForeground, type Scheme } from "@/docs/site/themes/theme-data"

/** The 45 visible roles (all but scrim and shadow) of one scheme, read from the generated `--md-*` map. Click a tile to copy its hex. */
export function RolePalette({ scheme, mode }: { scheme: Scheme | null; mode: "light" | "dark" }) {
  const roles = scheme
    ? Object.keys(scheme)
        .map((k) => k.replace("--md-", ""))
        .filter((r) => r !== "scrim" && r !== "shadow")
    : []
  return (
    <section
      aria-labelledby="roles-title"
      className="rounded-xl bg-surface-container-low p-5"
      data-spec="Role palette|The roles of the current scheme in the current mode, generated with Material color utilities (2025 spec)."
    >
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="roles-title" className="text-title-md">
          Color roles · {mode}
        </h2>
        <Link to="/tokens#color" className="text-label-lg text-primary hover:underline">
          All tokens
        </Link>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-1 text-label-sm @md:grid-cols-3 @2xl:grid-cols-4 @4xl:grid-cols-6">
        {scheme
          ? roles.map((r) => {
              const bg = scheme[`--md-${r}`]
              return (
                <AriaButton
                  key={r}
                  aria-label={`Copy ${r} ${bg}`}
                  onPress={async () => (await copy(bg.toUpperCase())) && snackbar(`Copied ${r} · ${bg.toUpperCase()}`)}
                  className="state-layer focus-ring flex h-14 min-w-0 cursor-pointer flex-col items-start justify-end rounded-xs p-2 text-left transition-colors duration-300"
                  style={{ background: bg, color: roleForeground(r, scheme) }}
                >
                  <span className="w-full truncate">{r}</span>
                  <span className="font-mono opacity-80">{bg.toUpperCase()}</span>
                </AriaButton>
              )
            })
          : Array.from({ length: 24 }, (_, i) => <span key={i} className="h-14 animate-pulse rounded-xs bg-surface-container" />)}
      </div>
    </section>
  )
}

type Output = "css" | "provider"

/** Export panel: static CSS for expressive.css users, or the ThemeProvider props for runtime generation. */
export function ThemeOutput({ css, provider }: { css: string | null; provider: string }) {
  const [tab, setTab] = React.useState<Output>("css")
  const text = tab === "css" ? (css ?? "Generating…") : provider
  const lines = text.trimEnd().split("\n").length
  return (
    <section aria-label="Export" className="overflow-hidden rounded-xl bg-surface-container-lowest ring-1 ring-outline-variant">
      <div className="flex min-h-12 flex-wrap items-center gap-2 border-b border-outline-variant py-1.5 pr-2 pl-4">
        <Icon name={tab === "css" ? "css" : "code"} size={18} className="text-on-surface-variant" />
        <span className="min-w-0 flex-1 truncate font-mono text-body-sm text-on-surface-variant">
          {tab === "css" ? "globals.css · after expressive.css" : "main.tsx · ThemeProvider"}
        </span>
        <ConnectedButtonGroup
          aria-label="Export format"
          size="xs"
          selectedKeys={[tab]}
          onSelectionChange={(keys) => {
            const [k] = [...keys]
            if (k) setTab(k as Output)
          }}
        >
          <ConnectedButton id="css" className="bg-surface-container-highest text-on-surface">
            CSS
          </ConnectedButton>
          <ConnectedButton id="provider" className="bg-surface-container-highest text-on-surface">
            ThemeProvider
          </ConnectedButton>
        </ConnectedButtonGroup>
        <span className="hidden rounded-xs bg-surface-container px-2 py-0.5 font-mono text-label-sm text-on-surface-variant sm:inline">
          {lines} lines
        </span>
        <CopyButton
          value={text}
          aria-label={tab === "css" ? "Copy CSS" : "Copy ThemeProvider snippet"}
          className="text-on-surface-variant"
          onCopied={() => snackbar(tab === "css" ? "Copied theme CSS" : "Copied ThemeProvider snippet")}
        />
      </div>
      <pre className="max-h-[520px] overflow-auto p-5 font-mono text-body-sm leading-6 text-on-surface">
        <code>{text}</code>
      </pre>
    </section>
  )
}
