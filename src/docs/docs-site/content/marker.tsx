import Demo from "@/docs/docs-site/examples/marker/demo"
import demoSrc from "@/docs/docs-site/examples/marker/demo?raw"
import Pins from "@/docs/docs-site/examples/marker/pins"
import pinsSrc from "@/docs/docs-site/examples/marker/pins?raw"
import Clusters from "@/docs/docs-site/examples/marker/clusters"
import clustersSrc from "@/docs/docs-site/examples/marker/clusters?raw"
import Status from "@/docs/docs-site/examples/marker/status"
import statusSrc from "@/docs/docs-site/examples/marker/status?raw"
import Location from "@/docs/docs-site/examples/marker/location"
import locationSrc from "@/docs/docs-site/examples/marker/location?raw"
import Tour from "@/docs/docs-site/examples/marker/tour"
import tourSrc from "@/docs/docs-site/examples/marker/tour?raw"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  description:
    "Markers point at places and parts of a surface: map pins with label pills, clusters that grow with density, status pins, live-location dots, and numbered markers with coach marks for tours.",
  preview: { component: Demo, source: demoSrc, className: "p-3" },
  usage: `import { MapPin, Marker } from "@/components/ui/marker"

<div className="relative h-80">
  <Marker x={30} y={45} anchor="bottom">
    <MapPin label="Frankfurt · 12 nodes" onPress={() => select("fra")} />
  </Marker>
</div>`,
  examples: [
    {
      id: "pins",
      title: "Map pins",
      description: <>Filled location glyph in a role color, with an optional inverse label pill. Anchor pins with {c('anchor="bottom"')} so the tip sits on the point.</>,
      component: Pins,
      source: pinsSrc,
    },
    { id: "clusters", title: "Clusters", description: "A count bubble whose size and halo follow density: ≥100 high, ≥10 medium, otherwise low.", component: Clusters, source: clustersSrc },
    { id: "status", title: "Status pins & legend", description: "Teardrop pins carrying a status glyph, explained by a legend of label pills.", component: Status, source: statusSrc },
    { id: "location", title: "Live location", description: "A dot with a 4dp surface ring, an optional ping and an accuracy halo.", component: Location, source: locationSrc },
    {
      id: "tour",
      title: "Numbered tour",
      description: <>Numbered markers pop in with a stagger; pressing one opens a {c("CoachMark")} for that step.</>,
      component: Tour,
      source: tourSrc,
    },
  ],
  api: [
    {
      name: "Marker",
      description: <>Absolutely positions its child over a {c("relative")} parent. Renders a {c("<div>")}.</>,
      props: [
        { name: "x", type: "number | string", default: "—", description: "Horizontal position. Numbers are percentages." },
        { name: "y", type: "number | string", default: "—", description: "Vertical position. Numbers are percentages." },
        { name: "anchor", type: '"center" | "bottom"', default: '"center"', description: "Which point of the child sits on (x, y)." },
      ],
    },
    {
      name: "MapPin",
      description: <>A React Aria {c("Button")}: {c("onPress")}, {c("isDisabled")} and the rest work.</>,
      props: [
        { name: "label", type: "string", default: "—", description: "Pill above the pin. Also the accessible name." },
        { name: "tone", type: '"primary" | "secondary" | "tertiary" | "error"', default: '"primary"', description: "Pin color." },
        { name: "icon", type: "string", default: '"location_on"', description: "Material Symbol for the pin." },
      ],
    },
    {
      name: "ClusterMarker",
      description: <>A React Aria {c("Button")}. Its accessible name defaults to "N items".</>,
      props: [
        { name: "count", type: "number", default: "—", description: "Number shown in the bubble." },
        { name: "density", type: '"high" | "medium" | "low"', default: "from count", description: "56 / 40 / 32dp bubble." },
      ],
    },
    {
      name: "MarkerDot",
      props: [
        { name: "tone", type: '"primary" | "secondary" | "tertiary" | "error"', default: '"primary"', description: "Dot color." },
        { name: "pulse", type: "boolean", default: "false", description: "Expanding ping ring." },
        { name: "halo", type: "number", default: "—", description: "Accuracy halo diameter in px." },
      ],
    },
    {
      name: "StatusPin",
      description: <>{c('role="img"')}; its label defaults to the status name, so pass a better {c("aria-label")}.</>,
      props: [
        { name: "status", type: '"ok" | "warning" | "error" | "neutral"', default: '"ok"', description: "primary · tertiary · error · surface-container-highest." },
        { name: "icon", type: "string", default: "per status", description: "Override the glyph." },
      ],
    },
    {
      name: "NumberMarker",
      description: <>A React Aria {c("Button")}.</>,
      props: [
        { name: "children", type: "ReactNode", default: "—", description: "Step number or short label." },
        { name: "delay", type: "number", default: "—", description: "Entrance delay in ms, to stagger a tour." },
      ],
    },
    { name: "MarkerLabel", description: <>A surface pill for captions and legend rows. Renders a {c("<span>")}.</>, props: [] },
    {
      name: "MarkerLegend",
      props: [{ name: "items", type: "{ label: ReactNode; tone?; className? }[]", default: "—", description: "One pill per item with a colored dot." }],
    },
    {
      name: "CoachMark",
      description: <>A tour callout card ({c('role="dialog"')}). Position it next to the highlighted control yourself, or put it in a Popover.</>,
      props: [
        { name: "title", type: "ReactNode", default: "—", description: "Callout title. A string also becomes its accessible name." },
        { name: "step", type: "ReactNode", default: "—", description: "Progress line, e.g. \"Step 2 of 4\"." },
        { name: "description", type: "ReactNode", default: "—", description: "One or two sentences." },
        { name: "actions", type: "ReactNode", default: "—", description: "Back / Next buttons, end-aligned." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        Interactive markers (MapPin, ClusterMarker, NumberMarker) are React Aria buttons with accessible names, so they're reachable with the keyboard and fire{" "}
        {c("onPress")} for every input. Give each one a name that says where it goes, not just a number.
      </>
    ),
    keyboard: [
      { keys: ["Tab"], description: "Moves between interactive markers in DOM order." },
      { keys: ["Space", "Enter"], description: "Activates the marker." },
    ],
    notes: [
      "A map is hard to use without a list: offer the same places as a list or table next to it.",
      "Markers are placed in DOM order, not visual order. Render them in a sensible reading order.",
      "Pulse and pop-in animations stop under reduced motion.",
    ],
  },
  spec: {
    tables: [
      {
        columns: ["Marker", "Size", "Color"],
        rows: [
          ["Map pin", "40dp glyph · label-medium pill", "Role color · inverse-surface pill"],
          ["Cluster", "56 / 40 / 32dp · 8 / 4 / 4dp halo", "primary or secondary-container"],
          ["Status pin", "32dp teardrop · 18dp glyph · level 2", "primary · tertiary · error · surface-container-highest"],
          ["Location dot", "16dp · 4dp surface ring", "Role color · halo at 15%"],
          ["Number marker", "28dp · 4dp surface ring", "primary"],
          ["Coach mark", "256dp wide · 12dp corners · level 2", "surface-container-high"],
        ],
      },
    ],
    cards: [{ title: "Motion", items: [<>Press: scale to 90% on {c("fast-spatial")}</>, <>Number marker: {c("animate-pop")} entrance</>] }],
    source: "Not an M3 component. Colors, elevation and shapes from the M3 scales.",
  },
} satisfies ComponentDoc
