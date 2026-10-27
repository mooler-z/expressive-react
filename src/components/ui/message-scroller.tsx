"use client"

import * as React from "react"
import { Button as AriaButton, TextArea, TextField, type TextFieldProps } from "react-aria-components"

import { Badge } from "@/components/ui/badge"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { LoadingIndicator } from "@/components/ui/loading-indicator"
import { Ripple } from "@/components/ui/ripple"
import { cn } from "@/lib/utils"

/*
 * Message scroller · the thread container
 * Header (64dp) · scroll region that owns the scrollbar, sticks to the newest message and keeps its
 * place when history loads above · sticky date pills · "jump to latest" small FAB on
 * secondary-container with an unread count · composer whose textarea grows.
 *
 * <ChatPanel>
 *   <ChatHeader title="platform-oncall" subtitle="8 members" onBack={…} />
 *   <MessageScroller onLoadMore={loadOlder} hasMore>
 *     <DateSeparator>Today</DateSeparator>
 *     <MessageGroup …>…</MessageGroup>
 *   </MessageScroller>
 *   <ChatComposer onSend={send} placeholder="Message #platform-oncall" />
 * </ChatPanel>
 */

/** Outer frame: header, scroller and composer stacked in a clipped surface. */
function ChatPanel({ elevated = false, className, ...props }: React.HTMLAttributes<HTMLDivElement> & { elevated?: boolean }) {
  return (
    <div
      data-slot="chat-panel"
      className={cn("relative flex flex-col overflow-hidden rounded-xl bg-surface text-on-surface", elevated && "shadow-1", className)}
      {...props}
    />
  )
}

export interface ChatHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode
  subtitle?: React.ReactNode
  /** Avatar or channel glyph. */
  avatar?: React.ReactNode
  /** Shows a back arrow. */
  onBack?: () => void
  /** Trailing icon buttons / menu. */
  actions?: React.ReactNode
  bordered?: boolean
}

function ChatHeader({ title, subtitle, avatar, onBack, actions, bordered = false, className, ...props }: ChatHeaderProps) {
  return (
    <div
      data-slot="chat-header"
      className={cn("flex h-16 shrink-0 items-center gap-2 px-2", bordered && "border-b border-outline-variant", className)}
      {...props}
    >
      {onBack && (
        <IconButton aria-label="Back" onPress={onBack} className="text-on-surface">
          <Icon>arrow_back</Icon>
        </IconButton>
      )}
      {avatar && <span className={cn("shrink-0", !onBack && "ps-2")}>{avatar}</span>}
      <div className="min-w-0 flex-1">
        <div className="truncate text-title-md">{title}</div>
        {subtitle && <div className="truncate text-body-sm text-on-surface-variant">{subtitle}</div>}
      </div>
      {actions && <div className="flex shrink-0 items-center">{actions}</div>}
    </div>
  )
}

/* ---------- Scroller ---------- */

export interface MessageScrollerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  children: React.ReactNode
  /** Classes for the inner message list (spacing, padding). */
  contentClassName?: string
  /** Called when the user scrolls near the top; the list keeps its place while older items are inserted. */
  onLoadMore?: () => void | Promise<void>
  hasMore?: boolean
  loadingLabel?: React.ReactNode
  /** Label of the jump button; `false` renders the icon-only small FAB. */
  jumpLabel?: string | false
  /** Accessible name of the log. */
  "aria-label"?: string
}

const NEAR = 48

/** Scroll region that sticks to the newest message, counts unread arrivals and preserves position on prepend. */
function MessageScroller({
  children,
  className,
  contentClassName,
  onLoadMore,
  hasMore = false,
  loadingLabel = "Loading earlier messages…",
  jumpLabel = "Jump to latest",
  "aria-label": ariaLabel = "Messages",
  ...props
}: MessageScrollerProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const contentRef = React.useRef<HTMLDivElement>(null)
  const atBottomRef = React.useRef(true)
  const lastTop = React.useRef(0)
  const loadingRef = React.useRef(false)
  /** While older rows are inserted, keep this distance from the bottom so the view doesn't move. */
  const anchorRef = React.useRef<number | null>(null)
  const [atBottom, setAtBottom] = React.useState(true)
  const [unread, setUnread] = React.useState(0)
  const [loading, setLoading] = React.useState(false)

  const hasMoreRef = React.useRef(hasMore)
  const loadMoreRef = React.useRef(onLoadMore)
  hasMoreRef.current = hasMore
  loadMoreRef.current = onLoadMore

  const setBottom = React.useCallback((v: boolean) => {
    atBottomRef.current = v
    setAtBottom(v)
    if (v) setUnread(0)
  }, [])

  const scrollToBottom = React.useCallback(
    (smooth: boolean) => {
      const el = scrollRef.current
      if (!el) return
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      el.scrollTo({ top: el.scrollHeight, behavior: smooth && !reduce ? "smooth" : "auto" })
      setBottom(true)
    },
    [setBottom],
  )

  const loadMore = React.useCallback(async () => {
    const el = scrollRef.current
    if (!el || loadingRef.current || !hasMoreRef.current || !loadMoreRef.current) return
    loadingRef.current = true
    setLoading(true) // the loader row appears at the top, where the reader is looking
    try {
      await loadMoreRef.current()
    } finally {
      // Resolved but not yet committed: pin the current distance from the bottom so the
      // older rows (and the loader leaving) land above without moving what's on screen.
      anchorRef.current = el.scrollHeight - el.scrollTop
      loadingRef.current = false
      setLoading(false)
      // Release the anchor once React has committed the inserted rows.
      requestAnimationFrame(() => requestAnimationFrame(() => (anchorRef.current = null)))
    }
  }, [])

  React.useLayoutEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [])

  React.useEffect(() => {
    const el = scrollRef.current
    const content = contentRef.current
    if (!el || !content) return

    const onMutate = (records: MutationRecord[]) => {
      if (anchorRef.current != null) {
        el.scrollTop = el.scrollHeight - anchorRef.current
        lastTop.current = el.scrollTop
        return
      }
      if (atBottomRef.current) {
        scrollToBottom(true)
        return
      }
      let added = 0
      for (const r of records)
        for (const n of r.addedNodes)
          if (
            n instanceof HTMLElement &&
            n.parentElement === content &&
            n.dataset.slot !== "typing-indicator" &&
            !n.hasAttribute("data-scroller-ignore")
          )
            added++
      if (added) setUnread((u) => u + added)
    }
    const mo = new MutationObserver(onMutate)
    mo.observe(content, { childList: true, subtree: true, characterData: true })

    // Late growth (images, typing indicator) while pinned to the bottom.
    const ro = new ResizeObserver(() => {
      if (anchorRef.current != null) el.scrollTop = el.scrollHeight - anchorRef.current
      else if (atBottomRef.current) el.scrollTop = el.scrollHeight
    })
    ro.observe(content)
    return () => {
      mo.disconnect()
      ro.disconnect()
    }
  }, [scrollToBottom])

  const onScroll = () => {
    const el = scrollRef.current
    if (!el) return
    const top = el.scrollTop
    const fromBottom = el.scrollHeight - top - el.clientHeight
    // Only an upward scroll unpins; smooth programmatic scrolls downward never do.
    if (fromBottom < NEAR) {
      if (!atBottomRef.current) setBottom(true)
    } else if (top < lastTop.current - 2 && atBottomRef.current) setBottom(false)
    lastTop.current = top
    if (top < 80) void loadMore()
  }

  // Asking for older messages at the very top (or when the thread is too short to scroll) still loads them.
  const touchY = React.useRef<number | null>(null)
  const atTop = () => (scrollRef.current?.scrollTop ?? 1) <= 0

  return (
    <div data-slot="message-scroller" className={cn("relative min-h-0 flex-1", className)} {...props}>
      <div
        ref={scrollRef}
        role="log"
        aria-label={ariaLabel}
        tabIndex={0}
        onScroll={onScroll}
        onWheel={(e) => e.deltaY < 0 && atTop() && void loadMore()}
        onTouchStart={(e) => (touchY.current = e.touches[0]?.clientY ?? null)}
        onTouchMove={(e) => {
          const y = e.touches[0]?.clientY
          if (touchY.current != null && y != null && y - touchY.current > 24 && atTop()) void loadMore()
        }}
        onKeyDown={(e) => ["PageUp", "Home", "ArrowUp"].includes(e.key) && atTop() && void loadMore()}
        className="relative focus-ring h-full overflow-y-auto overscroll-contain [scrollbar-color:var(--md-outline-variant)_transparent] [scrollbar-width:thin]"
      >
        {/* Short threads sit at the bottom, next to the composer, like any chat. */}
        <div ref={contentRef} className={cn("flex min-h-full flex-col justify-end space-y-3 px-4 pb-4", contentClassName)}>
          {loading && (
            <div data-scroller-ignore className="flex items-center justify-center gap-2 py-1 text-label-md text-on-surface-variant">
              <LoadingIndicator size={24} aria-label="Loading earlier messages" />
              {loadingLabel}
            </div>
          )}
          {children}
        </div>
      </div>
      <JumpToLatest visible={!atBottom} unread={unread} label={jumpLabel} onPress={() => scrollToBottom(true)} />
    </div>
  )
}

function JumpToLatest({
  visible,
  unread,
  label,
  onPress,
}: {
  visible: boolean
  unread: number
  label: string | false
  onPress: () => void
}) {
  return (
    <AriaButton
      aria-label={label ? undefined : unread ? `Jump to latest, ${unread} new` : "Jump to latest"}
      onPress={onPress}
      excludeFromTabOrder={!visible}
      aria-hidden={!visible || undefined}
      className={cn(
        "state-layer focus-ring absolute end-3 bottom-3 z-20 inline-flex h-10 cursor-pointer items-center justify-center rounded-md shadow-3 [--icon-size:20px]",
        "transition-[opacity,scale,border-radius] duration-(--md-spring-fast-spatial-duration) ease-fast-spatial data-pressed:rounded-[8px]",
        label
          ? "gap-2 bg-secondary-container ps-3 pe-4 text-label-lg text-on-secondary-container"
          : "w-10 bg-primary-container text-on-primary-container",
        !visible && "pointer-events-none scale-50 opacity-0",
      )}
    >
      <Icon>arrow_downward</Icon>
      {label}
      {unread > 0 && (
        <Badge
          count={unread}
          max={99}
          aria-hidden
          className={cn("absolute", label ? "-end-1 -top-1" : "-end-1 -top-1")}
        />
      )}
      <Ripple />
    </AriaButton>
  )
}

/** Day label that sticks to the top of the scroll region while its messages pass under it. */
function DateSeparator({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-slot="date-separator" className={cn("pointer-events-none sticky top-0 z-10 flex justify-center pt-1", className)} {...props}>
      <span className="pointer-events-auto rounded-full bg-surface-container-high px-3 py-1 text-label-md text-on-surface-variant shadow-1">
        {children}
      </span>
    </div>
  )
}

/** "3 new messages" rule above the first unread message. */
function UnreadDivider({ className, children = "New messages", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-slot="unread-divider" role="separator" className={cn("flex items-center gap-3 py-1", className)} {...props}>
      <span className="h-px flex-1 bg-primary/40" />
      <span className="text-label-md text-primary">{children}</span>
      <span className="h-px flex-1 bg-primary/40" />
    </div>
  )
}

/* ---------- Composer ---------- */

export interface ChatComposerProps extends Omit<TextFieldProps, "children" | "className" | "onSubmit"> {
  /** Called with the trimmed text on Enter (Shift+Enter adds a line) or the send button. The field then clears. */
  onSend?: (text: string) => void
  placeholder?: string
  /** Shows the attach button. */
  onAttach?: () => void
  attachLabel?: string
  /** Chips / thumbnails shown above the text row (tonal variant). */
  attachments?: React.ReactNode
  /** tonal: 28dp container with a growing textarea · compact: one-line pill */
  variant?: "tonal" | "compact"
  /** Extra controls before the send button (emoji, mic…). */
  trailing?: React.ReactNode
  className?: string
}

/** Message input with attach and send. Enter sends, Shift+Enter breaks the line. */
function ChatComposer({
  onSend,
  placeholder = "Message",
  onAttach,
  attachLabel = "Attach",
  attachments,
  variant = "tonal",
  trailing,
  value: controlled,
  defaultValue = "",
  onChange,
  className,
  "aria-label": ariaLabel,
  ...props
}: ChatComposerProps) {
  const [inner, setInner] = React.useState(defaultValue)
  const value = controlled ?? inner
  const setValue = (v: string) => {
    if (controlled === undefined) setInner(v)
    onChange?.(v)
  }
  const canSend = value.trim().length > 0 && !props.isDisabled
  const send = () => {
    if (!canSend) return
    onSend?.(value.trim())
    setValue("")
  }

  const tonal = variant === "tonal"
  return (
    <div data-slot="chat-composer" className={cn("shrink-0 border-t border-outline-variant", tonal ? "p-3" : "p-2", className)}>
      <div className={cn(tonal && "rounded-xl bg-surface-container-high")}>
        {attachments && <div className={cn("flex flex-wrap gap-2", tonal ? "p-2 pb-0" : "pb-2")}>{attachments}</div>}
        <div className={cn("flex gap-1", tonal ? "items-end gap-2 p-1.5 ps-2" : "items-center")}>
          {onAttach && (
            <IconButton aria-label={attachLabel} onPress={onAttach} className={cn(tonal && "h-12 w-12 rounded-[24px]")}>
              <Icon>add_circle</Icon>
            </IconButton>
          )}
          <TextField
            aria-label={ariaLabel ?? placeholder}
            value={value}
            onChange={setValue}
            {...props}
            className={cn("flex min-w-0 flex-1", !tonal && "h-10 items-center rounded-full bg-surface-container-high px-4")}
          >
            <TextArea
              rows={1}
              placeholder={placeholder}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault()
                  send()
                }
              }}
              className={cn(
                "w-full resize-none bg-transparent text-on-surface outline-none placeholder:text-on-surface-variant [field-sizing:content]",
                tonal ? "max-h-40 min-h-12 py-3 text-body-lg" : "max-h-24 text-body-md",
              )}
            />
          </TextField>
          {trailing}
          <IconButton
            variant="filled"
            aria-label="Send"
            isDisabled={!canSend}
            onPress={send}
            className={cn(tonal && "h-12 w-12 rounded-[24px]")}
          >
            <Icon filled>send</Icon>
          </IconButton>
        </div>
      </div>
    </div>
  )
}

export { ChatComposer, ChatHeader, ChatPanel, DateSeparator, MessageScroller, UnreadDivider }
