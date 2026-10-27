import Demo from "@/docs/docs-site/examples/avatar/demo"
import demoSrc from "@/docs/docs-site/examples/avatar/demo?raw"
import Sizes from "@/docs/docs-site/examples/avatar/sizes"
import sizesSrc from "@/docs/docs-site/examples/avatar/sizes?raw"
import Content from "@/docs/docs-site/examples/avatar/content"
import contentSrc from "@/docs/docs-site/examples/avatar/content?raw"
import Colors from "@/docs/docs-site/examples/avatar/colors"
import colorsSrc from "@/docs/docs-site/examples/avatar/colors?raw"
import Shapes from "@/docs/docs-site/examples/avatar/shapes"
import shapesSrc from "@/docs/docs-site/examples/avatar/shapes?raw"
import Status from "@/docs/docs-site/examples/avatar/status"
import statusSrc from "@/docs/docs-site/examples/avatar/status?raw"
import Group from "@/docs/docs-site/examples/avatar/group"
import groupSrc from "@/docs/docs-site/examples/avatar/group?raw"
import { TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  description:
    "Avatars show a person, team or bot at a glance: a photo, initials on a container role, or an icon. Five sizes, a stable color per name, round, rounded-square or any Expressive shape, and an optional presence dot.",
  links: { m3: "https://m3.material.io/components/lists/specs" },
  preview: { component: Demo, source: demoSrc },
  usage: `import { Avatar, AvatarGroup } from "@/components/ui/avatar"

<Avatar src="/people/maya.jpg" name="Maya Lindqvist" status="online" />

<AvatarGroup max={3}>
  <Avatar name="Maya Lindqvist" />
  <Avatar name="Jon Okafor" />
  <Avatar name="Ana Silva" />
  <Avatar name="Lee Park" />
</AvatarGroup>`,
  examples: [
    { id: "sizes", title: "Sizes", description: "XS 24 · S 32 · M 40 · L 56 · XL 96dp. M is the M3 list leading avatar; the initials' type role scales with the size.", component: Sizes, source: sizesSrc },
    {
      id: "content",
      title: "Image, initials, icon",
      description: (
        <>
          {c("src")} shows a photo and falls back to initials from {c("name")} if it fails to load. {c("fallback")} overrides the initials, {c("icon")} shows a
          Material Symbol, and with nothing at all you get {c("person")}.
        </>
      ),
      component: Content,
      source: contentSrc,
    },
    {
      id: "colors",
      title: "Colors",
      description: (
        <>
          Container roles by default, solid roles for more emphasis. Without {c("color")}, a name always maps to the same of primary, secondary or tertiary
          container, so a person keeps their color across the app.
        </>
      ),
      component: Colors,
      source: colorsSrc,
    },
    {
      id: "shapes",
      title: "Shapes",
      description: (
        <>
          Circle, rounded square, or any of the {c("Shape")} library names. {c("hoverShape")} morphs on hover (600ms, spring easing).
        </>
      ),
      component: Shapes,
      source: shapesSrc,
    },
    { id: "status", title: "Presence", description: "A dot at the bottom-end corner with a 2dp ring in the surface color.", component: Status, source: statusSrc },
    {
      id: "group",
      title: "Avatar group",
      description: (
        <>
          Overlapping stack with a {c("+N")} overflow. Each avatar gets a ring in {c("--avatar-ring")}; set it to the background color when the group sits on a
          container.
        </>
      ),
      component: Group,
      source: groupSrc,
    },
  ],
  api: [
    {
      name: "Avatar",
      description: <>Renders a {c("<span>")}; other HTML attributes pass through. Also exported: {c("avatarVariants")}, {c("initials(name)")} and {c("colorFor(name)")}.</>,
      props: [
        { name: "src", type: "string", default: "—", description: "Image URL. Falls back to initials or the icon if it fails to load." },
        { name: "name", type: "string", default: "—", description: "The person's name: accessible label, initials and default color." },
        { name: "fallback", type: "string", default: "—", description: "Text to show instead of the initials from name." },
        { name: "icon", type: "string", default: '"person"', description: "Material Symbol shown when there's no image or text." },
        { name: "size", type: '"xs" | "sm" | "md" | "lg" | "xl"', default: '"md"', description: "24 / 32 / 40 / 56 / 96dp." },
        {
          name: "color",
          type: '"primary" | "secondary" | "tertiary" | "primary-solid" | "secondary-solid" | "tertiary-solid" | "neutral"',
          default: "from name",
          description: "Container role. Defaults to a stable pick from name, or neutral without a name.",
        },
        { name: "shape", type: '"circle" | "square" | ShapeName', default: '"circle"', description: "Circle, rounded square, or an Expressive shape." },
        { name: "hoverShape", type: "ShapeName", default: "—", description: "Shape to morph to on hover. Only with an Expressive shape." },
        { name: "status", type: '"online" | "busy" | "away" | "offline"', default: "—", description: "Presence dot: tertiary, error, secondary or outline." },
        { name: "children", type: "ReactNode", default: "—", description: "Custom content instead of the initials or icon." },
      ],
    },
    {
      name: "AvatarGroup",
      description: <>Renders a {c("<div>")}. Set {c("--avatar-ring")} on it to match the background.</>,
      props: [
        { name: "max", type: "number", default: "—", description: "Show at most this many avatars, then an overflow avatar." },
        { name: "size", type: "AvatarProps[\"size\"]", default: '"md"', description: "Size of the overflow avatar. Match your avatars." },
        { name: "renderOverflow", type: "(hidden: number) => ReactNode", default: "—", description: "Custom overflow element instead of the +N avatar." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        With a {c("name")}, the avatar is an image ({c('role="img"')}) labelled with that name, and the photo inside it is decorative ({c('alt=""')}). Without a
        name, pass an {c("aria-label")}, or leave it unlabelled when the person's name is already next to it.
      </>
    ),
    notes: [
      "The overflow avatar is labelled \"N more\".",
      "Presence is shown by color only; repeat it in text nearby (\"Online\") where it matters.",
      <>
        Avatars aren't interactive. Wrap one in a button or link, or use an <TextLink to="/docs/icon-button">Icon button</TextLink>, when it opens something.
      </>,
    ],
  },
  spec: {
    tables: [
      {
        columns: ["Size", "Diameter", "Initials", "Icon", "Presence dot", "Square corners"],
        rows: [
          ["XS", "24dp", c("label-small"), "16dp", "8dp", "8dp"],
          ["S", "32dp", c("label-medium"), "20dp", "10dp", "8dp"],
          ["M", "40dp", c("title-medium"), "24dp", "12dp", "12dp"],
          ["L", "56dp", c("title-large"), "28dp", "14dp", "16dp"],
          ["XL", "96dp", c("headline-medium"), "48dp", "20dp · 4dp ring", "16dp"],
        ],
      },
    ],
    cards: [
      { title: "Color", items: ["Container roles with their on-color: primary · secondary · tertiary", "Solid roles for emphasis", "Neutral: surface-container-highest, on-surface-variant"] },
      { title: "Group", items: ["−8dp overlap", "2dp ring in the surface color (--avatar-ring)", "Overflow: neutral +N"] },
      { title: "Motion", items: [<>Shape hover: {c("Shape")} morph, 600ms on the spring easing</>] },
    ],
    source: (
      <>
        M3 has no standalone avatar. M matches androidx {c("ListTokens")}: {c("ItemLeadingAvatarSize")} 40dp, {c("CornerFull")}, primary-container with{" "}
        {c("title-medium")} on-primary-container. The other sizes follow the same type and color rules.
      </>
    ),
  },
} satisfies ComponentDoc
