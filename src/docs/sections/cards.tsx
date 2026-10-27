import { Avatar } from "@/components/ui/avatar"
import { StatusBadge } from "@/components/ui/badge"
import { Button, ToggleButton } from "@/components/ui/button"
import {
  Card,
  CardActions,
  CardButton,
  CardContent,
  CardDescription,
  CardHeader,
  CardMedia,
  CardSubtitle,
  CardTitle,
} from "@/components/ui/card"
import { MediaLabel } from "@/components/ui/aspect-ratio"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { Shape } from "@/components/ui/shape"
import { Section, Variant, Variants } from "@/docs/section"

function Bars({ values, className = "bg-primary/40", last = "bg-primary", height = "h-16" }: { values: number[]; className?: string; last?: string; height?: string }) {
  return (
    <div className={`mt-4 flex items-end gap-1 ${height}`}>
      {values.map((v, i) => (
        <div key={i} className={`w-full rounded-t-xs ${i === values.length - 1 ? last : className}`} style={{ height: `${v}%` }} />
      ))}
    </div>
  )
}

export default function CardsSection() {
  return (
    <Section
      id="cards"
      description="Elevated (surface-container-low + level 1), filled (surface-container-highest) and outlined (surface + outline-variant). 12dp corners; Expressive layouts go up to 28dp."
      spec="https://m3.material.io/components/cards/overview"
    >
      <div className="grid gap-4 md:grid-cols-3">
        <Card variant="elevated">
          <CardMedia className="bg-primary-container text-on-primary-container [--icon-size:40px]">
            <Icon>image</Icon>
            <MediaLabel>Media · 16:9</MediaLabel>
          </CardMedia>
          <CardContent>
            <CardTitle>Glacier Peak</CardTitle>
            <CardDescription className="mt-2">
              Cards contain content and actions about a single subject. Elevated cards separate from a patterned background.
            </CardDescription>
          </CardContent>
          <CardActions>
            <Button variant="outlined">Share</Button>
            <Button>Open</Button>
          </CardActions>
        </Card>

        <Card variant="filled">
          <CardHeader>
            <Avatar name="Ana" fallback="A" color="tertiary-solid" />
            <div>
              <CardTitle className="text-title-md">Filled card</CardTitle>
              <CardSubtitle>Header · subhead</CardSubtitle>
            </div>
            <IconButton aria-label="More" className="ml-auto">
              <Icon>more_vert</Icon>
            </IconButton>
          </CardHeader>
          <CardMedia className="bg-tertiary-container text-on-tertiary-container [--icon-size:40px]">
            <Icon>image</Icon>
          </CardMedia>
          <CardContent>
            <CardDescription>Filled cards provide subtle separation; use the highest container tone so they still read as a surface.</CardDescription>
          </CardContent>
          <CardActions className="justify-start">
            <Button>Accept</Button>
            <Button variant="text">Decline</Button>
          </CardActions>
        </Card>

        <Card variant="outlined">
          <CardContent>
            <CardTitle>Quarterly uptime</CardTitle>
            <div className="mt-3 flex items-end gap-2">
              <span className="text-display-sm font-medium tabular-nums">
                99.98<span className="text-headline-sm">%</span>
              </span>
              <StatusBadge size="md" className="mb-2">
                <Icon>trending_up</Icon>+0.02
              </StatusBadge>
            </div>
            <Bars values={[40, 70, 55, 85, 60, 95, 100]} />
            <p className="mt-3 text-body-sm text-on-surface-variant">Outlined cards for medium emphasis and high-density grids.</p>
          </CardContent>
        </Card>
      </div>

      <Variants cols="md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        <Variant n={1} label="Stat" className="contents">
          <Card variant="filled" className="rounded-xl p-5">
            <div className="flex items-center justify-between gap-2 text-label-lg text-on-surface-variant">
              Active workspaces
              <StatusBadge variant="tertiary" size="md">+3.4%</StatusBadge>
            </div>
            <div className="mt-2 text-display-sm font-medium tabular-nums">412</div>
            <Bars values={[40, 62, 50, 78, 66, 90, 100]} className="bg-primary/30" height="h-10" />
          </Card>
        </Variant>

        <Variant n={2} label="Horizontal media · clickable" className="contents">
          <CardButton variant="outlined" className="flex-row rounded-xl">
            <span className="grid w-24 shrink-0 place-items-center self-stretch bg-tertiary-container text-on-tertiary-container [--icon-size:32px]">
              <Icon>menu_book</Icon>
            </span>
            <span className="min-w-0 p-4">
              <span className="block text-title-md">Zero-downtime migrations</span>
              <span className="mt-1 line-clamp-2 text-body-sm text-on-surface-variant">6-minute guide. Move stateful workloads between regions without dropping a request.</span>
            </span>
          </CardButton>
        </Variant>

        <Variant n={3} label="Profile" className="contents">
          <Card variant="filled" className="items-center rounded-xl bg-surface-container p-5 text-center">
            <Avatar name="Priya Nair" size="lg" color="primary" />
            <div className="mt-3 text-title-md">Priya Nair</div>
            <div className="text-body-sm text-on-surface-variant">VP Platform · Halide Bank</div>
            <div className="mt-4 flex gap-2">
              <ToggleButton variant="filled" defaultSelected>
                Follow
              </ToggleButton>
              <IconButton variant="outlined" aria-label="Message Priya">
                <Icon>chat</Icon>
              </IconButton>
            </div>
          </Card>
        </Variant>

        <Variant n={4} label="Pricing" className="contents">
          <Card className="rounded-xl bg-primary-container p-5 text-on-primary-container shadow-none">
            <div className="flex items-center justify-between">
              <span className="text-title-md">Business</span>
              <StatusBadge variant="primary">Popular</StatusBadge>
            </div>
            <div className="mt-3 text-headline-lg font-medium tabular-nums">
              $23<span className="text-body-md font-normal">/workload</span>
            </div>
            <ul className="mt-3 space-y-1.5 text-body-sm [--icon-size:18px]">
              {["Unlimited accounts", "Policy previews", "Auto rollbacks"].map((f) => (
                <li key={f} className="flex gap-2">
                  <Icon>check</Icon>
                  {f}
                </li>
              ))}
            </ul>
            <Button className="mt-4">Start trial</Button>
          </Card>
        </Variant>

        <Variant n={5} label="Expressive shape" className="contents">
          <Card className="rounded-2xl bg-tertiary-container p-5 text-on-tertiary-container shadow-none">
            <Shape
              cycle={["sunny", "cookie9", "clover4"]}
              interval={2600}
              className="pointer-events-none absolute -top-8 -right-8 size-36 text-tertiary/25"
            />
            <span className="relative grid size-12 place-items-center rounded-full bg-tertiary text-on-tertiary">
              <Icon>bolt</Icon>
            </span>
            <div className="relative mt-6 text-title-lg">Rollouts, 30% faster</div>
            <p className="relative mt-1 text-body-sm">Parallel region promotion ships in 4.2.</p>
            <IconButton size="md" variant="filled" shape="round" aria-label="Read release notes" className="relative mt-4 bg-tertiary text-on-tertiary">
              <Icon>arrow_forward</Icon>
            </IconButton>
          </Card>
        </Variant>
      </Variants>
    </Section>
  )
}
