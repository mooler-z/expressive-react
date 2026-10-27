"use client"

import * as React from "react"

import { Icon } from "@/components/ui/icon"
import { IconButton, type IconButtonProps } from "@/components/ui/icon-button"
import { useDragScroll } from "@/hooks/use-drag-scroll"
import { cn } from "@/lib/utils"

/*
 * Carousel · M3 Expressive
 * The five M3 layouts. Keyline layouts (multi-browse, hero, center-hero) work like Compose's carousel:
 * every item is laid out at the large size and *masked* to the keyline it currently sits on
 * (large → medium → small → off-screen anchor), so items grow and shrink as they scroll.
 * Uncontained and full-screen use native layout with the kit's scale + parallax + label fade.
 *   item corners 28 (ExtraLarge) · gap 8 · small items 40–56 · off-screen anchors 10
 */

export type CarouselLayout = "multi-browse" | "hero" | "center-hero" | "uncontained" | "full-screen"

const KEYLINE_LAYOUTS: CarouselLayout[] = ["multi-browse", "hero", "center-hero"]
const ANCHOR = 10
const RADIUS = 28

interface CarouselContextValue {
  layout: CarouselLayout
  vertical: boolean
  itemSize?: number
  gap: number
  count: number
  index: number
  canPrev: boolean
  canNext: boolean
  goTo: (index: number) => void
  step: (delta: number) => void
  /** Internal: CarouselContent publishes its state and navigation. */
  register: (api: Partial<Pick<CarouselContextValue, "count" | "index" | "canPrev" | "canNext" | "goTo" | "step">>) => void
}

const CarouselContext = React.createContext<CarouselContextValue | null>(null)
const ItemContext = React.createContext<{ index: number; count: number }>({ index: 0, count: 0 })

export function useCarousel() {
  const ctx = React.useContext(CarouselContext)
  if (!ctx) throw new Error("Carousel parts must be used inside <Carousel>")
  return ctx
}

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  layout?: CarouselLayout
  /**
   * multi-browse: preferred large-item width (default 240). uncontained: item width (default 160).
   * hero / center-hero / full-screen size themselves from the container.
   */
  itemSize?: number
  /** Space between items in px. */
  gap?: number
  /** Advance every N ms (paused on hover, focus, hidden tab and reduced motion). */
  autoplay?: number
  onIndexChange?: (index: number) => void
}

/** Root: provides state to `CarouselContent`, `CarouselPrevious/Next`, `CarouselDots` and `CarouselCount`. */
function Carousel({
  layout = "multi-browse",
  itemSize,
  gap = 8,
  autoplay,
  onIndexChange,
  className,
  children,
  ...props
}: CarouselProps) {
  const [api, setApi] = React.useState({
    count: 0,
    index: 0,
    canPrev: false,
    canNext: false,
    goTo: (_: number) => {},
    step: (_: number) => {},
  })
  const register = React.useCallback<CarouselContextValue["register"]>(
    (next) =>
      setApi((prev) => {
        const merged = { ...prev, ...next }
        return Object.keys(next).some((k) => prev[k as keyof typeof prev] !== merged[k as keyof typeof merged]) ? merged : prev
      }),
    [],
  )

  const onIndexChangeRef = React.useRef(onIndexChange)
  onIndexChangeRef.current = onIndexChange
  React.useEffect(() => onIndexChangeRef.current?.(api.index), [api.index])

  // Autoplay
  const rootRef = React.useRef<HTMLDivElement>(null)
  const apiRef = React.useRef(api)
  apiRef.current = api
  React.useEffect(() => {
    if (!autoplay || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const t = setInterval(() => {
      const root = rootRef.current
      if (!root || document.hidden || root.matches(":hover, :focus-within")) return
      const a = apiRef.current
      a.goTo(a.index + 1 >= a.count ? 0 : a.index + 1)
    }, autoplay)
    return () => clearInterval(t)
  }, [autoplay])

  const value = React.useMemo<CarouselContextValue>(
    () => ({ layout, vertical: layout === "full-screen", itemSize, gap, register, ...api }),
    [layout, itemSize, gap, register, api],
  )

  return (
    <CarouselContext.Provider value={value}>
      <div
        ref={rootRef}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        data-layout={layout}
        className={cn("relative min-w-0", className)}
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  )
}

/* ---------- keyline math ---------- */

interface KeylineState {
  sizes: number[]
  centers: number[]
}

interface KeylineModel {
  /** Width every item is laid out at (the large size). */
  box: number
  /** Scroll distance per item. */
  unit: number
  /** Item `i` sits at keyline index `i - p + offset + 1`. */
  offset: number
  start: KeylineState
  end: KeylineState
  /** Max scroll progress in items. */
  maxP: number
  /** Items over which the start state blends into the end state. */
  blend: number
}

function buildState(visible: number[], gap: number): KeylineState {
  const sizes = [ANCHOR, ...visible, ANCHOR]
  const centers = [-gap - ANCHOR / 2]
  let x = 0
  for (const s of visible) {
    centers.push(x + s / 2)
    x += s + gap
  }
  centers.push(x + ANCHOR / 2)
  return { sizes, centers }
}

function keylineModel(layout: CarouselLayout, W: number, n: number, gap: number, itemSize = 240): KeylineModel | null {
  if (W <= 0) return null
  const S = Math.max(40, Math.min(56, W * 0.12))
  let visible: number[]
  let endVisible: number[]
  let offset = 0
  let unit: number
  let L: number

  if (layout === "hero") {
    L = Math.max(S, W - S - gap)
    visible = [L, S]
    endVisible = [S, L]
    unit = L + gap
  } else if (layout === "center-hero") {
    L = Math.max(S, W - 2 * S - 2 * gap)
    visible = endVisible = [S, L, S]
    offset = 1
    unit = L / 2 + S / 2 + gap
  } else {
    // multi-browse: fill the width exactly with nL large + medium + small, medium = (L + S) / 2
    const nL = Math.max(1, Math.round((W - 1.5 * S) / (itemSize + gap) - 0.5))
    L = (W - 1.5 * S - (nL + 1) * gap) / (nL + 0.5)
    if (L < S) L = S
    const M = (L + S) / 2
    visible = [...Array(nL).fill(L), M, S]
    endVisible = [...visible].reverse()
    unit = L + gap
  }

  const start = buildState(visible, gap)
  const end = buildState(endVisible, gap)
  if (layout === "center-hero") return { box: L, unit, offset, start, end, maxP: Math.max(0, n - 1), blend: 0 }
  const V = visible.length
  const maxP = Math.max(0, n - V)
  return { box: L, unit, offset, start, end, maxP, blend: Math.min(V - 1, maxP) }
}

function sample(state: KeylineState, idx: number, unit: number) {
  const m = state.sizes.length
  if (idx <= 0) return { size: state.sizes[0], center: state.centers[0] + idx * unit }
  if (idx >= m - 1) return { size: state.sizes[m - 1], center: state.centers[m - 1] + (idx - (m - 1)) * unit }
  const lo = Math.floor(idx)
  const f = idx - lo
  return {
    size: state.sizes[lo] + (state.sizes[lo + 1] - state.sizes[lo]) * f,
    center: state.centers[lo] + (state.centers[lo + 1] - state.centers[lo]) * f,
  }
}

/* ---------- content ---------- */

export interface CarouselContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Parallax distance for `CarouselMedia`, in % of the media size. */
  parallax?: number
  /** Native layouts: scale of an item that has fully left the viewport (1 = off). */
  minScale?: number
}

/** The scroller. Children are `CarouselItem`s. Size it with a height class (`h-56`). */
function CarouselContent({ className, style, children, parallax, minScale, onKeyDown, ...props }: CarouselContentProps) {
  const ctx = useCarousel()
  const { layout, vertical, gap, itemSize, register } = ctx
  const keyline = KEYLINE_LAYOUTS.includes(layout)
  const items = React.Children.toArray(children).filter(React.isValidElement)
  const n = items.length
  const par = parallax ?? (layout === "uncontained" ? 6 : layout === "full-screen" ? 8 : 10)
  const scaleMin = minScale ?? (layout === "uncontained" ? 0.97 : layout === "full-screen" ? 0.96 : 1)

  const scrollerRef = React.useRef<HTMLDivElement>(null)
  const wrapperRefs = React.useRef<(HTMLDivElement | null)[]>([])
  const [width, setWidth] = React.useState(0)
  const model = React.useMemo(
    () => (keyline ? keylineModel(layout, width, n, gap, itemSize) : null),
    [keyline, layout, width, n, gap, itemSize],
  )
  const modelRef = React.useRef(model)
  modelRef.current = model
  const indexRef = React.useRef(-1)

  React.useLayoutEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setWidth(el.clientWidth))
    ro.observe(el)
    setWidth(el.clientWidth)
    return () => ro.disconnect()
  }, [])

  const paint = React.useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const m = modelRef.current
    // Focal = first item within 1px of the largest visible size (stable when several are equal)
    const sizes: number[] = []

    const styleExtras = (item: HTMLElement, visibleFraction: number, k: number, mask?: { inset: number; size: number }) => {
      const media = item.querySelector<HTMLElement>("[data-slot=carousel-media]")
      if (media) media.style.transform = reduce ? "" : `${vertical ? "translateY" : "translateX"}(${(-k * par).toFixed(2)}%)`
      const label = item.querySelector<HTMLElement>("[data-slot=carousel-label]")
      if (label) {
        const o = Math.max(0, Math.min(1, (visibleFraction - (mask ? 0.62 : 0.45)) / (mask ? 0.3 : 0.4)))
        label.style.opacity = String(o)
        // Keyline layouts: keep the label inside the visible mask so text never starts clipped
        if (mask) {
          label.style.insetInlineStart = `${mask.inset.toFixed(2)}px`
          label.style.width = `${mask.size.toFixed(2)}px`
        }
        label.style.transform = reduce ? "" : `translateY(${((1 - o) * 8).toFixed(1)}px)`
      }
    }

    const sign = isRtl(el, vertical) ? -1 : 1
    if (m) {
      const W = el.clientWidth
      const p = Math.abs(el.scrollLeft) / m.unit
      const s = m.blend > 0 ? Math.max(0, Math.min(1, (p - (m.maxP - m.blend)) / m.blend)) : 0
      wrapperRefs.current.forEach((wrap, i) => {
        if (!wrap) return
        const idx = i - p + m.offset + 1
        const a = sample(m.start, idx, m.unit)
        const b = sample(m.end, idx, m.unit)
        const size = a.size + (b.size - a.size) * s
        const center = a.center + (b.center - a.center) * s
        const inset = Math.max(0, (m.box - size) / 2)
        wrap.style.transform = `translateX(${(sign * (center - m.box / 2)).toFixed(2)}px)`
        wrap.style.clipPath = `inset(0 ${inset.toFixed(2)}px round ${RADIUS}px)`
        const offscreen = center + size / 2 < 0 || center - size / 2 > W
        wrap.inert = offscreen
        wrap.toggleAttribute("data-visible", !offscreen && size > ANCHOR + 1)
        sizes[i] = offscreen ? 0 : size
        styleExtras(wrap, size / m.box, (sign * (center - W / 2)) / (W / 2), { inset, size })
      })
    } else {
      const S = vertical ? el.clientHeight : el.clientWidth
      const box = el.getBoundingClientRect()
      const kids = Array.from(el.children) as HTMLElement[]
      kids.forEach((it, i) => {
        // Physical offset inside the viewport (holds in RTL, unlike offsetLeft - scrollLeft).
        // Measured from the rect's center, which our own `scale` below doesn't move.
        const r = it.getBoundingClientRect()
        const L = vertical ? it.offsetHeight : it.offsetWidth
        const mid = vertical ? (r.top + r.bottom) / 2 - box.top - el.clientTop : (r.left + r.right) / 2 - box.left - el.clientLeft
        const s0 = mid - L / 2
        const vis = Math.max(0, Math.min(s0 + L, S) - Math.max(s0, 0)) / Math.max(1, L)
        const k = (s0 + L / 2 - S / 2) / (S / 2)
        if (!reduce && scaleMin < 1) it.style.scale = (scaleMin + (1 - scaleMin) * vis).toFixed(4)
        it.toggleAttribute("data-visible", vis > 0.5)
        sizes[i] = vis
        styleExtras(it, vis, k)
      })
    }

    const top = Math.max(0, ...sizes)
    const focal = Math.max(0, sizes.findIndex((x) => x >= top - (m ? 1 : 0.01)))
    const pos = Math.abs(vertical ? el.scrollTop : el.scrollLeft)
    const max = vertical ? el.scrollHeight - el.clientHeight : el.scrollWidth - el.clientWidth
    if (focal !== indexRef.current) {
      indexRef.current = focal
      const parent = m ? wrapperRefs.current : (Array.from(el.children) as HTMLElement[])
      parent.forEach((it, i) => it?.toggleAttribute("data-active", i === focal))
    }
    register({ index: focal, canPrev: pos > 1, canNext: pos < max - 1 })
  }, [vertical, par, scaleMin, register])

  const goTo = React.useCallback(
    (i: number) => {
      const el = scrollerRef.current
      if (!el) return
      const clamped = Math.max(0, Math.min(n - 1, i))
      const behavior: ScrollBehavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
      const m = modelRef.current
      const rtl = isRtl(el, vertical)
      if (m) {
        el.scrollTo({ left: (rtl ? -1 : 1) * Math.min(clamped, m.maxP) * m.unit, behavior })
        return
      }
      const it = el.children[clamped] as HTMLElement | undefined
      if (!it) return
      // Physical delta between the item's inline-start edge and the scroller's (minus scroll-padding)
      const cs = getComputedStyle(el)
      const r = it.getBoundingClientRect()
      const b = el.getBoundingClientRect()
      if (vertical) {
        const pad = parseFloat(cs.scrollPaddingTop) || 0
        el.scrollTo({ top: Math.max(0, el.scrollTop + r.top - b.top - pad), behavior })
      } else if (rtl) {
        const pad = parseFloat(cs.scrollPaddingRight) || 0
        el.scrollTo({ left: Math.min(0, el.scrollLeft + r.right - b.right + pad), behavior })
      } else {
        const pad = parseFloat(cs.scrollPaddingLeft) || 0
        el.scrollTo({ left: Math.max(0, el.scrollLeft + r.left - b.left - pad), behavior })
      }
    },
    [n, vertical],
  )
  const step = React.useCallback((d: number) => goTo(indexRef.current + d), [goTo])

  React.useEffect(() => register({ count: n, goTo, step }), [n, goTo, step, register])

  React.useLayoutEffect(() => {
    paint()
    const el = scrollerRef.current
    if (!el) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(paint)
    }
    el.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      el.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(raf)
    }
  }, [paint, model, n])

  useDragScroll(scrollerRef, {
    axis: vertical ? "y" : "x",
    snapTargets: React.useCallback((el: HTMLElement) => {
      const m = modelRef.current
      if (!m) return defaultSnap(el, vertical)
      const sign = isRtl(el, vertical) ? -1 : 1
      return Array.from({ length: m.maxP + 1 }, (_, i) => sign * i * m.unit)
    }, [vertical]),
  })

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e)
    if (e.defaultPrevented || e.target !== e.currentTarget) return
    const rtl = isRtl(e.currentTarget, vertical)
    const next = vertical ? "ArrowDown" : rtl ? "ArrowLeft" : "ArrowRight"
    const prev = vertical ? "ArrowUp" : rtl ? "ArrowRight" : "ArrowLeft"
    if (e.key === next || e.key === prev) {
      e.preventDefault()
      step(e.key === next ? 1 : -1)
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault()
      goTo(e.key === "Home" ? 0 : n - 1)
    }
  }

  const wrapped = items.map((child, i) => (
    <ItemContext.Provider key={child.key ?? i} value={{ index: i, count: n }}>
      {child}
    </ItemContext.Provider>
  ))

  return (
    <div
      ref={scrollerRef}
      tabIndex={0}
      data-slot="carousel-content"
      onKeyDown={handleKeyDown}
      className={cn(
        "no-scrollbar relative cursor-grab overscroll-x-contain outline-none data-dragging:cursor-grabbing",
        "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-secondary",
        vertical ? "snap-y snap-mandatory overflow-y-auto" : "snap-x snap-mandatory overflow-x-auto",
        !keyline && !vertical && "flex",
        className,
      )}
      style={!keyline && !vertical ? { gap, ...style } : style}
      {...props}
    >
      {model ? (
        <div className="relative h-full" style={{ width: width + model.maxP * model.unit }}>
          {Array.from({ length: model.maxP + 1 }, (_, i) => (
            <span key={i} aria-hidden className="absolute top-0 h-px w-px snap-start" style={{ insetInlineStart: i * model.unit }} />
          ))}
          <div className="sticky start-0 top-0 h-full overflow-hidden" style={{ width }}>
            {wrapped.map((child, i) => (
              <div
                key={i}
                ref={(el) => {
                  wrapperRefs.current[i] = el
                }}
                data-slot="carousel-slide"
                className="absolute start-0 top-0 h-full will-change-[transform,clip-path]"
                style={{ width: model.box }}
              >
                {child}
              </div>
            ))}
          </div>
        </div>
      ) : (
        keyline ? null : wrapped
      )}
    </div>
  )
}

/** Horizontal scrollers in RTL run scrollLeft from 0 down to -max; geometry is mirrored. */
function isRtl(el: HTMLElement, vertical: boolean) {
  return !vertical && getComputedStyle(el).direction === "rtl"
}

function defaultSnap(el: HTMLElement, vertical: boolean) {
  const cs = getComputedStyle(el)
  const rtl = isRtl(el, vertical)
  const pad = parseFloat(vertical ? cs.scrollPaddingTop : rtl ? cs.scrollPaddingRight : cs.scrollPaddingLeft) || 0
  const max = vertical ? el.scrollHeight - el.clientHeight : el.scrollWidth - el.clientWidth
  const [lo, hi] = rtl ? [-max, 0] : [0, max]
  const b = el.getBoundingClientRect()
  const now = vertical ? el.scrollTop : el.scrollLeft
  return (Array.from(el.children) as HTMLElement[]).map((c) => {
    const r = c.getBoundingClientRect()
    const to = vertical ? now + r.top - b.top - pad : rtl ? now + r.right - b.right + pad : now + r.left - b.left - pad
    return Math.max(lo, Math.min(hi, to))
  })
}

export interface CarouselItemProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * One slide. Color it with `bg-*`/`text-*`. In keyline layouts it fills the masked slot; in
 * uncontained give it a width (or set `itemSize` on Carousel); full-screen items fill the viewport.
 */
function CarouselItem({ className, style, ...props }: CarouselItemProps) {
  const { layout, itemSize } = useCarousel()
  const { index, count } = React.useContext(ItemContext)
  const keyline = KEYLINE_LAYOUTS.includes(layout)
  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${count}`}
      data-slot="carousel-item"
      className={cn(
        "relative overflow-hidden",
        keyline && "h-full w-full",
        layout === "uncontained" && "h-full shrink-0 snap-start",
        layout === "full-screen" && "h-full w-full snap-start",
        className,
      )}
      style={layout === "uncontained" && itemSize ? { width: itemSize, ...style } : style}
      {...props}
    />
  )
}

/** Background layer that drifts with scroll (parallax). Put artwork or an <img> inside. */
function CarouselMedia({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden
      data-slot="carousel-media"
      className={cn("pointer-events-none absolute inset-0 will-change-transform", className)}
      {...props}
    />
  )
}

/** Text over the media. Fades and drops as the item shrinks or leaves the viewport. */
function CarouselLabel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="carousel-label" className={cn("absolute inset-x-0 bottom-0 p-4", className)} {...props} />
}

type NavButtonProps = Omit<IconButtonProps, "aria-label" | "aria-labelledby" | "children" | "onPress"> & {
  "aria-label"?: string
}

function CarouselPrevious({ variant = "outlined", size = "sm", ...props }: NavButtonProps) {
  const { step, canPrev, vertical } = useCarousel()
  return (
    <IconButton
      aria-label="Previous"
      variant={variant}
      size={size}
      isDisabled={!canPrev}
      onPress={() => step(-1)}
      data-slot="carousel-previous"
      {...props}
    >
      <Icon className="rtl:-scale-x-100">{vertical ? "keyboard_arrow_up" : "chevron_left"}</Icon>
    </IconButton>
  )
}

function CarouselNext({ variant = "outlined", size = "sm", ...props }: NavButtonProps) {
  const { step, canNext, vertical } = useCarousel()
  return (
    <IconButton
      aria-label="Next"
      variant={variant}
      size={size}
      isDisabled={!canNext}
      onPress={() => step(1)}
      data-slot="carousel-next"
      {...props}
    >
      <Icon className="rtl:-scale-x-100">{vertical ? "keyboard_arrow_down" : "chevron_right"}</Icon>
    </IconButton>
  )
}

/** Page indicator: the active dot stretches into a pill. */
function CarouselDots({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { count, index, goTo, vertical } = useCarousel()
  return (
    <div data-slot="carousel-dots" className={cn("flex items-center justify-center gap-1.5", vertical && "flex-col", className)} {...props}>
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Go to item ${i + 1}`}
          aria-current={i === index || undefined}
          data-active={i === index || undefined}
          onClick={() => goTo(i)}
          className={cn(
            "focus-ring size-2 cursor-pointer rounded-full bg-outline-variant",
            "transition-[width,height,background-color] duration-(--md-spring-fast-spatial-duration) ease-fast-spatial",
            "data-active:bg-primary",
            vertical ? "data-active:h-5" : "data-active:w-5",
          )}
        />
      ))}
    </div>
  )
}

/** "3 / 7" position readout. */
function CarouselCount({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  const { count, index } = useCarousel()
  return (
    <span data-slot="carousel-count" className={cn("font-mono text-label-md text-on-surface-variant tabular-nums", className)} {...props}>
      {count ? index + 1 : 0} / {count}
    </span>
  )
}

export {
  Carousel,
  CarouselContent,
  CarouselCount,
  CarouselDots,
  CarouselItem,
  CarouselLabel,
  CarouselMedia,
  CarouselNext,
  CarouselPrevious,
}
