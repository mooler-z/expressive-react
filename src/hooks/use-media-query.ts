"use client"

import * as React from "react"

/** Live `matchMedia` result. Returns `defaultValue` during SSR. */
export function useMediaQuery(query: string, defaultValue = false): boolean {
  const subscribe = React.useCallback(
    (onChange: () => void) => {
      const mq = window.matchMedia(query)
      mq.addEventListener("change", onChange)
      return () => mq.removeEventListener("change", onChange)
    },
    [query],
  )
  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => defaultValue,
  )
}
