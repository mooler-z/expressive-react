import { LOGO_BAND, LOGO_CLOVER, LOGO_RUNS, LOGO_THEME } from "@/docs/site/logo-paths"
import { cn } from "@/lib/utils"

/*
 * The Expressive React mark: a regular {8/3} star drawn as one ribbon in four tonal runs, around the
 * shape library's clover4. Paths and colors come from scripts/logo.mjs, which also writes
 * public/logo.svg, logo-dark.svg and favicon.svg.
 * Hovering a `group` ancestor (react-router links) or a RAC item (data-hovered) turns the star one
 * point (45°) on the DefaultSpatial spring; it lands on its own silhouette with the colors moved on.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" data-slot="logo-mark" className={cn("shrink-0", LOGO_THEME, className)}>
      <g
        fill="none"
        strokeWidth={LOGO_BAND}
        className={cn(
          "isolate origin-center [transform-box:view-box]",
          "transition-[rotate] duration-(--md-spring-default-spatial-duration) ease-default-spatial motion-reduce:transition-none",
          "group-hover:rotate-45 group-data-hovered:rotate-45",
        )}
      >
        <path d={LOGO_RUNS.plum} stroke="var(--logo-plum)" className="mix-blend-multiply" />
        <path d={LOGO_RUNS.indigo} stroke="var(--logo-indigo)" className="mix-blend-multiply" />
        <path d={LOGO_RUNS.violet} stroke="var(--logo-violet)" className="mix-blend-multiply" />
        <path d={LOGO_RUNS.lavender} stroke="var(--logo-lavender)" className="opacity-(--logo-lavender-opacity)" />
      </g>
      <path d={LOGO_CLOVER} fill="var(--logo-clover)" />
    </svg>
  )
}
