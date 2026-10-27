"use client"

import * as React from "react"

import { prefersReducedMotion } from "@/hooks/use-motion"
import { cn } from "@/lib/utils"

/*
 * Scroll reveal · content fades up 28px as it enters the viewport (M3 emphasized-decelerate enter).
 * Anything already on screen at mount stays put, so there's no flash on load.
 */

export interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Extra delay in ms, e.g. to stagger siblings. */
  delay?: number
  /** Distance in px to travel. */
  distance?: number
}

function Reveal({ delay = 0, distance = 28, className, children, ...props }: RevealProps) {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion() || !("IntersectionObserver" in window)) return
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return

    el.style.opacity = "0"
    el.style.translate = `0 ${distance}px`
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        const anim = el.animate(
          [
            { opacity: 0, translate: `0 ${distance}px` },
            { opacity: 1, translate: "0 0" },
          ],
          { duration: 700, delay, easing: "cubic-bezier(0.05, 0.7, 0.1, 1)", fill: "backwards" },
        )
        el.style.opacity = ""
        el.style.translate = ""
        anim.onfinish = () => anim.cancel()
      },
      { rootMargin: "0px 0px -8% 0px" },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      el.style.opacity = ""
      el.style.translate = ""
    }
  }, [delay, distance])

  return (
    <div ref={ref} data-slot="reveal" className={className} {...props}>
      {children}
    </div>
  )
}

export interface RevealWordsProps extends React.HTMLAttributes<HTMLElement> {
  /** Element to render, e.g. "h1". */
  as?: React.ElementType
  /** Milliseconds between words. */
  stagger?: number
  /** Delay before the first word. */
  delay?: number
}

/**
 * Staggered headline reveal: each word rises 60% and fades in.
 * Strings are split into words; any element child counts as one word, so you can color words:
 *   <RevealWords as="h1">Run everything. <span className="text-primary">Sweat</span> <span className="text-primary">nothing.</span></RevealWords>
 */
function RevealWords({ as: Comp = "span", stagger = 70, delay = 0, className, children, ...props }: RevealWordsProps) {
  let i = 0
  const word = (node: React.ReactNode, key: React.Key) => (
    <span
      key={key}
      className="inline-block animate-[m3-reveal-word_800ms_cubic-bezier(0.05,0.7,0.1,1)_backwards] motion-reduce:animate-none"
      style={{ animationDelay: `${delay + i++ * stagger}ms` }}
    >
      {node}
    </span>
  )
  const parts: React.ReactNode[] = []
  React.Children.forEach(children, (child, ci) => {
    if (typeof child === "string" || typeof child === "number") {
      String(child)
        .split(/\s+/)
        .filter(Boolean)
        .forEach((w, wi) => parts.push(word(w, `${ci}-${wi}`)))
    } else if (child != null && child !== false) {
      parts.push(word(child, ci))
    }
  })
  return (
    <Comp data-slot="reveal-words" className={cn("flex flex-wrap gap-x-[0.25em]", className)} {...props}>
      {parts}
    </Comp>
  )
}

export { Reveal, RevealWords }
