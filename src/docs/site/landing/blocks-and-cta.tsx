import * as React from "react"
import { Link } from "react-aria-components"

import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { Reveal } from "@/components/ui/reveal"
import { Shape } from "@/components/ui/shape"
import { useDragScroll } from "@/hooks/use-drag-scroll"
import { prefersReducedMotion } from "@/hooks/use-motion"
import { cn } from "@/lib/utils"
import { InstallCommand, LinkButton, SectionTitle } from "@/docs/site/landing/shared"

/* ---------------------------------------------------------------- Blocks carousel */

interface BlockCard {
  title: string
  badge: string
  body: string
  cat: string
  media: React.ReactNode
}

const BLOCKS: BlockCard[] = [
  {
    title: "Landing site",
    badge: "Template",
    body: "6 pages, floating pill nav, morphing hero. Plus 10 hero variants.",
    cat: "templates",
    media: (
      <div className="relative h-full bg-primary-container p-4 text-on-primary-container">
        <div className="flex items-center justify-between">
          <span className="h-2 w-14 rounded-full bg-on-primary-container/50" />
          <span className="h-5 w-24 rounded-full bg-on-primary-container/15" />
        </div>
        <div className="mt-7 h-3 w-36 rounded-full bg-on-primary-container/70" />
        <div className="mt-2 h-3 w-24 rounded-full bg-on-primary-container/70" />
        <div className="mt-4 flex gap-2">
          <span className="h-6 w-16 rounded-full bg-primary" />
          <span className="h-6 w-16 rounded-full border border-on-primary-container/30" />
        </div>
        <Shape cycle={["clover4", "cookie7", "sunny"]} interval={2600} className="absolute -right-6 bottom-4 size-32 text-primary/60" />
      </div>
    ),
  },
  {
    title: "Admin dashboard",
    badge: "21 pages",
    body: "Adaptive nav, charts, data tables, mail, settings and more.",
    cat: "templates",
    media: (
      <div className="flex h-full bg-surface-container-highest">
        <div className="flex w-10 flex-col items-center gap-2 bg-surface py-3">
          <span className="size-5 rounded-md bg-primary-container" />
          <span className="mt-2 h-4 w-7 rounded-full bg-secondary-container" />
          <span className="h-2 w-5 rounded-full bg-outline-variant" />
          <span className="h-2 w-5 rounded-full bg-outline-variant" />
          <span className="h-2 w-5 rounded-full bg-outline-variant" />
        </div>
        <div className="flex-1 p-3">
          <div className="grid grid-cols-3 gap-2">
            <span className="h-10 rounded-md bg-surface" />
            <span className="h-10 rounded-md bg-surface" />
            <span className="h-10 rounded-md bg-primary-container" />
          </div>
          <div className="mt-2 flex h-20 items-end gap-1 rounded-md bg-surface p-2">
            {[35, 60, 45, 80, 100, 70].map((h, i) => (
              <span key={i} className={cn("w-full rounded-t-xs", h === 100 ? "bg-primary" : "bg-primary/40")} style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Auth",
    badge: "15 blocks",
    body: "Login, signup, reset, two-factor and verify. Three takes on each.",
    cat: "auth",
    media: (
      <div className="grid h-full place-items-center bg-tertiary-container">
        <div className="w-40 rounded-lg bg-surface p-3 shadow-2">
          <div className="mx-auto size-6 rounded-full bg-primary" />
          <div className="mt-3 h-7 rounded-xs border border-outline-variant" />
          <div className="mt-2 h-7 rounded-xs border border-outline-variant" />
          <div className="mt-3 h-7 rounded-full bg-primary" />
        </div>
      </div>
    ),
  },
  {
    title: "Settings",
    badge: "12 blocks",
    body: "Profile, members, notifications and integrations.",
    cat: "settings",
    media: (
      <div className="h-full bg-surface-container-highest p-4">
        <div className="space-y-2 rounded-lg bg-surface p-3">
          {[true, false, true, false].map((on, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className={cn("h-2 flex-1 rounded-full", i === 0 ? "bg-on-surface/60" : "bg-outline-variant")} />
              <span className={cn("h-4 w-7 rounded-full", on ? "bg-primary" : "border-2 border-outline")} />
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: "Dashboard widgets",
    badge: "18 blocks",
    body: "KPI cards, chart galleries and every chart state.",
    cat: "dashboard",
    media: (
      <div className="grid h-full grid-cols-2 gap-2 bg-secondary-container p-4">
        {[14, 12].map((w, i) => (
          <div key={i} className="rounded-md bg-surface p-2">
            <span className="block h-2 w-10 rounded-full bg-outline-variant" />
            <span className="mt-2 block h-4 rounded-full bg-on-surface/70" style={{ width: w * 4 }} />
          </div>
        ))}
        <div className="col-span-2 flex items-end gap-1 rounded-md bg-surface p-2">
          {[3, 6, 4, 8, 5].map((h, i) => (
            <span key={i} className={cn("flex-1 rounded-t-xs", h === 8 ? "bg-tertiary" : "bg-tertiary/60")} style={{ height: h * 4 }} />
          ))}
        </div>
      </div>
    ),
  },
  {
    title: "Canonical layouts",
    badge: "M3",
    body: "List-detail, supporting pane, feed and adaptive scaffold.",
    cat: "layouts",
    media: (
      <div className="flex h-full gap-2 bg-surface-container-highest p-4">
        <div className="w-1/3 space-y-2 rounded-md bg-surface p-2">
          <span className="block h-6 rounded-sm bg-secondary-container" />
          <span className="block h-6 rounded-sm bg-surface-container" />
          <span className="block h-6 rounded-sm bg-surface-container" />
        </div>
        <div className="flex-1 rounded-md bg-surface p-3">
          <span className="block h-3 w-20 rounded-full bg-on-surface/60" />
          <span className="mt-2 block h-2 w-full rounded-full bg-outline-variant" />
          <span className="mt-1 block h-2 w-4/5 rounded-full bg-outline-variant" />
          <span className="mt-4 block h-16 rounded-md bg-primary-container" />
        </div>
      </div>
    ),
  },
]

export function BlocksCarousel() {
  const scroller = React.useRef<HTMLDivElement>(null)
  const [active, setActive] = React.useState(0)
  const [edges, setEdges] = React.useState({ start: true, end: false })
  useDragScroll(scroller, { axis: "x" })

  // Items scale .94 → 1 as they enter the viewport and their media parallaxes; dots follow the first visible card.
  React.useEffect(() => {
    const el = scroller.current
    if (!el) return
    let frame = 0
    const update = () => {
      frame = 0
      const box = el.getBoundingClientRect()
      const reduce = prefersReducedMotion()
      let first = -1
      Array.from(el.children).forEach((child, i) => {
        const card = child as HTMLElement
        const r = card.getBoundingClientRect()
        const visible = Math.max(0, Math.min(r.right, box.right) - Math.max(r.left, box.left)) / r.width
        if (first === -1 && visible > 0.6) first = i
        card.style.scale = reduce ? "" : String(0.94 + 0.06 * visible)
        const media = card.querySelector<HTMLElement>("[data-carousel-media]")
        if (media && !reduce) media.style.translate = `${((r.left + r.width / 2 - (box.left + box.width / 2)) / box.width) * -10}% 0`
      })
      const atEnd = el.scrollLeft + el.clientWidth > el.scrollWidth - 4
      setActive(atEnd ? el.children.length - 1 : Math.max(0, first))
      setEdges({ start: el.scrollLeft < 4, end: atEnd })
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    el.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      cancelAnimationFrame(frame)
      el.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  const page = (dir: 1 | -1) => scroller.current?.scrollBy({ left: dir * scroller.current.clientWidth * 0.65, behavior: "smooth" })
  const goTo = (i: number) => {
    const el = scroller.current
    const card = el?.children[i] as HTMLElement | undefined
    if (el && card) el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: "smooth" })
  }

  return (
    <Reveal>
      <section data-screen-label="Blocks showcase" className="mx-auto max-w-7xl px-4 pb-16 md:px-8 lg:pb-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <SectionTitle className="md:text-display-sm">97 blocks, from a login card to a 21-page admin.</SectionTitle>
            <p className="mt-3 max-w-prose text-body-lg text-on-surface-variant">
              Full templates, marketing sections, dashboard widgets, M3 canonical layouts, auth, settings, shells, data and people. Each one installs like
              a component.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <IconButton variant="outlined" aria-label="Previous blocks" isDisabled={edges.start} onPress={() => page(-1)}>
              <Icon name="chevron_left" />
            </IconButton>
            <IconButton variant="outlined" aria-label="Next blocks" isDisabled={edges.end} onPress={() => page(1)}>
              <Icon name="chevron_right" />
            </IconButton>
            <LinkButton href="/blocks" variant="tonal" className="ml-2 pr-3 pl-4" trailingIcon={<Icon name="arrow_forward" size={20} />}>
              All blocks
            </LinkButton>
          </div>
        </div>

        <div
          ref={scroller}
          className="no-scrollbar relative mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2"
          data-spec="Blocks carousel|Items scale .94 → 1 as they enter the viewport and their media parallaxes 10%; prev/next scroll 65% of a width. Drag to scroll with a mouse."
        >
          {BLOCKS.map((b) => (
            <Link
              key={b.title}
              href={`/blocks?cat=${b.cat}`}
              className="group focus-ring w-[280px] [-webkit-user-drag:none] shrink-0 snap-start overflow-hidden rounded-xl bg-surface-container-low text-on-surface outline-none sm:w-[340px]"
            >
              <div className="h-44 overflow-hidden">
                <div data-carousel-media className="h-full scale-110">
                  {b.media}
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-title-md">{b.title}</div>
                  <span className="rounded-xs bg-secondary-container px-2 py-0.5 text-label-sm text-on-secondary-container">{b.badge}</span>
                </div>
                <p className="mt-1 text-body-md text-on-surface-variant">{b.body}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-1.5">
          {BLOCKS.map((b, i) => (
            <button
              key={b.title}
              type="button"
              aria-label={`Show ${b.title}`}
              aria-current={i === active || undefined}
              onClick={() => goTo(i)}
              className={cn(
                "focus-ring h-2 cursor-pointer rounded-full transition-all duration-(--md-spring-fast-spatial-duration) ease-fast-spatial",
                i === active ? "w-6 bg-primary" : "w-2 bg-outline-variant hover:bg-outline",
              )}
            />
          ))}
        </div>
      </section>
    </Reveal>
  )
}

/* ---------------------------------------------------------------- Stats + CTA */

export function Stats() {
  return (
    <Reveal>
      <section data-screen-label="Stats" className="mx-auto max-w-7xl px-4 pb-16 md:px-8 lg:pb-24">
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-primary text-on-primary sm:grid-cols-2 lg:grid-cols-5">
          {[
            ["73", "components"],
            ["97", "blocks"],
            ["7", "hooks"],
          ].map(([n, label]) => (
            <div key={label} className="p-8 lg:p-10">
              <div className="text-display-md font-semibold tabular-nums">{n}</div>
              <div className="mt-1 text-body-lg opacity-90">{label}</div>
            </div>
          ))}
          <div className="p-8 lg:p-10">
            <div className="flex h-[52px] items-center gap-2">
              <Icon name="light_mode" size={32} />
              <Icon name="dark_mode" size={32} filled />
            </div>
            <div className="mt-1 text-body-lg opacity-90">light and dark, system aware</div>
          </div>
          <div className="p-8 lg:p-10">
            <div className="flex h-[52px] items-center">
              <Icon name="format_textdirection_r_to_l" size={32} />
            </div>
            <div className="mt-1 text-body-lg opacity-90">RTL, out of the box</div>
          </div>
        </div>
      </section>
    </Reveal>
  )
}

export function FinalCta() {
  return (
    <Reveal>
      <section data-screen-label="Final CTA" className="mx-auto max-w-7xl px-4 pb-16 md:px-8 lg:pb-24">
        <div className="relative overflow-hidden rounded-2xl bg-primary-container px-6 py-14 text-on-primary-container md:px-14">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-10 -right-10 size-64 text-primary/15 md:size-96"
            data-spec="Decorative shape|sunny → cookie12 → clover8 every 3.2s, plus an 80s linear spin. Purely decorative, aria-hidden."
          >
            <div className="size-full animate-[spin_80s_linear_infinite] motion-reduce:animate-none">
              <Shape cycle={["sunny", "cookie12", "clover8"]} interval={3200} className="size-full" />
            </div>
          </div>
          <div className="relative max-w-2xl">
            <h2 className="text-headline-lg font-semibold text-balance md:text-display-sm">Your next button is one command away.</h2>
            <p className="mt-4 text-body-lg">Add the registry, run init, and start pasting. MIT licensed, no account, no telemetry.</p>
            <InstallCommand className="mt-6 max-w-lg" surface="bg-surface" />
            <div className="mt-6 flex flex-wrap gap-3">
              <LinkButton href="/docs/install" size="md" pressScale>
                Read the docs
              </LinkButton>
              <LinkButton
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                size="md"
                variant="outlined"
                pressScale
                className="border-on-primary-container/30 text-on-primary-container"
                trailingIcon={<Icon name="open_in_new" />}
              >
                Star on GitHub
              </LinkButton>
            </div>
          </div>
        </div>
      </section>
    </Reveal>
  )
}
