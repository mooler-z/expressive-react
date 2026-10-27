"use client"

import * as React from "react"
import { I18nProvider, useLocale } from "react-aria-components"

import { cn } from "@/lib/utils"

/*
 * Direction · RTL
 * React Aria derives reading direction from the locale, so a direction switch is a locale switch
 * plus `dir` on a wrapper (for CSS logical properties and the `rtl:` variant). Use logical utilities
 * (ps-* pe-* ms-* me-* start-* end-* text-start rounded-s-*) and mirror directional icons with
 * `rtl:-scale-x-100`.
 */

const RTL_DEFAULT = "ar-u-nu-latn" // Arabic, Latin digits — numbers stay readable in mixed UIs
const LTR_DEFAULT = "en-US"

export interface DirectionProviderProps extends React.HTMLAttributes<HTMLDivElement> {
  dir: "ltr" | "rtl"
  /** Locale for React Aria (dates, numbers, keyboard direction). Defaults to the current locale when it
   *  matches `dir`, else `ar-u-nu-latn` for RTL and `en-US` for LTR. */
  locale?: string
}

/** Sets reading direction for a subtree: `dir` for CSS, locale for React Aria behaviour. */
function DirectionProvider({ dir, locale, className, children, ...props }: DirectionProviderProps) {
  const current = useLocale()
  const resolved = locale ?? (current.direction === dir ? current.locale : dir === "rtl" ? RTL_DEFAULT : LTR_DEFAULT)
  return (
    <I18nProvider locale={resolved}>
      <div dir={dir} lang={resolved.split("-u-")[0]} data-slot="direction" className={cn(className)} {...props}>
        {children}
      </div>
    </I18nProvider>
  )
}

/** Current reading direction from the nearest locale ("ltr" | "rtl"). */
function useDirection(): "ltr" | "rtl" {
  return useLocale().direction
}

export { DirectionProvider, useDirection }
