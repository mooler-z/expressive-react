import { Bullets, H2, Prose, Strong } from "@/docs/docs-site/guide"
import { CodePanel, InlineCode, TextLink } from "@/docs/docs-site/primitives"

export const lead = "Right-to-left is a direction, not a fork. Set it once and every component mirrors its layout and its keyboard."

const app = `import { DirectionProvider } from "@/components/ui/direction"

<DirectionProvider dir="rtl" locale="ar-u-nu-latn">
  <App />
</DirectionProvider>`

const own = `// Logical utilities mirror for free
<div className="ps-4 pe-2 text-start border-s">…</div>

// Read the direction when you need it
import { useDirection } from "@/components/ui/direction"
const dir = useDirection() // "ltr" | "rtl"`

export default function Rtl() {
  return (
    <Prose>
      <p>
        <InlineCode>DirectionProvider</InlineCode> does two things: it sets <InlineCode>dir</InlineCode> for CSS, and it gives React Aria a matching locale, which is
        what flips arrow keys, slider directions and date formatting.
      </p>
      <CodePanel code={app} />
      <Bullets>
        <li>
          <Strong>locale</Strong> is optional. RTL defaults to <InlineCode>ar-u-nu-latn</InlineCode> (Arabic with Latin digits, so numbers stay readable in mixed
          UIs); LTR defaults to <InlineCode>en-US</InlineCode>.
        </li>
        <li>You can wrap any subtree, not just the app. Every component page's preview has an RTL toggle that does exactly that.</li>
      </Bullets>

      <H2>What mirrors</H2>
      <Bullets>
        <li>Layout: components use logical properties (start / end), so icons, padding and corners swap sides.</li>
        <li>Keyboard: ←/→ follow reading order in tabs, menus, sliders, toolbars and carousels.</li>
        <li>Sliders fill from the right; carousels start at the right edge; chat bubbles shape their start/end corners.</li>
        <li>Icons that mean a direction (arrow_forward, chevron_right) are yours to swap; use the forward/back pair that reads correctly.</li>
      </Bullets>

      <H2>In your own code</H2>
      <CodePanel code={own} />
      <p>
        See the <TextLink to="/docs/direction">Direction</TextLink> page for a live side-by-side.
      </p>
    </Prose>
  )
}
