import * as React from "react"

import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardActions, CardContent, CardDescription, CardMedia, CardTitle } from "@/components/ui/card"
import { Icon } from "@/components/ui/icon"
import { List, ListItem } from "@/components/ui/list"
import { Skeleton, SkeletonText } from "@/components/ui/skeleton"
import { Section, Variant, Variants } from "@/docs/section"

const PEOPLE = [
  ["Maya Lindqvist", "Promoted checkout-api to 100%", "09:41"],
  ["Jonah Park", "Scheduler alerts are quiet again", "Yesterday"],
  ["Ava Reyes", "Policy preview approved", "Mon"],
]

export default function SkeletonSection() {
  const [loaded, setLoaded] = React.useState(false)
  return (
    <Section id="skeleton" description="Surface-container-highest blocks mirroring the final layout, pulsing (or shimmering) until content arrives.">
      <div className="grid gap-6 md:grid-cols-[1fr_1.2fr]">
        <div className="md:col-span-2">
          <Button variant="tonal" onPress={() => setLoaded((l) => !l)}>
            <Icon>swap_horiz</Icon>
            Toggle loaded state
          </Button>
        </div>
        {loaded ? (
          <Card variant="outlined" className="animate-[m3-fade-in_250ms] border-0">
            <CardMedia className="bg-primary-container text-on-primary-container [--icon-size:40px]">
              <Icon>landscape</Icon>
            </CardMedia>
            <CardContent>
              <CardTitle>Glacier Peak</CardTitle>
              <CardDescription className="mt-2">Loaded content replaces the skeleton with the same layout, so nothing shifts.</CardDescription>
            </CardContent>
            <CardActions>
              <Button variant="outlined">Share</Button>
              <Button>Open</Button>
            </CardActions>
          </Card>
        ) : (
          <div className="overflow-hidden rounded-md bg-surface">
            <Skeleton className="aspect-video rounded-none" />
            <div className="space-y-3 p-4">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <div className="flex justify-end gap-2 pt-2">
                <Skeleton className="h-10 w-20 rounded-full" />
                <Skeleton className="h-10 w-24 rounded-full" />
              </div>
            </div>
          </div>
        )}
        {loaded ? (
          <List className="animate-[m3-fade-in_250ms] divide-y divide-outline-variant rounded-md bg-surface">
            {PEOPLE.map(([n, s, t]) => (
              <ListItem key={n} leading={<Avatar name={n} color="primary" />} supportingText={s} trailingText={t}>
                {n}
              </ListItem>
            ))}
          </List>
        ) : (
          <ul aria-busy className="divide-y divide-outline-variant rounded-md bg-surface py-2">
            {["w-1/2", "w-2/5", "w-3/5"].map((w, i) => (
              <li key={i} className="flex items-center gap-4 px-4 py-3">
                <Skeleton animation="shimmer" className="size-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton animation="shimmer" className={`h-4 ${w}`} />
                  <Skeleton animation="shimmer" className="h-3 w-3/4" />
                </div>
                <Skeleton animation="shimmer" className="h-3 w-10" />
              </li>
            ))}
          </ul>
        )}
      </div>

      <Variants cols="md:grid-cols-2">
        <Variant n={1} label="Table rows" className="flex min-h-24 flex-col gap-4 rounded-lg bg-surface p-4">
          <div className="w-full overflow-hidden rounded-md border border-outline-variant">
            <div className="flex items-center gap-4 bg-surface-container-low px-4 py-3">
              <Skeleton className="size-4 rounded-[2px]" />
              <Skeleton className="h-2.5 w-20 rounded-full" />
              <Skeleton className="ml-auto h-2.5 w-14 rounded-full" />
              <Skeleton className="h-2.5 w-10 rounded-full" />
            </div>
            {["w-32", "w-24", "w-36", "w-28"].map((w, i) => (
              <div key={i} className="flex items-center gap-4 border-t border-outline-variant px-4 py-3">
                <Skeleton className="size-4 rounded-[2px]" />
                <Skeleton className={`h-3 rounded-full ${w}`} />
                <Skeleton className="ml-auto h-6 w-14 rounded-sm" />
                <Skeleton className="h-3 w-10 rounded-full" />
              </div>
            ))}
          </div>
        </Variant>

        <Variant n={2} label="KPI tiles" className="grid min-h-24 grid-cols-2 gap-3 rounded-lg bg-surface p-4">
          {[
            [40, 70, 55, 90, 65, 80],
            [80, 50, 60, 35, 55, 30],
          ].map((bars, i) => (
            <div key={i} className="rounded-md bg-surface-container-low p-4">
              <Skeleton className="h-2.5 w-16 rounded-full" />
              <Skeleton className="mt-2 h-7 w-24 rounded-sm" />
              <div className="mt-4 flex h-10 items-end gap-1">
                {bars.map((h, j) => (
                  <Skeleton key={j} className="w-full rounded-t-xs rounded-b-none" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
          ))}
        </Variant>

        <Variant n={3} label="Staggered wave" className="min-h-24 space-y-4 rounded-lg bg-surface p-4">
          {[
            ["w-2/5", "w-4/5"],
            ["w-1/3", "w-3/5"],
            ["w-1/2", "w-2/3"],
            ["w-1/4", "w-3/4"],
          ].map(([a, b], i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton delay={i * 150} className="size-10 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton delay={i * 150} className={`h-3 rounded-full ${a}`} />
                <Skeleton delay={i * 150} className={`h-2.5 rounded-full ${b}`} />
              </div>
            </div>
          ))}
        </Variant>

        <Variant n={4} label="Media post · shimmer" className="min-h-24 space-y-3 rounded-lg bg-surface p-4">
          <div className="flex items-center gap-3">
            <Skeleton animation="shimmer" className="size-9 shrink-0 rounded-full" />
            <div className="space-y-1.5">
              <Skeleton animation="shimmer" className="h-3 w-28 rounded-full" />
              <Skeleton animation="shimmer" className="h-2.5 w-16 rounded-full" />
            </div>
          </div>
          <Skeleton animation="shimmer" className="aspect-video w-full rounded-md" />
          <SkeletonText animation="shimmer" lines={2} lastLineWidth="66%" />
          <div className="flex gap-2 pt-1">
            <Skeleton animation="shimmer" className="h-8 w-16 rounded-full" />
            <Skeleton animation="shimmer" className="h-8 w-16 rounded-full" />
            <Skeleton animation="shimmer" className="ml-auto h-8 w-10 rounded-full" />
          </div>
        </Variant>
      </Variants>
    </Section>
  )
}
