import { useEffect, useState } from "react"

import { CodeBlock } from "@/components/ui/code-block"
import { getThemePreset, presetCss } from "@/components/ui/theme-presets"

export default function ThemePresetsCss() {
  const [css, setCss] = useState("")

  useEffect(() => {
    presetCss(getThemePreset("paper")!).then(setCss)
  }, [])

  // One declaration per line; the @import URL keeps its own semicolons
  const [, fontImport = "", rules = ""] = css.match(/^(@import url\("[^"]*"\);)?([\s\S]*)$/) ?? []
  const pretty = (fontImport ? fontImport + "\n\n" : "") + rules.replace(/\{/g, " {\n  ").replace(/;/g, ";\n  ").replace(/\s*\}/g, "\n}\n")

  return (
    <div className="w-full max-w-2xl">
      <CodeBlock code={pretty.slice(0, 1400) + (pretty.length > 1400 ? "\n/* … */" : "")} language="css" filename="presetCss(paper)" />
    </div>
  )
}
