import * as React from "react"
import { Link, type Key } from "react-aria-components"

import { ToggleButton } from "@/components/ui/button"
import { ConnectedButton, ConnectedButtonGroup } from "@/components/ui/button-group"
import { AssistChip, FilterChip } from "@/components/ui/chip"
import { FabMenu, FabMenuItem } from "@/components/ui/fab"
import { Icon } from "@/components/ui/icon"
import { ToggleIconButton } from "@/components/ui/icon-button"
import { LoadingIndicator } from "@/components/ui/loading-indicator"
import { LinearProgress } from "@/components/ui/progress"
import { RevealWords } from "@/components/ui/reveal"
import { Shape, type ShapeName } from "@/components/ui/shape"
import { Slider } from "@/components/ui/slider"
import { snackbar } from "@/components/ui/snackbar"
import { Switch } from "@/components/ui/switch"
import { prefersReducedMotion, springTiming } from "@/hooks/use-motion"
import { cn } from "@/lib/utils"
import { InstallCommand, LinkButton, Panel } from "@/docs/site/landing/shared"

export function Hero() {
  // The "Motion" switch in the cluster pauses every morph and spin on the hero.
  const [motion, setMotion] = React.useState(true)

  return (
    <section
      data-screen-label="Hero"
      className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 pt-8 pb-16 md:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pt-14 lg:pb-24"
    >
      <div className="max-w-2xl min-w-0">
        <Link
          href="/docs/changelog"
          className="state-layer focus-ring inline-flex h-8 items-center gap-2 rounded-sm border border-outline-variant pr-3 pl-2 text-label-lg text-on-surface-variant"
        >
          <Icon name="new_releases" size={18} className="text-primary" />
          v1.0 · 73 components · 97 blocks
          <Icon name="chevron_right" size={18} />
        </Link>
        <RevealWords
          as="h1"
          stagger={80}
          className="mt-6 gap-x-[0.22em] text-display-sm font-semibold md:text-display-md xl:text-display-lg"
          data-spec="Headline reveal|Words rise and fade in, staggered 80ms, on the emphasized-decelerate curve. Runs once on load; honors prefers-reduced-motion."
        >
          Components that <span className="text-primary">bounce</span> back.
        </RevealWords>
        <p className="mt-5 max-w-xl text-title-lg text-pretty text-on-surface">Material 3 Expressive for React. Copy, paste, own it.</p>
        <p className="mt-3 max-w-xl text-body-lg text-pretty text-on-surface-variant">
          Shape-morphing buttons, springy motion and dynamic color, delivered as source files in your repo. No dependency to pin, nothing to wait on.
        </p>
        <InstallCommand
          className="mt-8 max-w-xl"
          data-spec="Install command|Copy: the icon swaps to a check for 2s and a snackbar confirms."
        />
        <div className="mt-5 flex flex-wrap gap-3">
          <LinkButton
            href="/docs/install"
            size="md"
            pressScale
            trailingIcon={<Icon name="arrow_forward" />}
            data-spec="Filled button · M|Press: corners morph full → 12dp on the FastSpatial spring and the button scales to .94; release springs back. Ripple starts at the pointer."
          >
            Get started
          </LinkButton>
          <LinkButton href="/docs/button" size="md" variant="tonal" pressScale icon={<Icon name="widgets" />}>
            Browse components
          </LinkButton>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-body-md text-on-surface-variant">
          {["React 19 · React Aria", "Tailwind CSS v4", "MIT, forever"].map((t) => (
            <span key={t} className="inline-flex items-center gap-2">
              <Icon name="check_circle" size={20} className="text-primary" />
              {t}
            </span>
          ))}
        </div>
      </div>

      <HeroCluster motion={motion} setMotion={setMotion} />
    </section>
  )
}

function HeroCluster({ motion, setMotion }: { motion: boolean; setMotion: (v: boolean) => void }) {
  const [stiffness, setStiffness] = React.useState(380)
  const [fabOpen, setFabOpen] = React.useState(false)
  const [segment, setSegment] = React.useState<Set<Key>>(new Set(["round"]))

  return (
    <div data-screen-label="Hero cluster" className="relative mx-auto grid w-full max-w-md min-w-0 grid-cols-3 gap-3 lg:max-w-none">
      <BloomShape
        cycle={["cookie7", "clover4", "sunny"]}
        interval={3000}
        hoverShape="burst"
        motion={motion}
        className="text-primary-container"
        data-spec="Hero shape · morph|clip-path tweens cookie7 → clover4 → sunny every 3s on the M3 spring. Hover: morphs to burst while the shape springs from .9 → 1 (DefaultSpatial)."
      />

      <Panel className="col-span-2 flex min-w-0 flex-col justify-between gap-4 p-5">
        <div className="flex items-center justify-between gap-2 text-label-md text-on-surface-variant">
          <span>Toggle buttons · round ↔ square</span>
          <Icon name="touch_app" size={18} />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div
            className="flex gap-2"
            data-spec="Toggle icon buttons|Unselected round (full) → selected square (12dp) with icon FILL 0 → 1. Radius on the FastSpatial spring, colors on DefaultEffects."
          >
            <ToggleIconButton variant="filled" aria-label="Favorite" defaultSelected>
              <Icon name="favorite" />
            </ToggleIconButton>
            <ToggleIconButton variant="filled" aria-label="Bookmark">
              <Icon name="bookmark" />
            </ToggleIconButton>
            <ToggleIconButton
              variant="filled"
              aria-label="Notifications"
              className="data-selected:bg-secondary-container data-selected:text-on-secondary-container"
            >
              <Icon name="notifications" />
            </ToggleIconButton>
          </div>
          <ToggleButton variant="outlined" icon={<Icon name="star" />}>
            Star
          </ToggleButton>
          <Switch
            isSelected={motion}
            onChange={setMotion}
            className="ml-auto text-label-lg"
            data-spec="Switch|Handle grows 16 → 24dp and travels 20dp while the track goes outline → primary. Pressed handle swells to 28dp. This one pauses the hero's morphs."
          >
            Motion
          </Switch>
        </div>
      </Panel>

      <Panel className="col-span-2 flex min-w-0 flex-col justify-center gap-5 p-5">
        <div>
          <div className="flex items-center justify-between text-label-md text-on-surface-variant">
            <span>Slider · spring stiffness</span>
            <span className="text-on-surface tabular-nums" data-slot="stiffness-output">{stiffness}</span>
          </div>
          <Slider
            aria-label="Spring stiffness"
            size="xs"
            minValue={100}
            maxValue={1400}
            step={20}
            value={stiffness}
            onChange={(v) => setStiffness(v as number)}
            valueIndicator="never"
            className="mt-1"
            data-spec="Slider|The 4dp handle narrows on press and springs back on release. 16dp track, 6dp handle gaps, stop indicator at the end."
          />
        </div>
        <div>
          <div className="text-label-md text-on-surface-variant">Wavy progress</div>
          <LinearProgress
            wavy
            value={64}
            aria-label="Wavy progress"
            className="mt-2"
            data-spec="Wavy linear progress|Active indicator is a 4dp sine wave that travels along the track. 4dp gap to the track and a stop dot at the end, per the Expressive spec."
          />
        </div>
      </Panel>

      <SpinShape cycle={["clover4", "cookie9", "pentagon"]} interval={2800} hoverShape="verySunny" spin={40} motion={motion} className="text-tertiary-container" />

      <Panel
        className="flex min-w-0 flex-col items-center justify-center gap-3 p-4 text-center"
        data-spec="Loading indicator|Shape sequence morphs every 650ms inside a slow linear spin. Contained variant sits on a primary-container disc."
      >
        <LoadingIndicator contained size={56} />
        <span className="text-label-md text-on-surface-variant">Loading indicator</span>
      </Panel>

      <Panel
        className="relative col-span-2 flex min-h-[280px] min-w-0 flex-col p-5"
        data-spec="FAB menu|Items reveal bottom-up with a stagger; the toggle morphs to a round close button. Choosing an item closes the menu."
      >
        <div className="flex items-center justify-between text-label-md text-on-surface-variant">
          <span>FAB menu</span>
          <span>{fabOpen ? "tap to close" : "tap the FAB"}</span>
        </div>
        <div className="mt-auto flex justify-end">
          <FabMenu
            aria-label="Toggle FAB menu"
            isOpen={fabOpen}
            onOpenChange={setFabOpen}
            onAction={(key) =>
              snackbar(
                { component: "New component scaffolded", block: "Block added to your project", theme: "Theme exported" }[String(key)] ?? "Done",
              )
            }
          >
            <FabMenuItem id="component" icon="add_box">
              New component
            </FabMenuItem>
            <FabMenuItem id="block" icon="view_quilt">
              Add block
            </FabMenuItem>
            <FabMenuItem id="theme" icon="palette">
              Export theme
            </FabMenuItem>
          </FabMenu>
        </div>
      </Panel>

      <SpinShape cycle={["sunny", "cookie12", "circle"]} interval={3200} hoverShape="gem" spin={60} motion={motion} className="text-secondary-container" />

      <Panel className="col-span-2 flex min-w-0 flex-col justify-center gap-4 p-5">
        <div className="text-label-md text-on-surface-variant">Connected button group</div>
        <ConnectedButtonGroup
          aria-label="Shape"
          variant="tonal"
          size="sm"
          selectedKeys={segment}
          onSelectionChange={setSegment}
          className="w-full"
          data-spec="Connected button group|2dp gaps with 8dp inner corners; the selected segment rounds to full and fills primary. Radius on the FastSpatial spring."
        >
          {["Round", "Square", "Morph"].map((label) => (
            <ConnectedButton key={label} id={label.toLowerCase()} className="min-w-0 flex-1 px-3 data-selected:bg-primary data-selected:text-on-primary">
              {label}
            </ConnectedButton>
          ))}
        </ConnectedButtonGroup>
        <div className="flex flex-wrap gap-2">
          <FilterChip defaultSelected>Filter chip</FilterChip>
          <FilterChip>Springy</FilterChip>
          <AssistChip icon={<Icon name="auto_awesome" className="text-primary" />} onPress={() => snackbar("Assist chip · demo action")}>
            Assist
          </AssistChip>
        </div>
      </Panel>
    </div>
  )
}

interface ShapeSpecimenProps extends React.HTMLAttributes<HTMLDivElement> {
  cycle: ShapeName[]
  interval: number
  hoverShape: ShapeName
  motion: boolean
}

/** Hero shape: morphs on a timer; on hover morphs to `hoverShape` and springs from .9 → 1. */
function BloomShape({ cycle, interval, hoverShape, motion, className, ...props }: ShapeSpecimenProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const bloom = () => {
    if (!ref.current || prefersReducedMotion()) return
    const { easing, duration } = springTiming("default-spatial")
    ref.current.animate([{ scale: 0.9 }, { scale: 1 }], { easing, duration })
  }
  return (
    <div ref={ref} aria-hidden className={cn("aspect-square w-full cursor-pointer self-center", className)} onPointerEnter={bloom} {...props}>
      <Shape shape={cycle[0]} cycle={motion ? cycle : undefined} interval={interval} hoverShape={hoverShape} className="size-full" />
    </div>
  )
}

/** Decorative shape that morphs and slowly spins. */
function SpinShape({ spin, motion, cycle, interval, hoverShape, className, ...props }: ShapeSpecimenProps & { spin: number }) {
  return (
    // Clip the non-rotating wrapper: shapes are inscribed in the box's circle, so nothing visible is lost,
    // but the rotating square's corners no longer widen the page.
    <div aria-hidden className={cn("aspect-square w-full cursor-pointer self-center overflow-hidden", className)} {...props}>
      <div
        className="size-full animate-[spin_var(--spin)_linear_infinite] motion-reduce:animate-none"
        style={{ "--spin": `${spin}s`, animationPlayState: motion ? "running" : "paused" } as React.CSSProperties}
      >
        <Shape shape={cycle[0]} cycle={motion ? cycle : undefined} interval={interval} hoverShape={hoverShape} className="size-full" />
      </div>
    </div>
  )
}
