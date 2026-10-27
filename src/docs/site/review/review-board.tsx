import * as React from "react"
import { Link } from "react-router"

import { Icon } from "@/components/ui/icon"
import { Shape } from "@/components/ui/shape"
import { cn } from "@/lib/utils"

/*
 * /review · design-reference/site/Review Board.dc.html
 * Live site pages in iframes at 1440 / 840 / 400, light and dark, scaled down. Frames scroll on their own;
 * each row scrolls sideways. The app reads ?embed=1 (don't persist), ?dark=0|1, ?seed=RRGGBB and ?specs=1.
 */

const SIZES: [label: string, w: number, h: number, icon: string][] = [
  ["1440", 1440, 900, "desktop_windows"],
  ["840", 840, 1120, "tablet"],
  ["400", 400, 860, "smartphone"],
]

const PAGES: [name: string, href: string][] = [
  ["Landing", "/"],
  ["Docs · Button page", "/docs/button"],
  ["Blocks", "/blocks?lite=1"],
  ["Themes", "/themes"],
  ["Design tokens", "/tokens"],
]

const SEEDS: [hex: string, name: string][] = [
  ["", "Baseline"],
  ["#0B57D0", "Blue"],
  ["#006A6A", "Teal"],
  ["#7D5700", "Amber"],
  ["#9C4146", "Rose"],
]

const ZOOMS = [0.33, 0.5, 0.75]

/**
 * Each frame boots the whole app, so dozens at once exhaust the browser. Frames load when scrolled near,
 * at most MAX_LOADING at a time; a slot frees when a frame fires `load` (or after a timeout).
 */
const MAX_LOADING = 3

function createLoadQueue() {
  let active = 0
  const waiting: (() => void)[] = []
  const next = () => {
    while (active < MAX_LOADING && waiting.length) {
      active++
      waiting.shift()!()
    }
  }
  return {
    /** Ask for a slot; `start` runs when one is free. Returns a release function (also cancels a pending request). */
    request(start: () => void) {
      let granted = false
      let released = false
      const run = () => {
        granted = true
        start()
      }
      waiting.push(run)
      next()
      return () => {
        if (released) return
        released = true
        if (granted) active--
        else waiting.splice(waiting.indexOf(run), 1)
        next()
      }
    },
  }
}

const LoadQueueContext = React.createContext<ReturnType<typeof createLoadQueue> | null>(null)

function Frame({ src, title, width, height, zoom }: { src: string; title: string; width: number; height: number; zoom: number }) {
  const queue = React.useContext(LoadQueueContext)!
  const box = React.useRef<HTMLDivElement>(null)
  const release = React.useRef<(() => void) | null>(null)
  const [loadSrc, setLoadSrc] = React.useState<string | null>(null)

  React.useEffect(() => {
    const el = box.current
    if (!el) return
    setLoadSrc(null)
    let timer: ReturnType<typeof setTimeout> | undefined
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || release.current) return
        io.disconnect()
        release.current = queue.request(() => {
          setLoadSrc(src)
          timer = setTimeout(() => release.current?.(), 15000)
        })
      },
      { rootMargin: "600px 400px" },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      clearTimeout(timer)
      release.current?.()
      release.current = null
    }
  }, [src, queue])

  return (
    <div
      ref={box}
      className="relative overflow-hidden rounded-lg bg-surface shadow-2 ring-1 ring-outline-variant/40"
      style={{ width: width * zoom, height: height * zoom }}
    >
      {loadSrc ? (
        <iframe
          src={loadSrc}
          title={title}
          onLoad={() => release.current?.()}
          className="block border-0 bg-surface"
          style={{ width, height, transform: `scale(${zoom})`, transformOrigin: "0 0" }}
        />
      ) : (
        <div className="grid size-full place-items-center text-label-md text-on-surface-variant">Queued…</div>
      )}
    </div>
  )
}

export function ReviewBoard() {
  const [specs, setSpecs] = React.useState(false)
  const [seed, setSeed] = React.useState("")
  const [zoom, setZoom] = React.useState(0.5)
  const [queue] = React.useState(createLoadQueue)

  const src = (href: string, dark: boolean) =>
    href +
    (href.includes("?") ? "&" : "?") +
    `embed=1&dark=${dark ? 1 : 0}` +
    (specs ? "&specs=1" : "") +
    (seed ? `&seed=${seed.replace("#", "")}` : "")

  return (
    <LoadQueueContext.Provider value={queue}>
      <div className="min-h-screen bg-surface-container font-sans text-on-surface">
        <header className="sticky top-0 z-40 flex min-h-16 flex-wrap items-center gap-2 bg-surface-container px-4 py-2 md:px-6">
          <Shape shape="clover4" className="size-8 shrink-0 text-primary" />
          <div className="mr-4 min-w-0">
            <h1 className="text-title-md font-semibold tracking-tight">Expressive React · review board</h1>
            <div className="text-body-sm text-on-surface-variant">
              Live pages at 1440 / 840 / 400, light and dark, at {Math.round(zoom * 100)}%. Rows scroll sideways; frames scroll.
            </div>
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <div className="flex gap-1.5" role="radiogroup" aria-label="Seed color">
              {SEEDS.map(([hex, name]) => {
                const on = hex === seed
                return (
                  <button
                    key={name}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    aria-label={name}
                    title={name}
                    onClick={() => setSeed(hex)}
                    className={cn(
                      "focus-ring grid size-8 cursor-pointer place-items-center rounded-full text-white transition-[border-radius] duration-(--md-spring-fast-spatial-duration) ease-fast-spatial",
                      on && "rounded-md ring-2 ring-primary ring-offset-2 ring-offset-surface-container",
                    )}
                    style={{ background: hex || "#6750A4" }}
                  >
                    <Icon name="check" size={16} className={on ? "" : "opacity-0"} />
                  </button>
                )
              })}
            </div>
            <div className="flex rounded-full bg-surface-container-high p-1 text-label-lg" role="radiogroup" aria-label="Zoom">
              {ZOOMS.map((z) => (
                <button
                  key={z}
                  type="button"
                  role="radio"
                  aria-checked={zoom === z}
                  onClick={() => setZoom(z)}
                  className={cn(
                    "state-layer focus-ring h-8 cursor-pointer rounded-full px-3 tabular-nums text-on-surface-variant transition-colors",
                    zoom === z && "bg-surface text-on-surface shadow-1",
                  )}
                >
                  {Math.round(z * 100)}%
                </button>
              ))}
            </div>
            <button
              type="button"
              aria-pressed={specs}
              onClick={() => setSpecs((s) => !s)}
              className={cn(
                "state-layer focus-ring inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border px-4 text-label-lg transition-colors duration-300 ease-emphasized",
                specs ? "border-transparent bg-tertiary-container text-on-tertiary-container" : "border-outline-variant text-on-surface-variant",
              )}
            >
              <Icon name="square_foot" size={20} />
              Specs overlays
            </button>
            <Link to="/" className="state-layer focus-ring inline-flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-label-lg text-on-primary">
              Open site
              <Icon name="arrow_forward" size={20} />
            </Link>
            <Link
              to="/annotations"
              className="state-layer focus-ring inline-flex h-10 items-center gap-2 rounded-full bg-secondary-container px-4 text-label-lg text-on-secondary-container"
            >
              Annotated board
            </Link>
          </div>
        </header>

        <div className="space-y-14 px-4 py-8 md:px-6">
          {PAGES.map(([name, href]) => (
            <section key={href} data-screen-label={name}>
              <div className="flex flex-wrap items-baseline gap-3">
                <h2 className="text-headline-sm font-semibold">{name}</h2>
                <Link to={href} className="text-label-lg text-primary">
                  {href}
                </Link>
              </div>
              {[false, true].map((dark) => (
                <div key={String(dark)} className="relative mt-4 flex items-start gap-6 overflow-x-auto pb-2">
                  <div className="w-16 shrink-0 pt-2 text-label-lg text-on-surface-variant">{dark ? "Dark" : "Light"}</div>
                  {SIZES.map(([label, w, h, icon]) => (
                    <figure key={label} className="m-0 shrink-0">
                      <figcaption className="mb-2 flex items-center gap-2 text-label-md text-on-surface-variant">
                        <Icon name={icon} size={18} />
                        {label} × {h}
                      </figcaption>
                      <Frame src={src(href, dark)} title={`${name} ${label} ${dark ? "dark" : "light"}`} width={w} height={h} zoom={zoom} />
                    </figure>
                  ))}
                </div>
              ))}
            </section>
          ))}
        </div>
      </div>
    </LoadQueueContext.Provider>
  )
}
