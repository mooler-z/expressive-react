"use client"

import {
  Checkbox as AriaCheckbox,
  composeRenderProps,
  type CheckboxProps as AriaCheckboxProps,
} from "react-aria-components"

import { cn } from "@/lib/utils"

export type CheckboxProps = AriaCheckboxProps

/*
 * Checkbox · 18dp box, 2dp corners, 48dp touch target with a state layer.
 * Unselected · selected · indeterminate · error (isInvalid) · disabled.
 */
function Checkbox({ className, children, ...props }: CheckboxProps) {
  return (
    <AriaCheckbox
      data-slot="checkbox"
      {...props}
      className={composeRenderProps(className, (className) =>
        cn(
          "group inline-flex cursor-pointer items-center gap-1 text-body-lg text-on-surface",
          "data-disabled:cursor-default data-disabled:text-on-surface/38",
          className,
        ),
      )}
    >
      {composeRenderProps(children, (children, { isSelected, isIndeterminate }) => (
        <>
          <span
            className={cn(
              "relative grid size-12 shrink-0 place-items-center rounded-full text-on-surface",
              "group-data-selected:text-primary group-data-indeterminate:text-primary group-data-invalid:text-error",
              // state layer
              "before:absolute before:inset-1 before:rounded-full before:bg-current before:opacity-0 before:transition-opacity before:duration-150",
              "group-data-hovered:before:opacity-8 group-data-focus-visible:before:opacity-10 group-data-pressed:before:opacity-12",
              "group-data-disabled:before:hidden",
            )}
          >
            <span
              data-slot="checkbox-box"
              className={cn(
                "relative grid size-[18px] place-items-center rounded-[2px] border-2 border-on-surface-variant text-on-primary",
                "transition-[background-color,border-color] duration-150 ease-standard",
                "group-data-selected:border-primary group-data-selected:bg-primary",
                "group-data-indeterminate:border-primary group-data-indeterminate:bg-primary",
                "group-data-invalid:border-error group-data-invalid:text-on-error",
                "group-data-invalid:group-data-selected:bg-error group-data-invalid:group-data-indeterminate:bg-error",
                "group-data-disabled:border-on-surface/38",
                "group-data-disabled:group-data-selected:border-transparent group-data-disabled:group-data-selected:bg-on-surface/38 group-data-disabled:group-data-selected:text-surface",
                "group-data-disabled:group-data-indeterminate:border-transparent group-data-disabled:group-data-indeterminate:bg-on-surface/38 group-data-disabled:group-data-indeterminate:text-surface",
                "group-data-focus-visible:outline-3 group-data-focus-visible:outline-offset-[11px] group-data-focus-visible:outline-secondary",
              )}
            >
              <svg viewBox="0 0 18 18" aria-hidden className="absolute -top-0.5 -left-0.5 size-[18px] fill-none stroke-current stroke-2">
                {isIndeterminate ? (
                  <path d="M4 9h10" />
                ) : (
                  <path
                    d="M3.5 9.5l3.5 3.5 7.5-8"
                    pathLength={1}
                    strokeDasharray={1}
                    strokeDashoffset={isSelected ? 0 : 1}
                    className="transition-[stroke-dashoffset] duration-200 ease-emphasized-decelerate"
                  />
                )}
              </svg>
            </span>
          </span>
          {children}
        </>
      ))}
    </AriaCheckbox>
  )
}

export { Checkbox }
