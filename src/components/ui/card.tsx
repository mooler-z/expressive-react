"use client"

import * as React from "react"
import {
  Button as AriaButton,
  Link as AriaLink,
  composeRenderProps,
  type ButtonProps as AriaButtonProps,
  type LinkProps as AriaLinkProps,
} from "react-aria-components"
import type { VariantProps } from "tailwind-variants"

import { Ripple } from "@/components/ui/ripple"
import { cn, tv } from "@/lib/utils"

/*
 * Cards · M3 (androidx ElevatedCardTokens / FilledCardTokens / OutlinedCardTokens)
 *   elevated  surface-container-low · level 1 (hover 2)
 *   filled    surface-container-highest · level 0 (hover 1)
 *   outlined  surface · 1dp outline-variant · level 0 (hover 1)
 *   shape     12dp (corner medium). Expressive layouts may round up via className (rounded-xl).
 */
const cardVariants = tv({
  base: "relative flex flex-col overflow-hidden rounded-md text-on-surface",
  variants: {
    variant: {
      elevated: "bg-surface-container-low shadow-1",
      filled: "bg-surface-container-highest",
      outlined: "border border-outline-variant bg-surface",
    },
    interactive: {
      true: "state-layer focus-ring shape-morph cursor-pointer text-left outline-none data-disabled:cursor-default data-disabled:opacity-38",
      false: "",
    },
  },
  compoundVariants: [
    { interactive: true, variant: "elevated", class: "data-hovered:shadow-2 data-pressed:shadow-1" },
    { interactive: true, variant: ["filled", "outlined"], class: "data-hovered:shadow-1 data-pressed:shadow-none" },
  ],
  defaultVariants: { variant: "elevated", interactive: false },
})

type CardStyleProps = Omit<VariantProps<typeof cardVariants>, "interactive">

export interface CardProps extends React.HTMLAttributes<HTMLDivElement>, CardStyleProps {}

/** Static card container. Use CardButton / CardLink when the whole card is one action. */
function Card({ className, variant, ...props }: CardProps) {
  return <div data-slot="card" className={cardVariants({ variant, className })} {...props} />
}

export interface CardButtonProps extends AriaButtonProps, CardStyleProps {}

/** Whole-card action (no other interactive content inside). */
function CardButton({ className, variant, children, ...props }: CardButtonProps) {
  return (
    <AriaButton
      data-slot="card"
      {...props}
      className={composeRenderProps(className, (className) => cardVariants({ variant, interactive: true, className }))}
    >
      {composeRenderProps(children, (children) => (
        <>
          {children}
          <Ripple />
        </>
      ))}
    </AriaButton>
  )
}

export interface CardLinkProps extends AriaLinkProps, CardStyleProps {}

/** Whole-card navigation link. */
function CardLink({ className, variant, children, ...props }: CardLinkProps) {
  return (
    <AriaLink
      data-slot="card"
      {...props}
      className={composeRenderProps(className, (className) => cardVariants({ variant, interactive: true, className }))}
    >
      {composeRenderProps(children, (children) => (
        <>
          {children}
          <Ripple />
        </>
      ))}
    </AriaLink>
  )
}

/** Avatar / title / subhead / trailing action row. */
function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="card-header" className={cn("flex items-center gap-3 p-4", className)} {...props} />
}

/** Small label above the title ("Elevated", "Guide · 6 min"). */
function CardOverline({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="card-overline" className={cn("text-label-md text-on-surface-variant", className)} {...props} />
}

function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="card-title" className={cn("text-title-lg", className)} {...props} />
}

function CardSubtitle({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="card-subtitle" className={cn("text-body-md text-on-surface-variant", className)} {...props} />
}

function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p data-slot="card-description" className={cn("text-body-md text-on-surface-variant", className)} {...props} />
}

export interface CardMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Width / height. Defaults to 16:9. Pass `null` to size it yourself. */
  ratio?: number | null
}

/** Edge-to-edge media slot. Put an <img> (object-cover is applied) or a placeholder inside. */
function CardMedia({ className, ratio = 16 / 9, style, ...props }: CardMediaProps) {
  return (
    <div
      data-slot="card-media"
      className={cn("relative grid shrink-0 place-items-center overflow-hidden [&>img]:size-full [&>img]:object-cover [&>video]:size-full [&>video]:object-cover", className)}
      style={{ ...(ratio ? { aspectRatio: ratio } : null), ...style }}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="card-content" className={cn("p-4", className)} {...props} />
}

/** Action row. Trailing-aligned by default. */
function CardActions({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="card-actions" className={cn("flex flex-wrap justify-end gap-2 px-4 pb-4", className)} {...props} />
}

export {
  Card,
  CardActions,
  CardButton,
  CardContent,
  CardDescription,
  CardHeader,
  CardLink,
  CardMedia,
  CardOverline,
  CardSubtitle,
  CardTitle,
  cardVariants,
}
