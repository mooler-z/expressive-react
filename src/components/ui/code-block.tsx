"use client"

import * as React from "react"
import { Tab, TabList, TabPanel, Tabs, type Key } from "react-aria-components"

import { Icon } from "@/components/ui/icon"
import { IconButton, type IconButtonProps } from "@/components/ui/icon-button"
import { cn } from "@/lib/utils"

/*
 * Code block · Roboto Mono on surface-container-lowest, toolbar header, optional line numbers,
 * diff rows (primary-container adds / error-container removals) and language tabs.
 */

/* ---------- Copy button ---------- */

export interface CopyButtonProps extends Omit<IconButtonProps, "children" | "onPress" | "aria-label" | "aria-labelledby"> {
  /** Text to copy. */
  value: string
  "aria-label"?: string
  /** Called after a successful copy (e.g. to show a snackbar). */
  onCopied?: (value: string) => void
}

/** Icon button that copies `value` and flips to a check for 2s. */
function CopyButton({ value, onCopied, "aria-label": ariaLabel = "Copy", className, size = "sm", ...props }: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false)
  React.useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(t)
  }, [copied])
  return (
    <IconButton
      {...props}
      size={size}
      aria-label={copied ? "Copied" : ariaLabel}
      className={cn("text-current [--icon-size:20px]", className)}
      onPress={async () => {
        try {
          await navigator.clipboard.writeText(value)
          setCopied(true)
          onCopied?.(value)
        } catch {
          // clipboard blocked (insecure context / permissions) — leave the icon as is
        }
      }}
    >
      <Icon>{copied ? "check" : "content_copy"}</Icon>
    </IconButton>
  )
}

/* ---------- Code body ---------- */

type LineKind = "add" | "remove" | "context"

function parseLines(code: string, diff: boolean): { kind: LineKind; text: string }[] {
  return code.replace(/\n$/, "").split("\n").map((line) => {
    if (!diff) return { kind: "context", text: line }
    if (line.startsWith("+")) return { kind: "add", text: line.slice(1) }
    if (line.startsWith("-")) return { kind: "remove", text: line.slice(1) }
    return { kind: "context", text: line.startsWith(" ") ? line.slice(1) : line }
  })
}

function CodeLines({ code, lineNumbers, diff, startLine = 1 }: { code: string; lineNumbers?: boolean; diff?: boolean; startLine?: number }) {
  const lines = parseLines(code, !!diff)
  return (
    <pre className={cn("overflow-x-auto font-mono text-body-sm leading-6 text-on-surface", diff ? "py-2" : "p-4")}>
      <code className="block min-w-fit">
        {lines.map((l, i) => (
          <span
            key={i}
            className={cn(
              "flex",
              diff && "pr-4",
              l.kind === "add" && "bg-primary-container text-on-primary-container",
              l.kind === "remove" && "bg-error-container text-on-error-container",
            )}
          >
            {lineNumbers && (
              <span aria-hidden className={cn("shrink-0 text-right select-none opacity-60", diff ? "w-8 pr-2" : "mr-4 min-w-[2ch]")}>
                {startLine + i}
              </span>
            )}
            {diff && (
              <span aria-hidden className="w-5 shrink-0 text-center select-none">
                {l.kind === "add" ? "+" : l.kind === "remove" ? "−" : " "}
              </span>
            )}
            <span className="whitespace-pre">{l.text || "​"}</span>
          </span>
        ))}
      </code>
    </pre>
  )
}

/* ---------- CodeBlock ---------- */

export interface CodeSnippet {
  label: string
  code: string
  language?: string
}

export interface CodeBlockProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Source to show and copy. Ignored when `snippets` is set. */
  code?: string
  /** Tabbed variants of the same snippet (cURL / JavaScript / Python). */
  snippets?: CodeSnippet[]
  filename?: string
  language?: string
  /** Header icon (Material Symbol). */
  icon?: string
  lineNumbers?: boolean
  startLine?: number
  /** Treat lines starting with "+" / "-" as additions / removals. */
  diff?: boolean
  /** Show the copy button. */
  copyable?: boolean
  onCopied?: (value: string) => void
  /** Pre-highlighted body; replaces the plain rendering of `code` (copy still uses `code`). */
  children?: React.ReactNode
}

function CodeBlock({
  code = "",
  snippets,
  filename,
  language,
  icon,
  lineNumbers,
  startLine,
  diff,
  copyable = true,
  onCopied,
  className,
  children,
  ...props
}: CodeBlockProps) {
  const frame = cn("overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest", className)

  const [tab, setTab] = React.useState<Key | undefined>(snippets?.[0]?.label)

  if (snippets?.length) {
    return (
      <Tabs
        data-slot="code-block"
        className={frame}
        selectedKey={tab}
        onSelectionChange={setTab}
        {...(props as object)}
      >
        <>
            <div className="flex items-center border-b border-outline-variant pr-1 pl-2">
              <TabList aria-label={filename ?? "Language"} className="flex">
                {snippets.map((s) => (
                  <Tab
                    key={s.label}
                    id={s.label}
                    className="state-layer flex h-11 cursor-pointer items-center border-b-2 border-transparent px-3 text-label-lg text-on-surface-variant outline-none data-focus-visible:outline-3 data-focus-visible:-outline-offset-3 data-focus-visible:outline-secondary data-selected:border-primary data-selected:text-primary"
                  >
                    {s.label}
                  </Tab>
                ))}
              </TabList>
              {copyable && (
                <CopyButton
                  className="ml-auto text-on-surface-variant"
                  value={snippets.find((s) => s.label === tab)?.code ?? snippets[0].code}
                  onCopied={onCopied}
                />
              )}
            </div>
            {snippets.map((s) => (
              <TabPanel key={s.label} id={s.label} className="outline-none">
                <CodeLines code={s.code} lineNumbers={lineNumbers} startLine={startLine} />
              </TabPanel>
            ))}
        </>
      </Tabs>
    )
  }

  const lines = parseLines(code, !!diff)
  const added = lines.filter((l) => l.kind === "add").length
  const removed = lines.filter((l) => l.kind === "remove").length
  const hasHeader = filename || language || icon || diff

  return (
    <div data-slot="code-block" className={cn(frame, !hasHeader && "relative")} {...props}>
      {hasHeader ? (
        <div className="flex h-12 items-center gap-2 border-b border-outline-variant pr-1 pl-4">
          <Icon size={18} className="text-on-surface-variant">{icon ?? (diff ? "difference" : "code")}</Icon>
          <span className="min-w-0 flex-1 truncate font-mono text-body-sm text-on-surface-variant">{filename}</span>
          {diff && (
            <span className="font-mono text-label-md">
              <span className="text-primary">+{added}</span> <span className="text-error">−{removed}</span>
            </span>
          )}
          {language && <span className="rounded-xs bg-surface-container px-2 py-0.5 font-mono text-label-sm text-on-surface-variant">{language}</span>}
          {copyable && <CopyButton className="text-on-surface-variant" value={code} onCopied={onCopied} />}
        </div>
      ) : (
        copyable && <CopyButton className="absolute top-1 right-1 text-on-surface-variant" value={code} onCopied={onCopied} />
      )}
      {children ? (
        <pre className="relative overflow-x-auto p-4 font-mono text-body-sm leading-6 text-on-surface">{children}</pre>
      ) : (
        <CodeLines code={code} lineNumbers={lineNumbers ?? !!diff} diff={diff} startLine={startLine} />
      )}
    </div>
  )
}

/* ---------- One-line command ---------- */

export interface CodeCommandProps extends React.HTMLAttributes<HTMLDivElement> {
  command: string
  /** Prompt glyph. */
  prompt?: string
  /** `inverse` (dark terminal) or `tonal`. */
  variant?: "inverse" | "tonal"
  onCopied?: (value: string) => void
}

/** Shell command with a prompt and copy button. */
function CodeCommand({ command, prompt = "$", variant = "tonal", onCopied, className, ...props }: CodeCommandProps) {
  return (
    <div
      data-slot="code-command"
      className={cn(
        "flex h-12 w-full items-center gap-3 rounded-md pr-1 pl-4 font-mono text-body-md",
        variant === "inverse" ? "bg-inverse-surface text-inverse-on-surface" : "bg-surface-container-high text-on-surface",
        className,
      )}
      {...props}
    >
      <span aria-hidden className={variant === "inverse" ? "text-inverse-primary" : "text-primary"}>
        {prompt}
      </span>
      <span className="min-w-0 flex-1 truncate">{command}</span>
      <CopyButton value={command} onCopied={onCopied} className={variant === "tonal" ? "text-on-surface-variant" : undefined} />
    </div>
  )
}

/** Inline code span. */
function InlineCode({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return <code className={cn("rounded-xs bg-surface-container-high px-1.5 py-0.5 font-mono text-body-sm", className)} {...props} />
}

export { CodeBlock, CodeCommand, CopyButton, InlineCode }
