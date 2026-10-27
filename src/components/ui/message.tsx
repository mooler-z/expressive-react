"use client"

import * as React from "react"
import {
  Button as AriaButton,
  Dialog as AriaDialog,
  DialogTrigger,
  Popover as AriaPopover,
  ToggleButton as AriaToggleButton,
  composeRenderProps,
  type ButtonProps as AriaButtonProps,
} from "react-aria-components"
import type { VariantProps } from "tailwind-variants"

import { Icon } from "@/components/ui/icon"
import { Ripple } from "@/components/ui/ripple"
import { cn, tv } from "@/lib/utils"

/*
 * Message & bubble
 * Incoming on surface-container-high, outgoing on primary. 20dp corners with a 4dp "tail" corner;
 * consecutive messages from one sender share an edge (first · middle · last shaping), and corners
 * re-shape on the FastSpatial spring when a message joins the group.
 *
 * <MessageGroup direction="incoming" avatar={<Avatar name="Maya Lindqvist" size="sm" />} name="Maya"
 *   footer={<MessageMeta>09:41</MessageMeta>}>
 *   <Message>Canary held for 30 minutes.</Message>
 *   <Message>Promoting to 100%?</Message>
 * </MessageGroup>
 */

export type MessageDirection = "incoming" | "outgoing"
type Position = "single" | "first" | "middle" | "last"

const MessageContext = React.createContext<{ direction: MessageDirection; position: Position }>({
  direction: "incoming",
  position: "single",
})

const messageVariants = tv({
  base: [
    "relative max-w-[80%] min-w-0 break-words",
    "transition-[border-radius] duration-(--md-spring-fast-spatial-duration) ease-fast-spatial",
  ],
  variants: {
    direction: {
      incoming: "bg-surface-container-high text-on-surface",
      outgoing: "bg-primary text-on-primary",
    },
    position: { single: "", first: "", middle: "", last: "" },
    /** default: padded bubble · card: no padding, clips rich content · deleted: outlined tombstone */
    variant: {
      default: "",
      card: "overflow-hidden",
      deleted: "inline-flex items-center gap-2 border border-outline-variant bg-transparent text-on-surface-variant italic [--icon-size:18px]",
    },
    size: {
      md: "text-body-md",
      lg: "text-body-lg",
    },
    status: {
      sent: "",
      /** Dimmed until delivered (sending) or after a failure. */
      sending: "opacity-80",
      failed: "opacity-60",
    },
    animate: {
      true: "animate-[m3-message-in_var(--md-spring-default-spatial-duration)_var(--md-spring-default-spatial)] motion-reduce:animate-none",
      false: "",
    },
  },
  compoundVariants: [
    // Corner shaping · 20dp all round, 4dp where bubbles meet (logical corners, so RTL mirrors)
    { direction: "incoming", position: ["single", "first"], class: "rounded-lg-plus rounded-es-xs" },
    { direction: "incoming", position: "middle", class: "rounded-e-lg-plus rounded-s-xs" },
    { direction: "incoming", position: "last", class: "rounded-lg-plus rounded-ss-xs" },
    { direction: "outgoing", position: ["single", "first"], class: "rounded-lg-plus rounded-ee-xs" },
    { direction: "outgoing", position: "middle", class: "rounded-s-lg-plus rounded-e-xs" },
    { direction: "outgoing", position: "last", class: "rounded-lg-plus rounded-se-xs" },
    { variant: ["default", "deleted"], size: "md", class: "px-4 py-2.5" },
    { variant: ["default", "deleted"], size: "lg", class: "px-4 py-3" },
    { direction: "outgoing", animate: true, class: "origin-bottom-right" },
    { direction: "incoming", animate: true, class: "origin-bottom-left" },
  ],
  defaultVariants: { variant: "default", size: "md", status: "sent", animate: false },
})

export interface MessageProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Omit<VariantProps<typeof messageVariants>, "direction" | "position"> {
  /** Defaults to the enclosing MessageGroup's direction. */
  direction?: MessageDirection
}

/** One bubble. Inside a MessageGroup it picks up direction and its position in the group. */
function Message({ direction, variant, size, status, animate, className, children, ...props }: MessageProps) {
  const ctx = React.useContext(MessageContext)
  const dir = direction ?? ctx.direction
  return (
    <div
      data-slot="message"
      data-direction={dir}
      data-position={ctx.position}
      className={messageVariants({ direction: dir, position: ctx.position, variant, size, status, animate, className })}
      {...props}
    >
      {variant === "deleted" && !children ? (
        <>
          <Icon>block</Icon>
          This message was deleted
        </>
      ) : variant === "deleted" ? (
        <>
          <Icon>block</Icon>
          {children}
        </>
      ) : (
        children
      )}
    </div>
  )
}

export interface MessageGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  direction?: MessageDirection
  /** Usually <Avatar size="sm" />; it sits beside the last bubble. */
  avatar?: React.ReactNode
  /** Sender label above the first bubble. */
  name?: React.ReactNode
  /** Under the last bubble: <MessageMeta>, <MessageReactions>, … */
  footer?: React.ReactNode
  /** Indent bubbles as if there were an avatar (for runs that continue a previous group). */
  reserveAvatar?: boolean
  children: React.ReactNode
}

/** Consecutive messages from one sender: shared avatar, name and footer, and grouped corner shaping. */
function MessageGroup({
  direction = "incoming",
  avatar,
  name,
  footer,
  reserveAvatar,
  className,
  children,
  ...props
}: MessageGroupProps) {
  const items = React.Children.toArray(children).filter(React.isValidElement)
  const n = items.length
  const hasAvatar = !!avatar || reserveAvatar
  const indent = hasAvatar ? (direction === "incoming" ? "ps-10" : "pe-10") : ""
  const align = direction === "incoming" ? "items-start" : "items-end"

  return (
    <div
      data-slot="message-group"
      data-direction={direction}
      className={cn("group/message flex flex-col gap-0.5", align, className)}
      {...props}
    >
      {name && <div className={cn("px-1 pb-0.5 text-label-md text-on-surface-variant", indent)}>{name}</div>}
      <div className={cn("flex w-full items-end gap-2", direction === "outgoing" && "flex-row-reverse")}>
        {hasAvatar && <span className="flex w-8 shrink-0 justify-center">{avatar}</span>}
        <div className={cn("flex min-w-0 flex-1 flex-col gap-0.5", align)}>
          {items.map((child, i) => (
            <MessageContext.Provider
              key={child.key ?? i}
              value={{ direction, position: n === 1 ? "single" : i === 0 ? "first" : i === n - 1 ? "last" : "middle" }}
            >
              {child}
            </MessageContext.Provider>
          ))}
        </div>
      </div>
      {footer && <div className={cn("flex max-w-full flex-col gap-1", align, indent)}>{footer}</div>}
    </div>
  )
}

export type MessageStatusValue = "sending" | "sent" | "delivered" | "read" | "failed"

const STATUS_ICON: Record<MessageStatusValue, [icon: string, label: string, className?: string]> = {
  sending: ["schedule", "Sending"],
  sent: ["check", "Sent"],
  delivered: ["done_all", "Delivered"],
  read: ["done_all", "Read", "text-primary"],
  failed: ["error", "Not delivered", "text-error"],
}

export interface MessageMetaProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Delivery state icon after the text. "failed" adds "Not delivered" and the retry action. */
  status?: MessageStatusValue
  /** Shows a Retry text button when status is "failed". */
  onRetry?: () => void
}

/** Timestamp / sender / delivery line under a bubble. */
function MessageMeta({ status, onRetry, className, children, ...props }: MessageMetaProps) {
  const [icon, label, tone] = status ? STATUS_ICON[status] : []
  return (
    <div
      data-slot="message-meta"
      className={cn(
        "flex items-center gap-1 px-1 text-label-sm text-on-surface-variant [--icon-size:16px]",
        status === "failed" && "text-error",
        className,
      )}
      {...props}
    >
      {status === "failed" ? (
        <>
          <Icon filled>error</Icon>
          {children ?? "Not delivered"}
          {onRetry && (
            <MessageTextAction onPress={onRetry} className="ms-1">
              <Icon>refresh</Icon>
              Retry
            </MessageTextAction>
          )}
        </>
      ) : (
        <>
          {children}
          {icon && (
            <Icon aria-hidden={false} role="img" aria-label={label} className={tone}>
              {icon}
            </Icon>
          )}
        </>
      )}
    </div>
  )
}

/** Small text action for meta rows (Retry, View thread…). */
function MessageTextAction({ className, children, ...props }: AriaButtonProps) {
  return (
    <AriaButton
      {...props}
      className={composeRenderProps(className, (className) =>
        cn(
          "state-layer focus-ring inline-flex h-7 cursor-pointer items-center gap-1 rounded-full px-2 text-label-md text-primary [--icon-size:16px]",
          className,
        ),
      )}
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

/** Centered system line: joins, renames, date changes. */
function SystemMessage({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-slot="system-message" role="note" className={cn("flex justify-center", className)}>
      <span className="rounded-full bg-surface-container-high px-3 py-1 text-center text-label-md text-on-surface-variant" {...props} />
    </div>
  )
}

/** Quoted message inside a bubble (reply). Colors follow the bubble's content color. */
function MessageQuote({
  author,
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { author?: React.ReactNode }) {
  return (
    <div
      data-slot="message-quote"
      className={cn("mb-1.5 rounded-sm border-s-4 border-current/60 bg-current/10 px-2 py-1", className)}
      {...props}
    >
      {author && <div className="text-label-md">{author}</div>}
      <div className="truncate text-body-sm opacity-90">{children}</div>
    </div>
  )
}

/** Link / resource preview inside a bubble. */
function MessageCard({
  icon,
  title,
  description,
  className,
  children,
  ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, "title"> & { icon?: string; title: React.ReactNode; description?: React.ReactNode }) {
  return (
    <div data-slot="message-card" className={cn("mt-3 flex items-center gap-3 rounded-md bg-surface p-3 text-on-surface", className)} {...props}>
      {icon && <Icon className="text-primary">{icon}</Icon>}
      <div className="min-w-0 flex-1">
        <div className="truncate text-title-sm">{title}</div>
        {description && <div className="truncate text-body-sm text-on-surface-variant">{description}</div>}
      </div>
      {children}
    </div>
  )
}

/* ---------- Typing indicator ---------- */

export interface TypingIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  avatar?: React.ReactNode
  /** "Jonah is typing…" under the bubble. */
  label?: React.ReactNode
}

/** Incoming bubble with three bouncing dots. */
function TypingIndicator({ avatar, label, className, ...props }: TypingIndicatorProps) {
  return (
    <div data-slot="typing-indicator" role="status" className={cn("flex flex-col gap-0.5", className)} {...props}>
      <div className="flex items-end gap-2">
        {avatar && <span className="flex w-8 shrink-0 justify-center">{avatar}</span>}
        <div aria-hidden className="flex h-10 items-center gap-1.5 rounded-lg-plus rounded-es-xs bg-surface-container-high px-4">
          {[0, 150, 300].map((d) => (
            <span
              key={d}
              className="size-2 animate-[m3-typing_1.2s_var(--md-easing-standard)_infinite] rounded-full bg-on-surface-variant motion-reduce:animate-none"
              style={{ animationDelay: `${d}ms` }}
            />
          ))}
        </div>
      </div>
      {label ? (
        <div className={cn("px-1 text-label-sm text-on-surface-variant", avatar && "ps-11")}>{label}</div>
      ) : (
        <span className="sr-only">Typing…</span>
      )}
    </div>
  )
}

/* ---------- Reactions ---------- */

export interface ReactionValue {
  emoji: string
  count: number
  /** Whether the current user reacted with this emoji. */
  reacted?: boolean
}

export interface MessageReactionsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  value?: ReactionValue[]
  defaultValue?: ReactionValue[]
  onChange?: (value: ReactionValue[]) => void
  /** Emoji offered by the add-reaction picker; [] hides the picker button. */
  picker?: string[]
  /** outlined: chips on the page background · tonal: compact filled chips for meta rows */
  variant?: "outlined" | "tonal"
}

const reactionVariants = tv({
  base: [
    "state-layer focus-ring relative inline-flex cursor-pointer items-center gap-1 rounded-full tabular-nums select-none",
    "data-selected:border-transparent data-selected:bg-secondary-container data-selected:text-on-secondary-container",
  ],
  variants: {
    variant: {
      outlined: "h-7 border border-outline-variant px-2.5 text-label-md text-on-surface-variant",
      tonal: "h-6 bg-surface-container-high px-2 text-label-sm text-on-surface-variant",
    },
  },
})

function toggleReaction(list: ReactionValue[], emoji: string): ReactionValue[] {
  const hit = list.find((r) => r.emoji === emoji)
  if (!hit) return [...list, { emoji, count: 1, reacted: true }]
  return list
    .map((r) => (r.emoji === emoji ? { ...r, reacted: !r.reacted, count: r.count + (r.reacted ? -1 : 1) } : r))
    .filter((r) => r.count > 0)
}

/** Emoji reaction chips with an add-reaction picker. Toggling updates counts. */
function MessageReactions({
  value,
  defaultValue = [],
  onChange,
  picker = ["👍", "❤️", "🚀", "👀", "😂"],
  variant = "outlined",
  className,
  ...props
}: MessageReactionsProps) {
  const [inner, setInner] = React.useState(defaultValue)
  const list = value ?? inner
  const toggle = (emoji: string) => {
    const next = toggleReaction(list, emoji)
    if (value === undefined) setInner(next)
    onChange?.(next)
  }

  return (
    <div data-slot="message-reactions" className={cn("flex flex-wrap items-center gap-1", className)} {...props}>
      {list.map((r) => (
        <AriaToggleButton
          key={r.emoji}
          isSelected={!!r.reacted}
          onChange={() => toggle(r.emoji)}
          aria-label={`${r.emoji} ${r.count}`}
          className={reactionVariants({ variant })}
        >
          <span aria-hidden>{r.emoji}</span>
          <span aria-hidden>{r.count}</span>
          <Ripple />
        </AriaToggleButton>
      ))}
      {picker.length > 0 && <ReactionPicker emoji={picker} onPick={toggle} variant={variant} />}
    </div>
  )
}

/** The add-reaction button and its pill of emoji. */
function ReactionPicker({
  emoji,
  onPick,
  variant = "outlined",
}: {
  emoji: string[]
  onPick: (emoji: string) => void
  variant?: "outlined" | "tonal"
}) {
  return (
    <DialogTrigger>
      <AriaButton
        aria-label="Add reaction"
        className={cn(
          "state-layer focus-ring relative grid cursor-pointer place-items-center rounded-full text-on-surface-variant [--icon-size:16px]",
          variant === "outlined" ? "size-7 border border-outline-variant" : "size-6 bg-surface-container-high",
        )}
      >
        <Icon>add_reaction</Icon>
        <Ripple />
      </AriaButton>
      <AriaPopover
        placement="bottom start"
        offset={4}
        className="origin-(--trigger-anchor-point) rounded-full bg-surface-container-high p-1 shadow-2 outline-none data-entering:m3-popover-enter data-exiting:m3-overlay-exit"
      >
        <AriaDialog aria-label="Pick a reaction" className="flex gap-1 outline-none">
          {({ close }) =>
            emoji.map((e) => (
              <AriaButton
                key={e}
                aria-label={`React ${e}`}
                onPress={() => {
                  onPick(e)
                  close()
                }}
                className="state-layer focus-ring relative grid size-9 cursor-pointer place-items-center rounded-full text-title-md transition-[scale] duration-(--md-spring-fast-spatial-duration) ease-fast-spatial data-hovered:scale-115 data-pressed:scale-90"
              >
                {e}
              </AriaButton>
            ))
          }
        </AriaDialog>
      </AriaPopover>
    </DialogTrigger>
  )
}

/* ---------- Voice message ---------- */

export interface VoiceMessageProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onPlay"> {
  /** Audio URL. With it, playback is handled internally; without it, drive `progress`/`isPlaying`. */
  src?: string
  /** Length in seconds (read from the audio once it loads). */
  duration?: number
  /** Bar heights 0–1. */
  waveform?: number[]
  /** Played fraction 0–1 (controlled). */
  progress?: number
  isPlaying?: boolean
  onPlayingChange?: (playing: boolean) => void
}

const DEFAULT_WAVE = [0.3, 0.55, 0.8, 0.45, 0.7, 0.95, 0.6, 0.4, 0.75, 0.5, 0.85, 0.35, 0.65, 0.9, 0.55, 0.3, 0.5, 0.7, 0.4, 0.6, 0.8, 0.45, 0.35, 0.25]

const fmtTime = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`

/** Voice note: play/pause (morphs round → square while playing), waveform that fills as it plays, time. */
function VoiceMessage({
  src,
  duration: durationProp = 0,
  waveform = DEFAULT_WAVE,
  progress: progressProp,
  isPlaying: playingProp,
  onPlayingChange,
  className,
  ...props
}: VoiceMessageProps) {
  const audio = React.useRef<HTMLAudioElement>(null)
  const [state, setState] = React.useState({ playing: false, progress: 0, duration: durationProp })
  const playing = playingProp ?? state.playing
  const progress = progressProp ?? state.progress
  const duration = state.duration || durationProp

  const toggle = () => {
    const next = !playing
    if (audio.current) {
      if (next) void audio.current.play()
      else audio.current.pause()
    }
    setState((s) => ({ ...s, playing: next }))
    onPlayingChange?.(next)
  }

  const played = Math.round(progress * waveform.length)
  return (
    <div data-slot="voice-message" className={cn("flex w-full max-w-[280px] items-center gap-3 py-2 ps-2 pe-4", className)} {...props}>
      {src && (
        <audio
          ref={audio}
          src={src}
          preload="metadata"
          onLoadedMetadata={(e) => setState((s) => ({ ...s, duration: e.currentTarget.duration }))}
          onTimeUpdate={(e) => setState((s) => ({ ...s, progress: e.currentTarget.currentTime / (e.currentTarget.duration || 1) }))}
          onEnded={() => {
            setState((s) => ({ ...s, playing: false, progress: 0 }))
            onPlayingChange?.(false)
          }}
        />
      )}
      <AriaButton
        aria-label={playing ? "Pause voice message" : "Play voice message"}
        onPress={toggle}
        className={cn(
          "state-layer focus-ring shape-morph relative grid size-10 shrink-0 cursor-pointer place-items-center rounded-[20px] bg-primary text-on-primary data-pressed:rounded-[8px]",
          playing && "rounded-[12px]",
        )}
      >
        <Icon filled>{playing ? "pause" : "play_arrow"}</Icon>
        <Ripple />
      </AriaButton>
      <div
        role="progressbar"
        aria-label="Playback"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        className="flex h-8 flex-1 items-center gap-[2px]"
      >
        {waveform.map((h, i) => (
          <span
            key={i}
            className={cn(
              "w-full rounded-full transition-colors duration-(--md-spring-fast-effects-duration)",
              i < played ? "bg-primary" : "bg-on-surface-variant/40",
            )}
            style={{ height: `${Math.max(12, h * 100)}%` }}
          />
        ))}
      </div>
      <span className="font-mono text-label-sm text-on-surface-variant tabular-nums">
        {fmtTime(playing ? progress * duration : duration)}
      </span>
    </div>
  )
}

/* ---------- Hover actions ---------- */

/**
 * Row of quick actions that appears beside a message on hover or keyboard focus.
 * Put it inside a MessageGroup (it reveals on group hover); fill it with IconButtons, Tooltips and a Menu.
 */
function MessageActions({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="message-actions"
      className={cn(
        "flex items-center gap-0.5 rounded-full bg-surface-container p-0.5 shadow-1",
        "opacity-0 transition-opacity duration-(--md-spring-fast-effects-duration)",
        "group-focus-within/message:opacity-100 group-hover/message:opacity-100 has-[[data-pressed]]:opacity-100 has-[[aria-expanded=true]]:opacity-100",
        "[@media(hover:none)]:opacity-100",
        className,
      )}
      {...props}
    />
  )
}

export {
  Message,
  MessageActions,
  MessageCard,
  MessageGroup,
  MessageMeta,
  MessageQuote,
  MessageReactions,
  MessageTextAction,
  ReactionPicker,
  SystemMessage,
  TypingIndicator,
  VoiceMessage,
  messageVariants,
  toggleReaction,
}
