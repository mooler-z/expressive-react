import { clsx, type ClassValue } from "clsx"
import { composeRenderProps } from "react-aria-components"
import { extendTailwindMerge } from "tailwind-merge"
import { createTV } from "tailwind-variants"

/**
 * Teach tailwind-merge the Expressive theme scales. Without this, `text-label-lg`
 * is read as a text *color* and silently dropped next to `text-on-primary`.
 * Add new names here whenever expressive.css gains a token.
 */
const twMergeConfig = {
  extend: {
    theme: {
      text: [
        "display-lg", "display-md", "display-sm",
        "headline-lg", "headline-md", "headline-sm",
        "title-lg", "title-md", "title-sm",
        "body-lg", "body-md", "body-sm",
        "label-lg", "label-md", "label-sm",
      ],
      radius: ["lg-plus", "xl-plus"],
      shadow: ["1", "2", "3", "4", "5"],
      ease: [
        "emphasized", "emphasized-decelerate", "emphasized-accelerate", "standard", "spring", "bounce",
        "fast-spatial", "default-spatial", "slow-spatial", "fast-effects", "default-effects", "slow-effects",
      ],
      animate: ["morph", "indeterminate", "fade-up", "pop", "float", "spin-slow"],
    },
  },
}

const twMerge = extendTailwindMerge(twMergeConfig)

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** tailwind-variants, sharing the merge config above. */
export const tv = createTV({ twMergeConfig })

/**
 * Merge a static className with a React Aria render-prop className.
 * `composeTailwindRenderProps(props.className, "base classes")`
 */
export function composeTailwindRenderProps<T>(
  className: string | ((v: T) => string) | undefined,
  tw: string,
): string | ((v: T) => string) {
  return composeRenderProps(className, (className) => cn(tw, className))
}
