import Demo from "@/docs/docs-site/examples/link-button/demo"
import demoSrc from "@/docs/docs-site/examples/link-button/demo?raw"
import Router from "@/docs/docs-site/examples/link-button/router"
import routerSrc from "@/docs/docs-site/examples/link-button/router?raw"
import Styles from "@/docs/docs-site/examples/link-button/styles"
import stylesSrc from "@/docs/docs-site/examples/link-button/styles?raw"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  description: (
    <>
      A link that looks exactly like a <TextLink to="/docs/button">Button</TextLink>: same five styles, five sizes, shapes, colors, press morph, state layer and
      ripple. Use it for navigation that should read as an action, like "← Sessions", "View all" or "Open in …".
    </>
  ),
  links: {
    m3: "https://m3.material.io/components/buttons/overview",
    aria: "https://react-spectrum.adobe.com/react-aria/Link.html",
  },
  preview: { component: Demo, source: demoSrc },
  usage: `import { Icon } from "@/components/ui/icon"
import { LinkButton } from "@/components/ui/link-button"

<LinkButton href="/sessions" variant="text" icon={<Icon name="arrow_back" />}>
  Sessions
</LinkButton>`,
  examples: [
    {
      id: "styles",
      title: "Styles, sizes and colors",
      description: (
        <>
          Every <InlineCode>Button</InlineCode> recipe prop works the same way, because both render <InlineCode>buttonVariants</InlineCode>.{" "}
          <InlineCode>isDisabled</InlineCode> drops the link out of the tab order and takes the disabled colors.
        </>
      ),
      component: Styles,
      source: stylesSrc,
    },
    {
      id: "router",
      title: "Client-side navigation",
      description: (
        <>
          Internal <InlineCode>href</InlineCode>s go through React Aria's <InlineCode>RouterProvider</InlineCode>, like every other link in the library. Set it up
          once at the root with your router's <InlineCode>navigate</InlineCode> and <InlineCode>useHref</InlineCode>; modifier-clicks and{" "}
          <InlineCode>target="_blank"</InlineCode> still open a new tab.
        </>
      ),
      component: Router,
      source: routerSrc,
    },
  ],
  api: [
    {
      name: "LinkButton",
      description: (
        <>
          Everything React Aria's {c("Link")} accepts ({c("href")}, {c("target")}, {c("rel")}, {c("download")}, {c("routerOptions")}, {c("onPress")},{" "}
          {c("onHoverStart")}, …), plus the {c("Button")} recipe props.
        </>
      ),
      props: [
        { name: "href", type: "string", default: "—", description: "Destination. Internal paths navigate through RouterProvider when one is set up." },
        { name: "variant", type: '"filled" | "tonal" | "elevated" | "outlined" | "text"', default: '"filled"', description: "Color style, as on Button." },
        { name: "size", type: '"xs" | "sm" | "md" | "lg" | "xl"', default: '"sm"', description: "Height 32 / 40 / 56 / 96 / 136dp." },
        { name: "shape", type: '"round" | "square"', default: '"round"', description: "Resting shape. Both tighten to the pressed radius on press." },
        { name: "color", type: '"primary" | "secondary" | "tertiary" | "error"', default: "—", description: "Accent role. Omit for the M3 defaults." },
        { name: "icon", type: "ReactNode", default: "—", description: "Leading slot, e.g. <Icon name=\"arrow_back\" />." },
        { name: "trailingIcon", type: "ReactNode", default: "—", description: "Trailing slot, e.g. <Icon name=\"open_in_new\" />." },
        { name: "isDisabled", type: "boolean", default: "false", description: "Removes the link from the tab order and shows the disabled colors." },
        { name: "onPress", type: "(e: PressEvent) => void", default: "—", description: "Runs before navigation; works for every input type." },
        { name: "ref", type: "Ref<HTMLAnchorElement>", default: "—", description: "The underlying <a>." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        Rendered as a native {c("<a href>")} through React Aria, so it's announced as a link, works with middle-click and "Open in new tab", and shows its URL in
        the status bar. Pick it over {c("Button")} only when pressing it goes somewhere: links and buttons are announced differently, and screen reader users
        rely on that.
      </>
    ),
    keyboard: [
      { keys: ["Tab"], description: "Moves focus to the link. The 3dp secondary focus ring shows for keyboard focus only." },
      { keys: ["Enter"], description: "Follows the link. Unlike a button, Space doesn't activate it (native link behavior)." },
      { label: "Disabled", description: "Removed from the tab order; aria-disabled is set." },
    ],
  },
  spec: {
    description: "Identical to Button: both components render the same buttonVariants recipe.",
    tables: [
      {
        columns: ["Size", "Height", "Round · pressed", "Square · pressed", "Icon"],
        rows: [
          ["XS", "32dp", "16 · 8", "12 · 8", "20dp"],
          ["S", "40dp", "20 · 8", "12 · 8", "20dp"],
          ["M", "56dp", "28 · 12", "16 · 12", "24dp"],
          ["L", "96dp", "48 · 16", "28 · 16", "32dp"],
          ["XL", "136dp", "68 · 16", "28 · 16", "40dp"],
        ],
      },
    ],
    source: "androidx ButtonXxxTokens / ButtonDefaults (via Button)",
  },
} satisfies ComponentDoc
