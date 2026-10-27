"use client"

import {
  Switch as AriaSwitch,
  composeRenderProps,
  type SwitchProps as AriaSwitchProps,
} from "react-aria-components"

import { cn } from "@/lib/utils"

export interface SwitchProps extends AriaSwitchProps {
  /** Show ✓ / ✕ glyphs inside the handle. */
  icons?: boolean
}

/*
 * Switch · 52×32 track.
 * Unselected: outline border, 16dp outline handle (24dp with icons).
 * Selected: primary track, 24dp on-primary handle. Pressed: 28dp handle.
 */
function Switch({ className, children, icons = false, ...props }: SwitchProps) {
  return (
    <AriaSwitch
      data-slot="switch"
      {...props}
      className={composeRenderProps(className, (className) =>
        cn(
          "group inline-flex cursor-pointer items-center gap-4 text-body-lg text-on-surface",
          "data-disabled:cursor-default data-disabled:opacity-38",
          className,
        ),
      )}
    >
      {composeRenderProps(children, (children) => (
        <>
          <span
            data-slot="switch-track"
            className={cn(
              "relative inline-flex h-8 w-13 shrink-0 items-center rounded-full border-2 border-outline bg-surface-container-highest",
              "transition-colors duration-200 ease-standard",
              "group-data-selected:border-primary group-data-selected:bg-primary",
              "group-data-focus-visible:outline-3 group-data-focus-visible:outline-offset-2 group-data-focus-visible:outline-secondary",
            )}
          >
            {/* 28dp slot that slides; the handle grows inside it. ::before is the 40dp state layer. */}
            <span
              className={cn(
                "absolute left-0 grid size-7 place-items-center rounded-full",
                "transition-transform duration-(--md-spring-fast-spatial-duration) ease-fast-spatial group-data-selected:translate-x-5",
                "before:absolute before:-inset-1.5 before:rounded-full before:bg-on-surface before:opacity-0 before:transition-opacity before:duration-150",
                "group-data-selected:before:bg-primary",
                "group-data-hovered:before:opacity-8 group-data-focus-visible:before:opacity-10 group-data-pressed:before:opacity-12",
              )}
            >
              <span
                data-slot="switch-handle"
                className={cn(
                  "relative grid place-items-center rounded-full bg-outline",
                  "transition-[width,height,background-color] duration-(--md-spring-fast-spatial-duration) ease-fast-spatial",
                  icons ? "size-6" : "size-4",
                  "group-data-hovered:bg-on-surface-variant",
                  "group-data-selected:size-6 group-data-selected:bg-on-primary group-data-selected:group-data-hovered:bg-primary-container",
                  "group-data-pressed:size-7",
                )}
              >
                {icons && (
                  <svg viewBox="0 0 16 16" aria-hidden className="size-4 fill-none stroke-2 stroke-current">
                    <path
                      d="M4.5 4.5l7 7M11.5 4.5l-7 7"
                      className="text-surface-container-highest transition-opacity duration-200 group-data-selected:opacity-0"
                    />
                    <path
                      d="M3.5 8.5l3 3 6-7"
                      className="text-on-primary-container opacity-0 transition-opacity duration-200 group-data-selected:opacity-100"
                    />
                  </svg>
                )}
              </span>
            </span>
          </span>
          {children}
        </>
      ))}
    </AriaSwitch>
  )
}

export { Switch }
