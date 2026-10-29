import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { SnackbarRegion } from "@/components/ui/snackbar"
import { ThemeProvider, type SchemeVariant, type ThemeState } from "@/components/ui/theme-provider"
import { ToastRegion } from "@/components/ui/toast"
import { App } from "@/docs/app"
import "./index.css"

/*
 * Theme URL params (shareable themes, review-board frames):
 *   ?dark=1|0  ?preset=campus  ?seed=6750A4  ?variant=vibrant  ?contrast=0.5  ?embed=1 (never persist)
 */
const params = new URLSearchParams(location.search)
const embed = params.has("embed")
const fromUrl: Partial<ThemeState> = {}
if (params.has("dark")) fromUrl.mode = params.get("dark") === "1" ? "dark" : "light"
const seed = params.get("seed")?.replace("#", "")
if (seed && /^[0-9a-f]{6}$/i.test(seed)) fromUrl.seed = "#" + seed.toUpperCase()
const VARIANTS: SchemeVariant[] = ["tonalSpot", "vibrant", "expressive", "fidelity", "content", "monochrome", "neutral", "rainbow", "fruitSalad"]
const variant = params.get("variant") as SchemeVariant | null
if (variant && VARIANTS.includes(variant)) fromUrl.variant = variant
const preset = params.get("preset")
if (preset && /^[a-z0-9-]+$/i.test(preset)) fromUrl.preset = preset
if (params.get("contrast")) fromUrl.contrast = Math.max(-1, Math.min(1, Number(params.get("contrast")) || 0))

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider initialTheme={fromUrl} storageKey={embed ? null : "expressive-theme"}>
      <App />
      <SnackbarRegion />
      <ToastRegion />
    </ThemeProvider>
  </StrictMode>,
)
