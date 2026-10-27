import * as React from "react"
import type { Key } from "react-aria-components"

import { Button } from "@/components/ui/button"
import { ConnectedButton, ConnectedButtonGroup } from "@/components/ui/button-group"
import { CodeBlock } from "@/components/ui/code-block"
import { Icon } from "@/components/ui/icon"
import { LoadingIndicator } from "@/components/ui/loading-indicator"
import { snackbar } from "@/components/ui/snackbar"
import { installCommand, type GalleryEntry } from "@/docs/site/blocks-gallery/catalog"
import { syncFrameAfterLoad } from "@/docs/site/blocks-gallery/frame-theme"
import { cn } from "@/lib/utils"

/** Block sources, loaded on demand when a code panel opens. */
const SOURCES = import.meta.glob<string>("/src/components/blocks/**/*.{ts,tsx}", { query: "?raw", import: "default" })

type FrameSize = "desk" | "tab" | "phone"

const FRAMES: Record<FrameSize, { width: string; height: number; label: string; icon: string; name: string }> = {
  desk: { width: "100%", height: 680, label: "100% · desktop", icon: "desktop_windows", name: "Desktop" },
  tab: { width: "768px", height: 720, label: "768 × 720 · tablet", icon: "tablet", name: "Tablet" },
  phone: { width: "400px", height: 760, label: "400 × 760 · phone", icon: "smartphone", name: "Phone" },
}

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Clipboard API blocked (permissions, insecure context): fall back to a hidden textarea.
    const ta = document.createElement("textarea")
    ta.value = text
    ta.setAttribute("readonly", "")
    ta.style.cssText = "position:fixed;opacity:0;pointer-events:none"
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand?.("copy") ?? false
    ta.remove()
    return ok
  }
}

/** Mounts its children once the element comes within `margin` of the viewport (and keeps them). */
function useNearViewport<T extends Element>(margin = "600px 0px") {
  const ref = React.useRef<T>(null)
  const [near, setNear] = React.useState(false)
  React.useEffect(() => {
    const el = ref.current
    if (!el || near) return
    if (!("IntersectionObserver" in window)) return setNear(true)
    const io = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && setNear(true), { rootMargin: margin })
    io.observe(el)
    return () => io.disconnect()
  }, [near, margin])
  return [ref, near] as const
}

const installedPath = (path: string) => path.replace(/^src\//, "")

export function BlockSection({ entry }: { entry: GalleryEntry }) {
  const [size, setSize] = React.useState<FrameSize>("desk")
  const [codeOpen, setCodeOpen] = React.useState(false)
  const [loaded, setLoaded] = React.useState(false)
  const [frameRef, near] = useNearViewport<HTMLDivElement>()
  const frame = FRAMES[size]
  const cmd = installCommand(entry.install)
  const codeId = `${entry.id}-code`

  return (
    <section id={entry.id} className="scroll-mt-36" aria-labelledby={`${entry.id}-title`}>
      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-0 flex-1 basis-72">
          <h2 id={`${entry.id}-title`} className="text-title-lg">
            {entry.title}
          </h2>
          <p className="text-body-md text-pretty text-on-surface-variant">{entry.description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ConnectedButtonGroup
            aria-label="Frame size"
            selectedKeys={[size]}
            onSelectionChange={(keys: Set<Key>) => {
              const next = [...keys][0] as FrameSize | undefined
              if (next) setSize(next)
            }}
            className="max-sm:hidden"
          >
            {(Object.keys(FRAMES) as FrameSize[]).map((k) => (
              <ConnectedButton key={k} id={k} iconOnly aria-label={FRAMES[k].name}>
                <Icon size={20}>{FRAMES[k].icon}</Icon>
              </ConnectedButton>
            ))}
          </ConnectedButtonGroup>
          <Button
            icon={<Icon name="content_copy" />}
            onPress={async () => {
              const ok = await copyText(cmd)
              snackbar(ok ? `Copied · ${cmd}` : "Couldn't copy. Select the command in the code panel instead.")
            }}
          >
            Copy install
          </Button>
          <Button
            variant="outlined"
            icon={<Icon name="code" />}
            aria-expanded={codeOpen}
            aria-controls={codeId}
            onPress={() => setCodeOpen((o) => !o)}
            className={cn(codeOpen && "border-transparent bg-secondary-container text-on-secondary-container")}
          >
            Code
          </Button>
          <a
            href={entry.previewHref}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${entry.title} in a new tab`}
            title="Open in a new tab"
            className="state-layer focus-ring inline-flex size-10 items-center justify-center rounded-full text-on-surface-variant"
          >
            <Icon size={20}>open_in_new</Icon>
          </a>
        </div>
      </div>

      <div className="mt-3 rounded-xl bg-surface-container-low p-3">
        <div
          ref={frameRef}
          className="relative mx-auto max-w-full overflow-hidden rounded-lg bg-surface shadow-1 ring-1 ring-outline-variant/60 transition-[width] duration-500 ease-emphasized"
          style={{ width: frame.width, height: frame.height }}
        >
          {near && (
            <iframe
              src={`${entry.previewHref}${entry.previewHref.includes("?") ? "&" : "?"}embed=1`}
              title={`${entry.title} preview`}
              loading="lazy"
              data-theme-sync=""
              onLoad={(e) => {
                syncFrameAfterLoad(e.currentTarget)
                setLoaded(true)
              }}
              className="block h-full w-full border-0 bg-surface"
            />
          )}
          {!loaded && (
            <div className="absolute inset-0 grid place-items-center bg-surface">
              {near && <LoadingIndicator aria-label={`Loading ${entry.title}`} />}
            </div>
          )}
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 px-1 text-body-sm text-on-surface-variant">
          <span className="font-mono max-sm:hidden">{frame.label}</span>
          <span>Live preview · scroll inside the frame</span>
        </div>
      </div>

      {codeOpen && <CodePanel id={codeId} entry={entry} command={cmd} />}
    </section>
  )
}

function CodePanel({ id, entry, command }: { id: string; entry: GalleryEntry; command: string }) {
  const [active, setActive] = React.useState(entry.files[0]?.path)
  const [source, setSource] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!active) return
    let cancelled = false
    setSource(null)
    const load = SOURCES[`/${active}`]
    if (!load) {
      setSource(`// ${active} isn't in this repo's sources.`)
      return
    }
    load().then(
      (s) => !cancelled && setSource(s),
      () => !cancelled && setSource(`// Couldn't load ${active}.`),
    )
    return () => {
      cancelled = true
    }
  }, [active])

  return (
    <div id={id} className="mt-3 grid gap-3 lg:grid-cols-[280px_minmax(0,1fr)]">
      <div className="min-w-0 space-y-4 rounded-lg bg-surface-container-low p-3">
        <div>
          <div className="px-2 pb-2 text-label-md tracking-wider text-on-surface-variant uppercase">Install</div>
          <code className="block rounded-md bg-surface-container-highest px-3 py-2 font-mono text-body-sm break-all text-on-surface">{command}</code>
        </div>
        <div>
          <div className="px-2 pb-2 text-label-md tracking-wider text-on-surface-variant uppercase">Files · {entry.files.length}</div>
          <ul className="max-h-80 space-y-0.5 overflow-y-auto font-mono text-body-sm">
            {entry.files.map((f) => (
              <li key={f.path}>
                <button
                  type="button"
                  onClick={() => setActive(f.path)}
                  aria-current={f.path === active || undefined}
                  className={cn(
                    "state-layer flex h-9 w-full cursor-pointer items-center gap-2 rounded-full px-2 text-left text-on-surface-variant",
                    f.path === active && "bg-secondary-container text-on-secondary-container",
                  )}
                >
                  <Icon size={18}>{f.path.endsWith(".ts") ? "data_object" : "code"}</Icon>
                  <span className="min-w-0 truncate">{installedPath(f.path)}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        {entry.registryDependencies.length > 0 && (
          <div>
            <div className="px-2 pb-2 text-label-md tracking-wider text-on-surface-variant uppercase">
              Uses · {entry.registryDependencies.length}
            </div>
            <div className="flex flex-wrap gap-1.5 px-1">
              {entry.registryDependencies.map((d) => (
                <span key={d} className="inline-flex h-6 items-center rounded-sm bg-surface-container-high px-2 font-mono text-label-sm text-on-surface-variant">
                  {d.replace("@expressive/", "")}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="min-w-0">
        {source == null ? (
          <div className="grid h-40 place-items-center rounded-lg bg-surface-container-lowest ring-1 ring-outline-variant">
            <LoadingIndicator size={36} aria-label="Loading source" />
          </div>
        ) : (
          <CodeBlock
            code={source}
            filename={active ? installedPath(active) : undefined}
            language="tsx"
            onCopied={() => snackbar(`Copied ${active ? installedPath(active) : "source"}`)}
            className="[&_pre]:max-h-[560px] [&_pre]:overflow-auto"
          />
        )}
      </div>
    </div>
  )
}
