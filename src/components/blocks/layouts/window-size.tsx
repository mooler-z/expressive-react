"use client"

import * as React from "react"

import { type WindowSizeClass, useWindowSizeClass } from "@/hooks/use-window-size-class"

/*
 * Window size class for layout blocks. Real apps follow the browser window; a demo frame or a
 * resizable panel can pin a class with <WindowSizeProvider size="expanded">.
 */

const WindowSizeContext = React.createContext<WindowSizeClass | null>(null)

function WindowSizeProvider({ size, children }: { size: WindowSizeClass; children: React.ReactNode }) {
  return <WindowSizeContext.Provider value={size}>{children}</WindowSizeContext.Provider>
}

/** Explicit `override` → nearest provider → the browser window. */
function useLayoutWindowSize(override?: WindowSizeClass): WindowSizeClass {
  const pinned = React.useContext(WindowSizeContext)
  const live = useWindowSizeClass()
  return override ?? pinned ?? live
}

const isSinglePane = (s: WindowSizeClass) => s === "compact" || s === "medium"
const isWide = (s: WindowSizeClass) => s === "large" || s === "extra-large"

export { WindowSizeProvider, isSinglePane, isWide, useLayoutWindowSize }
