// Keeps same-origin preview iframes on the site's theme: mirrors the page's `dark` class and the
// ThemeProvider's dynamic-color <style> into each frame, on load and whenever the site theme changes.

import * as React from "react"

const STYLE_ID = "expressive-dynamic-color"
const FRAME_SELECTOR = "iframe[data-theme-sync]"

export function syncFrameTheme(frame: HTMLIFrameElement) {
  let doc: Document | null = null
  try {
    doc = frame.contentDocument
  } catch {
    return // cross-origin: nothing to do
  }
  if (!doc?.documentElement || !doc.head) return
  const dark = document.documentElement.classList.contains("dark")
  if (doc.documentElement.classList.contains("dark") !== dark) doc.documentElement.classList.toggle("dark", dark)
  doc.documentElement.style.colorScheme = dark ? "dark" : "light"

  const source = document.getElementById(STYLE_ID)
  let target = doc.getElementById(STYLE_ID)
  if (source) {
    if (!target) {
      target = doc.createElement("style")
      target.id = STYLE_ID
      doc.head.appendChild(target)
    }
    if (target.textContent !== source.textContent) target.textContent = source.textContent
  } else {
    target?.remove()
  }
}

/** Sync after load, then again once the frame's own ThemeProvider has mounted and applied its defaults. */
export function syncFrameAfterLoad(frame: HTMLIFrameElement) {
  syncFrameTheme(frame)
  for (const ms of [300, 1200, 2500]) setTimeout(() => frame.isConnected && syncFrameTheme(frame), ms)
}

/** Re-sync every `iframe[data-theme-sync]` when the page's theme changes. Mount once per page. */
export function useFrameThemeSync() {
  React.useEffect(() => {
    let raf = 0
    const all = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => document.querySelectorAll<HTMLIFrameElement>(FRAME_SELECTOR).forEach(syncFrameTheme))
    }
    const mo = new MutationObserver(all)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    mo.observe(document.head, { childList: true, subtree: true, characterData: true })
    return () => {
      mo.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [])
}
