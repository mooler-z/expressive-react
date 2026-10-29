import * as React from "react"

import { Icon } from "@/components/ui/icon"
import { cn } from "@/lib/utils"

/*
 * Specs overlay · design-reference/site/m3/site.js (ERSite.specs)
 * Any element with `data-spec="Label|Spec text"` gets a dashed tertiary outline and a number while specs are on,
 * and is listed in a side panel. Toggle with the floating "Specs" button or open a page with `?specs=1`.
 */

type Spec = { el: HTMLElement; label: string; text: string }

function collect(): Spec[] {
  return Array.from(document.querySelectorAll<HTMLElement>("[data-spec]"))
    .filter((el) => {
      const r = el.getBoundingClientRect()
      return r.width > 0 && r.height > 0 && el.offsetParent !== null
    })
    .map((el) => {
      const [label = "", text = ""] = (el.dataset.spec ?? "").split("|")
      return { el, label: label.trim(), text: text.trim() }
    })
}

// On/off lives outside the overlay so the navigation rail can host the toggle (600dp+).
let specsOn = new URLSearchParams(window.location.search).get("specs") === "1"
const specsListeners = new Set<() => void>()
export function setSpecsOn(next: boolean) {
  specsOn = next
  specsListeners.forEach((l) => l())
}
export function useSpecsOn() {
  return React.useSyncExternalStore(
    (cb) => {
      specsListeners.add(cb)
      return () => void specsListeners.delete(cb)
    },
    () => specsOn,
  )
}

export function SpecsOverlay() {
  const on = useSpecsOn()
  const [specs, setSpecs] = React.useState<Spec[]>([])
  const [hot, setHot] = React.useState<number | null>(null)
  const boxes = React.useRef<(HTMLDivElement | null)[]>([])
  const specsRef = React.useRef<Spec[]>([])
  specsRef.current = specs

  const layout = React.useCallback(() => {
    specsRef.current.forEach(({ el }, i) => {
      const box = boxes.current[i]
      if (!box) return
      const r = el.getBoundingClientRect()
      box.style.transform = `translate(${r.left}px, ${r.top}px)`
      box.style.width = `${r.width}px`
      box.style.height = `${r.height}px`
      box.style.display = r.width && r.height ? "" : "none"
      // Keep the number on screen for elements flush with the viewport edge (e.g. the header).
      box.toggleAttribute("data-edge", r.left < 12 || r.top < 12)
    })
  }, [])

  // Collect annotated elements while on; pages render lazily, so re-scan every 600ms.
  React.useEffect(() => {
    if (!on) return
    let sig = ""
    const scan = () => {
      const next = collect()
      const nextSig = next.map((s) => s.el.dataset.spec).join("\n")
      if (nextSig !== sig || next.some((s, i) => s.el !== specsRef.current[i]?.el)) {
        sig = nextSig
        setSpecs(next)
      }
      layout()
    }
    scan()
    const t = window.setInterval(scan, 600)
    let raf = 0
    const onMove = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(layout)
    }
    window.addEventListener("scroll", onMove, true)
    window.addEventListener("resize", onMove)
    return () => {
      clearInterval(t)
      cancelAnimationFrame(raf)
      window.removeEventListener("scroll", onMove, true)
      window.removeEventListener("resize", onMove)
    }
  }, [on, layout])

  React.useLayoutEffect(() => {
    if (on) layout()
  }, [on, specs, layout])

  return (
    <>
      <button
        type="button"
        aria-pressed={on}
        onClick={() => setSpecsOn(!on)}
        className={cn(
          "state-layer focus-ring fixed bottom-20 left-4 z-[94] inline-flex h-10 cursor-pointer items-center gap-2 rounded-full pr-4 pl-3 text-label-lg shadow-3 shape-morph md:hidden",
          "bg-tertiary-container text-on-tertiary-container active:rounded-md",
          on && "rounded-md bg-tertiary text-on-tertiary",
        )}
      >
        <Icon size={20}>square_foot</Icon>
        Specs
      </button>

      {on && (
        <>
          <div aria-hidden className="pointer-events-none fixed inset-0 z-[93]">
            {specs.map((_, i) => (
              <div
                key={i}
                ref={(el) => {
                  boxes.current[i] = el
                }}
                className={cn(
                  "absolute top-0 left-0 rounded-[6px] outline-offset-3 transition-[outline-color,background-color] duration-200",
                  hot === i ? "bg-tertiary/8 outline-2 outline-tertiary outline-solid" : "outline-[1.5px] outline-tertiary outline-dashed",
                )}
              >
                <span className="absolute -top-2.5 -left-2.5 grid in-data-edge:top-1 in-data-edge:left-1 h-[22px] min-w-[22px] place-items-center rounded-full bg-tertiary px-[5px] text-[11px] leading-none font-semibold text-on-tertiary shadow-1">
                  {i + 1}
                </span>
              </div>
            ))}
          </div>

          <aside
            aria-label="Interaction and motion specs"
            className={cn(
              "fixed right-3 z-[95] flex w-[min(360px,calc(100vw-24px))] flex-col overflow-hidden bg-surface-container-high text-on-surface shadow-3",
              "bottom-20 max-h-[55vh] rounded-[20px] md:top-3 md:bottom-3 md:max-h-none md:rounded-xl",
            )}
          >
            <div className="flex items-center gap-2.5 pt-4.5 pr-4 pb-2.5 pl-5.5">
              <b className="flex-1 text-title-md font-medium">Interaction &amp; motion specs</b>
              <span className="text-label-md text-on-surface-variant">{specs.length} annotated</span>
              <button
                type="button"
                aria-label="Close specs"
                onClick={() => setSpecsOn(false)}
                className="state-layer focus-ring grid size-10 cursor-pointer place-items-center rounded-full text-on-surface-variant"
              >
                <Icon size={22}>close</Icon>
              </button>
            </div>
            <ol className="flex-1 overflow-auto px-2 pt-1 pb-4">
              {specs.length === 0 && (
                <li className="px-3 py-6 text-center text-body-md text-on-surface-variant">Nothing on this page is annotated yet.</li>
              )}
              {specs.map((s, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onMouseEnter={() => setHot(i)}
                    onMouseLeave={() => setHot(null)}
                    onFocus={() => setHot(i)}
                    onBlur={() => setHot(null)}
                    onClick={() => {
                      const r = s.el.getBoundingClientRect()
                      window.scrollTo({ top: window.scrollY + r.top - 120, behavior: "smooth" })
                    }}
                    className={cn(
                      "group grid w-full cursor-pointer grid-cols-[28px_1fr] gap-2.5 rounded-lg px-3 py-2.5 text-start outline-none",
                      "hover:bg-secondary-container hover:text-on-secondary-container focus-visible:bg-secondary-container focus-visible:text-on-secondary-container",
                    )}
                  >
                    <em className="mt-px grid size-6 place-items-center rounded-full bg-tertiary text-[11px] leading-none font-semibold text-on-tertiary not-italic">
                      {i + 1}
                    </em>
                    <span>
                      <strong className="block text-title-sm font-medium">{s.label}</strong>
                      {s.text && <span className="mt-0.5 block text-body-sm text-on-surface-variant group-hover:text-current group-hover:opacity-85 group-focus-visible:text-current">{s.text}</span>}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </aside>
        </>
      )}
    </>
  )
}
