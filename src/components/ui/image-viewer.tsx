"use client"

import * as React from "react"
import {
  Button as AriaButton,
  Dialog as AriaDialog,
  GridList,
  GridListItem,
  Link as AriaLink,
  Modal,
  ModalOverlay,
  OverlayTriggerStateContext,
  composeRenderProps,
  useLocale,
  type ButtonProps as AriaButtonProps,
  type Selection,
} from "react-aria-components"

import { Icon } from "@/components/ui/icon"
import { IconButton, iconButtonVariants } from "@/components/ui/icon-button"
import { LoadingIndicator } from "@/components/ui/loading-indicator"
import { Ripple } from "@/components/ui/ripple"
import { ThemeScope } from "@/components/ui/theme-provider"
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn, tv } from "@/lib/utils"

/*
 * Image viewer · full-screen media viewer built from M3 parts (M3 has no lightbox component)
 *   Always dark: a scrim backdrop (100%) with the content in a dark ThemeScope, so the app's seed or preset
 *   still drives the roles, and icon buttons, the focus ring and text get real dark-scheme colors on light and
 *   dark pages alike. (Inverse roles flip with the page; a bare `.dark` class would drop the seed.)
 *   Top bar 64dp: standard icon buttons S (40dp, 24dp icon) · counter title-medium on-surface.
 *   Previous / next: tonal icon buttons M (56dp) from 600dp, S (40dp) below.
 *   Caption: title-medium on-surface · body-medium on-surface-variant (2 lines).
 *   Thumbnails: 56dp, corner medium 12dp → small 8dp pressed (ShapeTokens.CornerMedium / CornerSmall),
 *     selected = 2dp primary ring with a 2dp scrim gap.
 *   Image: fitted inside the stage with a 16dp margin and never upscaled; zoom 1× (fit) … maxZoom (8×),
 *     ×1.5 per step, double-tap toggles fit ↔ 2×; rotation in 90° steps; panning clamps to the image bounds.
 *   Motion: zoom, pan, rotate and the image enter/slide ride the Expressive FastSpatial spring
 *     (androidx ExpressiveMotionTokens: ζ 0.6, k 800); fades ride FastEffects / DefaultEffects.
 *     Reduced motion drops every spatial animation and keeps the fades.
 *
 * <ViewableImage src={photo} alt="Maya Lindqvist" className="size-12 rounded-md" />
 * <ImageGallery images={photos} aria-label="Field trip" />
 * <ImageViewer images={photos} isOpen={open} onOpenChange={setOpen} index={i} onIndexChange={setI} />
 */

export interface ImageViewerItem {
  /** Image shown in the viewer. */
  src: string
  /** Alternative text. It names the image for screen readers, the thumbnails and the live announcement. */
  alt: string
  /** Caption title under the image. */
  title?: string
  /** Caption text under the title (clamped to two lines). */
  description?: string
  /** Smaller image for the thumbnail strip and the gallery grid. Defaults to `src`. */
  thumbnailSrc?: string
  /** Adds a download action for this image. Cross-origin URLs open in a new tab instead (browser rule). */
  downloadUrl?: string
  /** CORS mode, as on `<img crossorigin>`. */
  crossOrigin?: "anonymous" | "use-credentials"
}

const imageViewerVariants = tv({
  slots: {
    overlay: "fixed inset-0 z-50 bg-scrim data-entering:image-viewer-backdrop-enter data-exiting:m3-overlay-exit",
    modal: "size-full outline-none",
    dialog: "relative flex size-full flex-col overflow-hidden text-on-surface outline-none select-none",
    bar: "relative z-10 box-content flex h-16 shrink-0 items-center gap-1 bg-linear-to-b from-scrim/60 to-scrim/0 px-2 pt-[env(safe-area-inset-top)]",
    counter: "ms-2 text-title-md text-on-surface tabular-nums",
    actions: "ms-auto flex items-center gap-1",
    stage: "relative z-0 min-h-0 flex-1",
    layer: "absolute inset-0 grid touch-none place-items-center data-zoomed:cursor-grab data-zoomed:active:cursor-grabbing",
    image: [
      "max-w-none origin-center will-change-transform",
      "transition-[transform] duration-(--md-spring-fast-spatial-duration) ease-fast-spatial",
      "data-live:transition-none motion-reduce:transition-none",
    ],
    nav: "absolute top-1/2 z-10 -translate-y-1/2",
    footer: [
      "relative z-10 flex shrink-0 flex-col items-center gap-3 bg-linear-to-t from-scrim/60 to-scrim/0",
      "px-4 pt-6 pb-[max(16px,env(safe-area-inset-bottom))]",
    ],
    caption: "flex w-full max-w-[600px] flex-col items-center gap-1 text-center",
    title: "max-w-full truncate text-title-md text-on-surface",
    description: "line-clamp-2 text-body-md text-on-surface-variant",
    thumbnails: "no-scrollbar relative flex max-w-full justify-center-safe gap-2 overflow-x-auto p-2",
    thumbnail: [
      "focus-ring state-layer shape-morph relative size-14 shrink-0 cursor-pointer overflow-hidden rounded-[12px] bg-surface-container-highest",
      "opacity-60 data-hovered:opacity-100 data-pressed:rounded-[8px]",
      "data-selected:opacity-100 data-selected:ring-2 data-selected:ring-primary data-selected:ring-offset-2 data-selected:ring-offset-scrim",
    ],
  },
})

/** Plain tooltips here use the dark scheme's look (a light container) whatever the page mode: fixed roles don't flip. */
const viewerTooltip = "bg-secondary-fixed text-on-secondary-fixed"

type View = { zoom: number; rotation: number; x: number; y: number }
type Size = { width: number; height: number }
type Point = { x: number; y: number }
type Gesture = {
  kind: "pan" | "swipe" | "pinch"
  /** Pointer position at the start (pan / swipe). */
  x: number
  y: number
  view: View
  moved: boolean
  onImage: boolean
  /** Finger distance and midpoint at the start (pinch). */
  distance: number
  mid: Point
}

const HOME: View = { zoom: 1, rotation: 0, x: 0, y: 0 }
const MARGIN = 16
const ZOOM_STEP = 1.5
const DOUBLE_TAP_MS = 300
const TAP_SLOP = 6

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))
/** Past a bound, follow the pointer at 30% (rubber band); release springs back. */
const rubber = (v: number, limit: number) => (v > limit ? limit + (v - limit) * 0.3 : v < -limit ? -limit + (v + limit) * 0.3 : v)

/** Layout size of the <img> (the unrotated fit), the extra scale a quarter turn needs, and the on-screen box at zoom 1. */
function fitImage(natural: Size, stage: Size, rotation: number) {
  const turned = Math.abs(Math.round(rotation / 90)) % 2 === 1
  const w = Math.max(1, stage.width - MARGIN * 2)
  const h = Math.max(1, stage.height - MARGIN * 2)
  const fit = (iw: number, ih: number) => Math.min(1, w / iw, h / ih)
  const base = fit(natural.width, natural.height)
  const scale = turned ? fit(natural.height, natural.width) : base
  return {
    width: natural.width * base,
    height: natural.height * base,
    turn: scale / base,
    boxWidth: (turned ? natural.height : natural.width) * scale,
    boxHeight: (turned ? natural.width : natural.height) * scale,
  }
}

function useControlledIndex(value: number | undefined, defaultValue: number, onChange?: (index: number) => void) {
  const [inner, setInner] = React.useState(defaultValue)
  const controlled = value !== undefined
  const set = React.useCallback(
    (next: number) => {
      if (!controlled) setInner(next)
      onChange?.(next)
    },
    [controlled, onChange],
  )
  return [controlled ? value : inner, set] as const
}

export interface ImageViewerProps {
  images: ImageViewerItem[]
  /** Controlled open state. Without it (and without `defaultOpen`), a surrounding React Aria DialogTrigger controls it. */
  isOpen?: boolean
  defaultOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
  /** Controlled index of the image on screen. */
  index?: number
  defaultIndex?: number
  onIndexChange?: (index: number) => void
  /** Strip of thumbnails under the image (sets of two or more). */
  showThumbnails?: boolean
  /** Previous on the first image goes to the last, and next on the last to the first. */
  loop?: boolean
  /** Largest zoom, as a multiple of the fitted size. */
  maxZoom?: number
  /** Close when the empty area around the image is tapped or clicked. */
  isDismissable?: boolean
  /** Accessible name of the dialog. */
  "aria-label"?: string
  /** Classes for the full-screen dialog. */
  className?: string
}

/** Full-screen viewer: zoom, pan, rotate and browse a set of images. React Aria Modal + Dialog (focus trap, Esc, scroll lock). */
function ImageViewer({
  images,
  isOpen,
  defaultOpen,
  onOpenChange,
  index,
  defaultIndex = 0,
  onIndexChange,
  showThumbnails = false,
  loop = true,
  maxZoom = 8,
  isDismissable = true,
  "aria-label": ariaLabel = "Image viewer",
  className,
}: ImageViewerProps) {
  const [current, setCurrent] = useControlledIndex(index, defaultIndex, onIndexChange)
  const { overlay, modal } = imageViewerVariants()
  if (!images.length) return null
  return (
    <ModalOverlay
      data-slot="image-viewer-overlay"
      isOpen={isOpen}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      className={overlay()}
    >
      <Modal className={modal()}>
        <ImageViewerContent
          images={images}
          index={clamp(current, 0, images.length - 1)}
          onIndexChange={setCurrent}
          showThumbnails={showThumbnails}
          loop={loop}
          maxZoom={Math.max(1, maxZoom)}
          isDismissable={isDismissable}
          ariaLabel={ariaLabel}
          className={className}
        />
      </Modal>
    </ModalOverlay>
  )
}

interface ImageViewerContentProps {
  images: ImageViewerItem[]
  index: number
  onIndexChange: (index: number) => void
  showThumbnails: boolean
  loop: boolean
  maxZoom: number
  isDismissable: boolean
  ariaLabel: string
  className?: string
}

/** Mounted only while open, so zoom, rotation and load state start fresh every time. */
function ImageViewerContent({
  images,
  index,
  onIndexChange,
  showThumbnails,
  loop,
  maxZoom,
  isDismissable,
  ariaLabel,
  className,
}: ImageViewerContentProps) {
  const s = imageViewerVariants()
  const overlayState = React.useContext(OverlayTriggerStateContext)
  const { direction } = useLocale()
  const rtl = direction === "rtl"
  const wide = useMediaQuery("(min-width: 600px)")
  const count = images.length
  const item = images[index]

  const dialogRef = React.useRef<HTMLElement>(null)
  const stageRef = React.useRef<HTMLDivElement>(null)
  const layerRef = React.useRef<HTMLDivElement>(null)
  const imageRef = React.useRef<HTMLImageElement>(null)
  const stripRef = React.useRef<HTMLDivElement>(null)

  // View state belongs to one image: it resets whenever the index changes, here or from the parent.
  const [slot, setSlot] = React.useState({ index, dir: 0, view: HOME })
  if (slot.index !== index) setSlot({ index, dir: Math.sign(index - slot.index), view: HOME })
  const view = slot.index === index ? slot.view : HOME
  const viewRef = React.useRef(view)
  React.useLayoutEffect(() => {
    viewRef.current = view
  })
  const setView = React.useCallback((next: View) => {
    viewRef.current = next
    setSlot((s) => ({ ...s, view: next }))
  }, [])
  /** True while input drives the transform directly (drag, pinch, wheel): no spring in between. */
  const [live, setLive] = React.useState(false)

  const [stage, setStage] = React.useState<Size>({ width: 0, height: 0 })
  React.useLayoutEffect(() => {
    const el = stageRef.current
    if (!el) return
    const measure = () => setStage({ width: el.clientWidth, height: el.clientHeight })
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const [natural, setNatural] = React.useState<(Size & { src: string }) | null>(null)
  const [failed, setFailed] = React.useState<string | null>(null)
  const ready = natural?.src === item.src
  const error = failed === item.src
  const fit = ready ? fitImage(natural, stage, view.rotation) : null

  const geo = React.useRef({ natural: null as Size | null, stage, maxZoom })
  React.useLayoutEffect(() => {
    geo.current = { natural: ready ? natural : null, stage, maxZoom }
  })

  /** How far the image may move from center at a zoom and rotation. */
  const limits = React.useCallback((zoom: number, rotation: number): Point => {
    const { natural, stage } = geo.current
    if (!natural) return { x: 0, y: 0 }
    const f = fitImage(natural, stage, rotation)
    return { x: Math.max(0, (f.boxWidth * zoom - stage.width) / 2), y: Math.max(0, (f.boxHeight * zoom - stage.height) / 2) }
  }, [])

  const settle = React.useCallback(
    (v: View): View => {
      if (v.zoom <= 1) return { ...v, zoom: 1, x: 0, y: 0 }
      const l = limits(v.zoom, v.rotation)
      return { ...v, x: clamp(v.x, -l.x, l.x), y: clamp(v.y, -l.y, l.y) }
    },
    [limits],
  )

  /** Stage-center coordinates of a client point. */
  const toStage = React.useCallback((clientX: number, clientY: number): Point => {
    const r = stageRef.current?.getBoundingClientRect()
    return r ? { x: clientX - r.left - r.width / 2, y: clientY - r.top - r.height / 2 } : { x: 0, y: 0 }
  }, [])

  /** Zoom keeping the image point under `at` (stage-center coordinates) in place. No-op until the image has loaded. */
  const zoomTo = React.useCallback(
    (zoom: number, at: Point = { x: 0, y: 0 }) => {
      if (!geo.current.natural) return
      const v = viewRef.current
      const z = clamp(zoom, 1, geo.current.maxZoom)
      const r = z / v.zoom
      setView(settle({ ...v, zoom: z, x: at.x - (at.x - v.x) * r, y: at.y - (at.y - v.y) * r }))
    },
    [setView, settle],
  )
  const zoomIn = () => zoomTo(viewRef.current.zoom * ZOOM_STEP)
  const zoomOut = () => {
    const z = viewRef.current.zoom / ZOOM_STEP
    zoomTo(z < 1.05 ? 1 : z)
  }
  const panBy = React.useCallback(
    (dx: number, dy: number) => {
      const v = viewRef.current
      if (v.zoom > 1) setView(settle({ ...v, x: v.x + dx, y: v.y + dy }))
    },
    [setView, settle],
  )
  /** Quarter turn; the pan offset turns with the image. */
  const rotate = (turn: 1 | -1) => {
    if (!geo.current.natural) return
    const v = viewRef.current
    setView(settle({ ...v, rotation: v.rotation + 90 * turn, x: turn === 1 ? -v.y : v.y, y: turn === 1 ? v.x : -v.x }))
  }
  /** Back to fit; rotation unwinds to the nearest full turn so it never spins the long way. */
  const reset = () => setView({ ...HOME, rotation: Math.round(viewRef.current.rotation / 360) * 360 })

  const canPrev = count > 1 && (loop || index > 0)
  const canNext = count > 1 && (loop || index < count - 1)
  const select = (next: number, dir: number) => {
    if (next === index) return
    viewRef.current = HOME
    setSlot({ index: next, dir, view: HOME })
    onIndexChange(next)
  }
  const go = (dir: 1 | -1) => {
    if (dir === 1 ? !canNext : !canPrev) return
    select((index + dir + count) % count, dir)
  }

  // Preload the neighbours so browsing doesn't wait on the network.
  React.useEffect(() => {
    if (count < 2) return
    for (const i of [index + 1, index - 1]) {
      const next = images[(i + count) % count]
      const img = new Image()
      if (next.crossOrigin) img.crossOrigin = next.crossOrigin
      img.src = next.src
    }
  }, [images, index, count])

  // Keep the selected thumbnail in view (scrolls the strip only, in both directions).
  React.useEffect(() => {
    const strip = stripRef.current
    const el = strip?.querySelector<HTMLElement>(`[data-key="${index}"]`)
    if (!strip || !el) return
    const a = el.getBoundingClientRect()
    const b = strip.getBoundingClientRect()
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    strip.scrollBy({ left: a.left + a.width / 2 - (b.left + b.width / 2), behavior: smooth ? "smooth" : "auto" })
  }, [index])

  const zoomInDisabled = view.zoom >= maxZoom - 1e-3
  const zoomOutDisabled = view.zoom <= 1 + 1e-3
  const hasDownload = !!item.downloadUrl
  // A focused control that becomes disabled or disappears drops focus to <body>; hand it to the dialog instead.
  React.useEffect(() => {
    const active = document.activeElement
    if (!dialogRef.current || (active && active !== document.body && !active.matches(":disabled"))) return
    dialogRef.current.focus()
  }, [zoomInDisabled, zoomOutDisabled, hasDownload, index])

  /* ---------- pointer gestures: pan, swipe, pinch, (double) tap ---------- */
  const pointers = React.useRef(new Map<number, Point>())
  const gesture = React.useRef<Gesture | null>(null)
  const lastTap = React.useRef<{ time: number; x: number; y: number } | null>(null)

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return
    e.currentTarget.setPointerCapture(e.pointerId)
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    const v = viewRef.current
    if (pointers.current.size === 1) {
      gesture.current = {
        kind: v.zoom > 1 ? "pan" : "swipe",
        x: e.clientX,
        y: e.clientY,
        view: v,
        moved: false,
        onImage: !!imageRef.current?.contains(e.target as Node),
        distance: 0,
        mid: { x: 0, y: 0 },
      }
    } else if (pointers.current.size === 2 && geo.current.natural) {
      const [a, b] = [...pointers.current.values()]
      gesture.current = {
        kind: "pinch",
        x: 0,
        y: 0,
        view: v,
        moved: true,
        onImage: true,
        distance: Math.hypot(a.x - b.x, a.y - b.y) || 1,
        mid: toStage((a.x + b.x) / 2, (a.y + b.y) / 2),
      }
    }
    setLive(true)
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(e.pointerId)) return
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    const g = gesture.current
    if (!g) return
    if (g.kind === "pinch") {
      if (pointers.current.size < 2) return
      const [a, b] = [...pointers.current.values()]
      const mid = toStage((a.x + b.x) / 2, (a.y + b.y) / 2)
      const zoom = clamp(g.view.zoom * (Math.hypot(a.x - b.x, a.y - b.y) / g.distance), 0.75, geo.current.maxZoom)
      const r = zoom / g.view.zoom
      setView({ ...g.view, zoom, x: mid.x - (g.mid.x - g.view.x) * r, y: mid.y - (g.mid.y - g.view.y) * r })
      return
    }
    if (pointers.current.size > 1) return
    const dx = e.clientX - g.x
    const dy = e.clientY - g.y
    if (!g.moved && Math.hypot(dx, dy) < TAP_SLOP) return
    g.moved = true
    if (g.kind === "pan") {
      const l = limits(g.view.zoom, g.view.rotation)
      setView({ ...g.view, x: rubber(g.view.x + dx, l.x), y: rubber(g.view.y + dy, l.y) })
    } else {
      const forward = rtl ? dx > 0 : dx < 0
      setView({ ...g.view, x: (forward ? canNext : canPrev) ? dx : dx * 0.3 })
    }
  }

  const onTap = (e: React.PointerEvent<HTMLDivElement>, g: Gesture) => {
    const last = lastTap.current
    if (last && e.timeStamp - last.time < DOUBLE_TAP_MS && Math.hypot(e.clientX - last.x, e.clientY - last.y) < 30) {
      lastTap.current = null
      const v = viewRef.current
      if (v.zoom > 1) setView(settle({ ...v, zoom: 1 }))
      else zoomTo(Math.min(2, maxZoom), toStage(e.clientX, e.clientY))
      return
    }
    lastTap.current = { time: e.timeStamp, x: e.clientX, y: e.clientY }
    if (!g.onImage && isDismissable) overlayState?.close()
  }

  const onPointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pointers.current.delete(e.pointerId)) return
    const g = gesture.current
    if (!g) return
    if (g.kind === "pinch" && pointers.current.size === 1) {
      // One finger lifted: keep panning with the other
      const [p] = [...pointers.current.values()]
      gesture.current = { ...g, kind: "pan", x: p.x, y: p.y, view: viewRef.current }
      return
    }
    if (pointers.current.size > 0) return
    gesture.current = null
    setLive(false)
    if (g.kind !== "pinch" && !g.moved) {
      if (e.type === "pointerup") onTap(e, g)
      return
    }
    if (g.kind === "swipe") {
      const dx = e.clientX - g.x
      const forward = rtl ? dx > 0 : dx < 0
      if (e.type === "pointerup" && Math.abs(dx) > Math.min(80, stage.width * 0.2) && (forward ? canNext : canPrev)) {
        go(forward ? 1 : -1)
        return
      }
    }
    setView(settle(viewRef.current))
  }

  /* ---------- ctrl/⌘ + wheel, trackpad pinch (wheel + ctrlKey; Safari gesture events), wheel pan ---------- */
  const actions = React.useRef({ zoomTo, panBy, toStage })
  React.useLayoutEffect(() => {
    actions.current = { zoomTo, panBy, toStage }
  })
  React.useEffect(() => {
    const el = layerRef.current
    if (!el) return
    let idle: number | undefined
    const settleSoon = () => {
      setLive(true)
      window.clearTimeout(idle)
      idle = window.setTimeout(() => setLive(false), 160)
    }
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? el.clientHeight : 1
      const { zoomTo, panBy, toStage } = actions.current
      if (e.ctrlKey || e.metaKey) {
        const d = clamp(e.deltaY * unit, -24, 24)
        zoomTo(viewRef.current.zoom * Math.exp(-d / 100), toStage(e.clientX, e.clientY))
      } else if (viewRef.current.zoom > 1) {
        panBy(-e.deltaX * unit, -e.deltaY * unit)
      } else return
      settleSoon()
    }
    type GestureEvent = Event & { scale: number; clientX: number; clientY: number }
    let start = 1
    const onGestureStart = (e: Event) => {
      if (pointers.current.size) return // touch pinch is handled by pointer events
      e.preventDefault()
      start = viewRef.current.zoom
    }
    const onGestureChange = (e: Event) => {
      if (pointers.current.size) return
      e.preventDefault()
      const g = e as GestureEvent
      actions.current.zoomTo(start * g.scale, actions.current.toStage(g.clientX, g.clientY))
      settleSoon()
    }
    el.addEventListener("wheel", onWheel, { passive: false })
    el.addEventListener("gesturestart", onGestureStart)
    el.addEventListener("gesturechange", onGestureChange)
    return () => {
      window.clearTimeout(idle)
      el.removeEventListener("wheel", onWheel)
      el.removeEventListener("gesturestart", onGestureStart)
      el.removeEventListener("gesturechange", onGestureChange)
    }
  }, [])

  /* ---------- keyboard ---------- */
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return
    // Arrow keys inside composite widgets (the thumbnail grid) belong to React Aria.
    const inWidget = !!(e.target as Element).closest?.('[role="grid"], [role="listbox"], [role="toolbar"], [role="tablist"], [role="slider"], input, textarea')
    const v = viewRef.current
    const step = Math.max(40, Math.min(stage.width, stage.height) * 0.1)
    switch (e.key) {
      case "ArrowLeft":
      case "ArrowRight":
      case "ArrowUp":
      case "ArrowDown":
        if (inWidget) return
        if (v.zoom > 1) {
          panBy(
            e.key === "ArrowLeft" ? step : e.key === "ArrowRight" ? -step : 0,
            e.key === "ArrowUp" ? step : e.key === "ArrowDown" ? -step : 0,
          )
        } else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
          go((e.key === "ArrowRight") !== rtl ? 1 : -1)
        } else return
        break
      case "+":
      case "=":
        zoomIn()
        break
      case "-":
      case "_":
        zoomOut()
        break
      case "0":
        reset()
        break
      case "r":
      case "R":
        rotate(e.shiftKey ? -1 : 1)
        break
      default:
        return
    }
    e.preventDefault()
  }

  const thumbs = showThumbnails && count > 1
  const anyTitle = images.some((i) => i.title)
  const anyDescription = images.some((i) => i.description)
  const prevKey = rtl ? "→" : "←"
  const nextKey = rtl ? "←" : "→"

  return (
    // Dark scheme of the app's own theme. `contents`: no box, it only scopes the roles (and hears keys bubbling from the dialog).
    <ThemeScope mode="dark" className="contents" onKeyDown={onKeyDown}>
      <AriaDialog ref={dialogRef} data-slot="image-viewer" aria-label={ariaLabel} dir={direction} className={s.dialog({ className })}>
        <div data-slot="image-viewer-bar" className={s.bar()}>
          <ViewerAction label="Close" shortcut="Esc" icon="close" slot="close" />
          {count > 1 && (
            <span aria-hidden className={s.counter()}>
              {index + 1} / {count}
            </span>
          )}
          <div className={s.actions()}>
            <ViewerAction label="Zoom out" shortcut="−" icon="zoom_out" isDisabled={zoomOutDisabled} onPress={zoomOut} />
            <ViewerAction label="Zoom in" shortcut="+" icon="zoom_in" isDisabled={zoomInDisabled} onPress={zoomIn} />
            <ViewerAction label="Rotate" shortcut="R" icon="rotate_right" onPress={() => rotate(1)} />
            <ViewerAction label="Reset" shortcut="0" icon="fit_screen" onPress={reset} />
            {item.downloadUrl && (
              <TooltipTrigger>
                <AriaLink
                  href={item.downloadUrl}
                  download
                  target="_blank"
                  rel="noopener"
                  aria-label="Download"
                  className={iconButtonVariants({ size: "sm" })}
                >
                  <Icon name="download" />
                  <Ripple />
                </AriaLink>
                <Tooltip placement="bottom" className={viewerTooltip}>
                  Download
                </Tooltip>
              </TooltipTrigger>
            )}
          </div>
        </div>

        <div ref={stageRef} data-slot="image-viewer-stage" className={s.stage()}>
          <div
            ref={layerRef}
            className={s.layer()}
            data-zoomed={view.zoom > 1 || undefined}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerEnd}
            onPointerCancel={onPointerEnd}
          >
            {error ? (
              <div className="flex flex-col items-center gap-3 px-6 text-center text-on-surface-variant">
                <Icon name="broken_image" size={48} />
                <p className="text-body-md">Couldn't load this image</p>
              </div>
            ) : (
              <img
                key={index}
                ref={imageRef}
                data-slot="image-viewer-image"
                src={item.src}
                alt={item.alt}
                crossOrigin={item.crossOrigin}
                draggable={false}
                data-live={live || undefined}
                onLoad={(e) => {
                  const img = e.currentTarget
                  setNatural({ src: item.src, width: img.naturalWidth || stage.width, height: img.naturalHeight || stage.height })
                }}
                onError={() => setFailed(item.src)}
                className={s.image({
                  className: fit ? (slot.dir ? "image-viewer-slide" : "image-viewer-enter") : "size-px opacity-0",
                })}
                style={
                  fit
                    ? ({
                        width: fit.width,
                        height: fit.height,
                        transform: `translate(${view.x}px, ${view.y}px) rotate(${view.rotation}deg) scale(${view.zoom * fit.turn})`,
                        "--image-viewer-from": `${slot.dir * (rtl ? -12 : 12)}%`,
                      } as React.CSSProperties)
                    : undefined
                }
              />
            )}
            {!ready && !error && <LoadingIndicator aria-label="Loading image" className="image-viewer-loading absolute inset-0 m-auto" />}
          </div>

          {count > 1 && (
            <>
              <ViewerAction
                label="Previous"
                shortcut={prevKey}
                icon="chevron_left"
                variant="tonal"
                size={wide ? "md" : "sm"}
                isDisabled={!canPrev}
                onPress={() => go(-1)}
                className={s.nav({ className: "start-2 md:start-4" })}
                iconClassName="rtl:-scale-x-100"
              />
              <ViewerAction
                label="Next"
                shortcut={nextKey}
                icon="chevron_right"
                variant="tonal"
                size={wide ? "md" : "sm"}
                isDisabled={!canNext}
                onPress={() => go(1)}
                className={s.nav({ className: "end-2 md:end-4" })}
                iconClassName="rtl:-scale-x-100"
              />
            </>
          )}
        </div>

        {(anyTitle || anyDescription || thumbs) && (
          <div data-slot="image-viewer-footer" className={s.footer()}>
            {(anyTitle || anyDescription) && (
              // Height reserved for the tallest caption in the set, so the image doesn't jump between slides
              <div
                data-slot="image-viewer-caption"
                className={s.caption()}
                style={{ minHeight: (anyTitle ? 24 : 0) + (anyDescription ? 40 : 0) + (anyTitle && anyDescription ? 4 : 0) }}
              >
                {/* dir="auto": captions are content, so they take their own text's direction */}
                {item.title && (
                  <p dir="auto" className={s.title()}>
                    {item.title}
                  </p>
                )}
                {item.description && (
                  <p dir="auto" className={s.description()}>
                    {item.description}
                  </p>
                )}
              </div>
            )}
            {thumbs && (
              <GridList
                ref={stripRef}
                data-slot="image-viewer-thumbnails"
                aria-label="Thumbnails"
                layout="grid"
                selectionMode="single"
                selectionBehavior="replace"
                disallowEmptySelection
                disallowTypeAhead
                // Esc closes the viewer instead of trying to clear the (required) selection
                escapeKeyBehavior="none"
                selectedKeys={[index]}
                onSelectionChange={(keys: Selection) => {
                  if (keys === "all") return
                  const [key] = keys
                  if (key != null) select(Number(key), Number(key) > index ? 1 : -1)
                }}
                className={s.thumbnails()}
              >
                {images.map((img, i) => (
                  <GridListItem key={i} id={i} textValue={img.alt} className={s.thumbnail()}>
                    <img
                      src={img.thumbnailSrc ?? img.src}
                      alt={img.alt}
                      crossOrigin={img.crossOrigin}
                      draggable={false}
                      loading="lazy"
                      className="size-full object-cover"
                    />
                  </GridListItem>
                ))}
              </GridList>
            )}
          </div>
        )}

        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {count > 1 ? `${item.title ?? item.alt}, ${index + 1} of ${count}` : ""}
        </div>
      </AriaDialog>
    </ThemeScope>
  )
}

type ViewerActionProps = Omit<AriaButtonProps, "children" | "className"> & {
  label: string
  icon: string
  shortcut?: string
  variant?: "standard" | "tonal"
  size?: "sm" | "md"
  className?: string
  iconClassName?: string
}

/** Icon button with an M3 plain tooltip that shows its keyboard shortcut. */
function ViewerAction({ label, icon, shortcut, variant = "standard", size = "sm", className, iconClassName, ...props }: ViewerActionProps) {
  return (
    <TooltipTrigger>
      <IconButton aria-label={label} variant={variant} size={size} className={className} {...props}>
        <Icon name={icon} className={iconClassName} />
      </IconButton>
      <Tooltip placement={variant === "standard" ? "bottom" : "top"} shortcut={shortcut} className={viewerTooltip}>
        {label}
      </Tooltip>
    </TooltipTrigger>
  )
}

/* ---------------------------------------------------------------------------------------------- */

type ViewerOptions = Omit<ImageViewerProps, "images" | "isOpen" | "defaultOpen" | "onOpenChange" | "index" | "defaultIndex" | "onIndexChange">

export interface ViewableImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "alt" | "title" | "className" | "crossOrigin" | "children"> {
  src: string
  /** Alternative text; also the button's accessible name. */
  alt: string
  /** Larger version to show in the viewer. Defaults to `src`. */
  fullSrc?: string
  /** Caption title in the viewer. */
  title?: string
  /** Caption text in the viewer. */
  description?: string
  /** Adds a download action in the viewer. */
  downloadUrl?: string
  crossOrigin?: ImageViewerItem["crossOrigin"]
  /** Classes for the pressable frame: size, corners. The image fills it (object-cover) and inherits its corners. */
  className?: string
  /** Classes for the <img> itself, e.g. object-contain. */
  imageClassName?: string
  isDisabled?: boolean
  /** Options for the viewer it opens (maxZoom, isDismissable…). */
  viewerProps?: ViewerOptions
  ref?: React.Ref<HTMLButtonElement>
}

/** Drop-in <img> that opens the full-screen viewer on itself when pressed (click, tap, Enter or Space). */
function ViewableImage({
  src,
  alt,
  fullSrc,
  title,
  description,
  downloadUrl,
  crossOrigin,
  className,
  imageClassName,
  isDisabled,
  viewerProps,
  ref,
  ...imgProps
}: ViewableImageProps) {
  const [open, setOpen] = React.useState(false)
  const images = React.useMemo(
    () => [{ src: fullSrc ?? src, thumbnailSrc: src, alt, title, description, downloadUrl, crossOrigin }],
    [fullSrc, src, alt, title, description, downloadUrl, crossOrigin],
  )
  return (
    <>
      <AriaButton
        ref={ref}
        data-slot="viewable-image"
        isDisabled={isDisabled}
        aria-label={alt ? undefined : "View image"}
        aria-haspopup="dialog"
        aria-expanded={open}
        onPress={() => setOpen(true)}
        className={cn(
          "state-layer focus-ring relative inline-block shrink-0 cursor-zoom-in overflow-hidden align-middle text-on-surface select-none",
          "data-disabled:cursor-default",
          className,
        )}
      >
        <img
          src={src}
          alt={alt}
          crossOrigin={crossOrigin}
          draggable={false}
          {...imgProps}
          className={cn("block size-full rounded-[inherit] object-cover", imageClassName)}
        />
        <Ripple />
      </AriaButton>
      <ImageViewer images={images} isOpen={open} onOpenChange={setOpen} {...viewerProps} />
    </>
  )
}

export interface ImageGalleryProps {
  images: ImageViewerItem[]
  /** Accessible name of the grid. */
  "aria-label"?: string
  /** Classes for the grid. Columns default to as many 128dp-minimum tracks as fit; override with grid-cols-*. */
  className?: string
  /** Classes for each tile, e.g. aspect-video or rounded-lg. */
  itemClassName?: string
  /** Options for the viewer it opens (showThumbnails, loop, maxZoom…). */
  viewerProps?: ViewerOptions
}

/** Responsive grid of thumbnails; pressing one opens the viewer on it. React Aria GridList: one tab stop, arrow keys move. */
function ImageGallery({ images, "aria-label": ariaLabel = "Gallery", className, itemClassName, viewerProps }: ImageGalleryProps) {
  const [open, setOpen] = React.useState(false)
  const [index, setIndex] = React.useState(0)
  return (
    <>
      <GridList
        data-slot="image-gallery"
        aria-label={ariaLabel}
        layout="grid"
        onAction={(key) => {
          setIndex(Number(key))
          setOpen(true)
        }}
        className={cn("grid w-full grid-cols-[repeat(auto-fill,minmax(min(100%,8rem),1fr))] gap-2", className)}
      >
        {images.map((img, i) => (
          <GridListItem
            key={i}
            id={i}
            textValue={img.alt}
            data-slot="image-gallery-item"
            className={composeRenderProps(itemClassName, (itemClassName) =>
              cn(
                "focus-ring state-layer shape-morph relative aspect-square cursor-zoom-in overflow-hidden rounded-[12px] bg-surface-container-highest text-on-surface",
                "data-pressed:rounded-[8px]",
                itemClassName,
              ),
            )}
          >
            <img
              src={img.thumbnailSrc ?? img.src}
              alt={img.alt}
              crossOrigin={img.crossOrigin}
              loading="lazy"
              decoding="async"
              draggable={false}
              className="size-full object-cover"
            />
            <Ripple />
          </GridListItem>
        ))}
      </GridList>
      <ImageViewer images={images} isOpen={open} onOpenChange={setOpen} index={index} onIndexChange={setIndex} {...viewerProps} />
    </>
  )
}

export { ImageGallery, ImageViewer, ViewableImage, imageViewerVariants }
