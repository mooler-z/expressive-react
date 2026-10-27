import * as React from "react"
import { ToggleButton, ToggleButtonGroup } from "react-aria-components"
import { Link } from "react-router"

import { Icon } from "@/components/ui/icon"
import { snackbar } from "@/components/ui/snackbar"
import { cn } from "@/lib/utils"

/* Building blocks for the docs pages, styled after design-reference/site/Docs.dc.html. */

export async function copyText(text: string, label = "to clipboard") {
  try {
    await navigator.clipboard.writeText(text)
    snackbar(`Copied ${label}`)
  } catch {
    snackbar("Couldn't copy: clipboard unavailable")
  }
}

export function CopyIconButton({ text, label, className, size = "md" }: { text: string; label: string; className?: string; size?: "sm" | "md" }) {
  return (
    <button
      type="button"
      onClick={() => copyText(text, label)}
      aria-label={`Copy ${label}`}
      title={`Copy ${label}`}
      className={cn(
        "state-layer focus-ring inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full",
        size === "md" ? "size-10" : "size-9",
        className,
      )}
    >
      <Icon name="content_copy" size={20} />
    </button>
  )
}

export function InlineCode({ children, className }: { children: React.ReactNode; className?: string }) {
  return <code className={cn("rounded-xs bg-surface-container-high px-1.5 py-0.5 font-mono text-[0.875em]", className)}>{children}</code>
}

export function TextLink({ to, children }: { to: string; children: React.ReactNode }) {
  const cls = "text-primary underline underline-offset-3 hover:text-on-primary-container"
  return /^https?:/.test(to) ? (
    <a href={to} target="_blank" rel="noreferrer" className={cls}>
      {children}
    </a>
  ) : (
    <Link to={to} className={cls}>
      {children}
    </Link>
  )
}

/** Source panel: surface-container-lowest with a hairline ring, optional filename header. */
export function CodePanel({
  code,
  filename,
  icon = "code",
  copyLabel,
  className,
  preClassName,
}: {
  code: string
  filename?: string
  icon?: string
  copyLabel?: string
  className?: string
  preClassName?: string
}) {
  return (
    <div className={cn("group/code relative min-w-0 overflow-hidden rounded-lg bg-surface-container-lowest ring-1 ring-outline-variant", className)}>
      {filename ? (
        <div className="flex h-11 items-center gap-2 border-b border-outline-variant pr-2 pl-4 text-on-surface-variant">
          <Icon name={icon} size={18} />
          <span className="min-w-0 flex-1 truncate font-mono text-body-sm">{filename}</span>
          <CopyIconButton text={code} label={copyLabel ?? filename} size="sm" />
        </div>
      ) : (
        <CopyIconButton
          text={code}
          label={copyLabel ?? "code"}
          size="sm"
          className="absolute top-2 right-2 bg-surface-container-lowest text-on-surface-variant opacity-0 group-focus-within/code:opacity-100 group-hover/code:opacity-100"
        />
      )}
      <pre className={cn("overflow-auto p-5 font-mono text-body-sm leading-6 text-on-surface", preClassName)}>
        <code>{code}</code>
      </pre>
    </div>
  )
}

/** Inverse-surface terminal. `commands` get a `$` prompt; `output` lines get a ✔. */
export function Terminal({
  commands,
  output,
  header = true,
  className,
}: {
  commands: string[]
  output?: string[]
  header?: boolean
  className?: string
}) {
  const text = commands.join("\n")
  return (
    <div className={cn("relative overflow-hidden rounded-lg bg-inverse-surface text-inverse-on-surface", className)}>
      {header && (
        <div className="flex h-11 items-center gap-2 pr-2 pl-4 text-inverse-on-surface/70">
          <Icon name="terminal" size={18} />
          <span className="flex-1 font-mono text-body-sm">Terminal</span>
          <CopyIconButton text={text} label={commands.length > 1 ? "commands" : "command"} size="sm" />
        </div>
      )}
      <pre className={cn("overflow-x-auto px-4 font-mono text-body-sm leading-6", header ? "pb-4" : "py-4")}>
        <code>
          {commands.map((c, i) => (
            <React.Fragment key={i}>
              {i > 0 && "\n"}
              <span className="text-inverse-primary select-none">$ </span>
              {c}
            </React.Fragment>
          ))}
          {output?.map((o, i) => (
            <React.Fragment key={`o${i}`}>
              {"\n"}
              <span className="text-inverse-primary select-none">✔ </span>
              {o}
            </React.Fragment>
          ))}
        </code>
      </pre>
    </div>
  )
}

/** Pill segmented control (Preview / Code, CLI / Manual). Selected segment lifts to surface + elevation 1. */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
  size = "md",
  className,
}: {
  value: T
  onChange: (v: T) => void
  options: { id: T; label: string }[]
  label: string
  size?: "sm" | "md"
  className?: string
}) {
  return (
    <ToggleButtonGroup
      aria-label={label}
      selectionMode="single"
      disallowEmptySelection
      selectedKeys={[value]}
      onSelectionChange={(keys) => {
        const next = [...keys][0]
        if (next != null) onChange(next as T)
      }}
      className={cn("inline-flex rounded-full bg-surface-container-high p-1 text-label-lg", className)}
    >
      {options.map((o) => (
        <ToggleButton
          key={o.id}
          id={o.id}
          className={cn(
            "state-layer focus-ring flex-1 cursor-pointer rounded-full whitespace-nowrap text-on-surface-variant",
            "transition-[background-color,color,box-shadow] duration-300 ease-emphasized",
            "data-selected:bg-surface data-selected:text-on-surface data-selected:shadow-1",
            size === "md" ? "h-9 px-4" : "h-8 px-4",
          )}
        >
          {o.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  )
}

export function KeyCap({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded-xs border border-outline-variant bg-surface-container-lowest px-1.5 font-mono text-label-md shadow-[0_1px_0_var(--md-outline-variant)]">
      {children}
    </kbd>
  )
}

/** Bordered docs table (props, keyboard, spec values). */
export function DocTable({
  columns,
  rows,
  minWidth,
  className,
  cellClassName,
}: {
  columns: React.ReactNode[]
  rows: React.ReactNode[][]
  minWidth?: number
  className?: string
  /** Per-column extra classes. */
  cellClassName?: (string | undefined)[]
}) {
  return (
    <div className={cn("relative overflow-x-auto rounded-lg border border-outline-variant", className)}>
      <table className="w-full text-left text-body-md" style={minWidth ? { minWidth } : undefined}>
        <thead className="bg-surface-container-low text-label-lg text-on-surface-variant">
          <tr>
            {columns.map((c, i) => (
              <th key={i} className="px-4 py-3 font-medium">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant">
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((cell, j) => (
                <td key={j} className={cn("px-4 py-3 align-top", cellClassName?.[j])}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Numbered steps (Installation guide, Manual install). */
export function Steps({ children, size = "lg" }: { children: React.ReactNode; size?: "md" | "lg" }) {
  return (
    <ol className={cn(size === "lg" ? "space-y-8" : "space-y-4")} data-steps-size={size}>
      {React.Children.toArray(children).map((child, i) =>
        React.isValidElement<StepProps>(child) ? React.cloneElement(child, { n: i + 1, size }) : child,
      )}
    </ol>
  )
}

interface StepProps {
  title?: React.ReactNode
  children?: React.ReactNode
  n?: number
  size?: "md" | "lg"
}

export function Step({ title, children, n, size = "lg" }: StepProps) {
  return (
    <li className={cn("flex", size === "lg" ? "gap-4" : "gap-3")}>
      <span
        className={cn(
          "grid shrink-0 place-items-center rounded-full",
          size === "lg" ? "size-8 bg-primary text-label-lg text-on-primary" : "size-6 bg-secondary-container text-label-md text-on-secondary-container",
        )}
      >
        {n}
      </span>
      <div className={cn("min-w-0 flex-1", size === "md" && "text-body-md text-on-surface-variant")}>
        {title && <h2 className="text-title-lg text-on-surface">{title}</h2>}
        {children}
      </div>
    </li>
  )
}

export function Callout({ icon = "lightbulb", title, children, tone = "primary" }: { icon?: string; title: React.ReactNode; children: React.ReactNode; tone?: "primary" | "tertiary" }) {
  return (
    <div className={cn("rounded-xl p-6", tone === "primary" ? "bg-primary-container text-on-primary-container" : "bg-tertiary-container text-on-tertiary-container")}>
      <div className="flex items-start gap-3">
        <Icon name={icon} />
        <div className="min-w-0">
          <div className="text-title-md">{title}</div>
          <div className="mt-1 text-body-md">{children}</div>
        </div>
      </div>
    </div>
  )
}

export function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-24 text-headline-sm font-semibold">
      {children}
    </h2>
  )
}

export function Pager({ prev, next }: { prev?: { to: string; label: string }; next?: { to: string; label: string } }) {
  return (
    <nav className="mt-14 flex flex-wrap justify-between gap-3 border-t border-outline-variant pt-6" aria-label="Pager">
      {prev ? (
        <Link
          to={prev.to}
          className="state-layer focus-ring inline-flex h-12 items-center gap-2 rounded-full border border-outline-variant pr-5 pl-3 text-label-lg text-on-surface-variant"
        >
          <Icon name="arrow_back" size={20} />
          {prev.label}
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link
          to={next.to}
          className="state-layer focus-ring inline-flex h-12 items-center gap-2 rounded-full bg-secondary-container pr-3 pl-5 text-label-lg text-on-secondary-container"
        >
          {next.label}
          <Icon name="arrow_forward" size={20} />
        </Link>
      )}
    </nav>
  )
}

/** Header chip under a page title: external link (M3 spec, React Aria) or a copy action. */
export function HeaderChip({ href, icon, children, onPress, tonal }: { href?: string; icon: string; children: React.ReactNode; onPress?: () => void; tonal?: boolean }) {
  const cls = cn(
    "state-layer focus-ring inline-flex h-8 cursor-pointer items-center gap-2 rounded-sm pr-3 pl-2 text-label-lg",
    tonal ? "bg-secondary-container font-mono text-on-secondary-container" : "border border-outline-variant text-on-surface-variant",
  )
  if (href)
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cls}>
        <Icon name={icon} size={18} />
        {children}
        <Icon name="open_in_new" size={18} />
      </a>
    )
  return (
    <button type="button" className={cls} onClick={onPress}>
      <Icon name={icon} size={18} />
      {children}
    </button>
  )
}
