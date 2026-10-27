import { Bullets, H2, Prose, Strong } from "@/docs/docs-site/guide"
import { CodePanel, InlineCode, TextLink } from "@/docs/docs-site/primitives"

export const lead = "Light, dark or system, toggled with one class on <html>. Every surface cross-fades together when it changes."

const toggle = `import { Icon } from "@/components/ui/icon"
import { ToggleIconButton } from "@/components/ui/icon-button"
import { useTheme } from "@/components/ui/theme-provider"

export function DarkModeToggle() {
  const { resolvedMode, setMode } = useTheme()
  return (
    <ToggleIconButton
      aria-label="Dark mode"
      isSelected={resolvedMode === "dark"}
      onChange={(dark) => setMode(dark ? "dark" : "light")}
    >
      <Icon name={resolvedMode === "dark" ? "dark_mode" : "light_mode"} />
    </ToggleIconButton>
  )
}`

const noFlash = `<!-- In <head>, before your CSS: picks the right class before first paint -->
<script>
  try {
    const t = JSON.parse(localStorage.getItem("expressive-theme") || "{}")
    const dark = t.mode === "dark" ||
      (t.mode !== "light" && matchMedia("(prefers-color-scheme: dark)").matches)
    document.documentElement.classList.toggle("dark", dark)
  } catch {}
</script>`

const variant = `<p className="text-on-surface-variant dark:text-on-surface">…</p>

/* expressive.css */
@custom-variant dark (&:where(.dark, .dark *));`

export default function DarkMode() {
  return (
    <Prose>
      <p>
        The dark scheme lives under <InlineCode>.dark</InlineCode> in <InlineCode>expressive.css</InlineCode>. <InlineCode>ThemeProvider</InlineCode> adds or
        removes that class on <InlineCode>&lt;html&gt;</InlineCode>, follows the OS setting in <InlineCode>system</InlineCode> mode, and remembers the choice.
      </p>

      <H2>Switching modes</H2>
      <p>
        <InlineCode>useTheme()</InlineCode> gives you <InlineCode>mode</InlineCode> (what the user picked), <InlineCode>resolvedMode</InlineCode> (what's showing) and{" "}
        <InlineCode>setMode</InlineCode>.
      </p>
      <CodePanel filename="components/dark-mode-toggle.tsx" code={toggle} />
      <Bullets>
        <li>
          <Strong>defaultMode</Strong> is <InlineCode>"system"</InlineCode>. Pass <InlineCode>"light"</InlineCode> or <InlineCode>"dark"</InlineCode> to force a
          starting point.
        </li>
        <li>
          <Strong>Persistence.</Strong> Mode, seed, variant and contrast are saved as JSON under <InlineCode>storageKey</InlineCode> (default{" "}
          <InlineCode>"expressive-theme"</InlineCode>). Pass <InlineCode>storageKey={"{null}"}</InlineCode> to turn it off.
        </li>
        <li>
          <Strong>Transition.</Strong> On every change the provider adds <InlineCode>theme-switching</InlineCode> to <InlineCode>&lt;html&gt;</InlineCode> for
          400ms, so backgrounds, text and borders fade together instead of flickering one by one.
        </li>
      </Bullets>

      <H2>No flash on load</H2>
      <p>The provider runs after hydration. To avoid a light first frame for dark-mode users, set the class before paint:</p>
      <CodePanel filename="index.html" icon="html" code={noFlash} />

      <H2>The dark: variant</H2>
      <p>
        Because roles already flip, you rarely need <InlineCode>dark:</InlineCode>. When you do, it matches <InlineCode>.dark</InlineCode> on any ancestor, so it
        also works inside a dark <TextLink to="/docs/theme-provider">ThemeScope</TextLink>.
      </p>
      <CodePanel code={variant} />
    </Prose>
  )
}
