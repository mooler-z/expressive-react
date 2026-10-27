"use client"

import * as React from "react"
import {
  Button as AriaButton,
  DropZone as AriaDropZone,
  FileTrigger,
  composeRenderProps,
  type DropItem,
  type DropZoneProps as AriaDropZoneProps,
} from "react-aria-components"

import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { CircularProgress, LinearProgress } from "@/components/ui/progress"
import { Ripple } from "@/components/ui/ripple"
import { cn } from "@/lib/utils"

/*
 * Attachment
 * Drop zone · file rows with a type tile, size and progress · compact chips for composers ·
 * square thumbnails with an upload ring. `useFileUploads` drives a live upload list.
 */

/* ---------- File helpers ---------- */

type Tone = "primary" | "secondary" | "tertiary" | "error" | "neutral"

const TILE: Record<Tone, string> = {
  primary: "bg-primary-container text-on-primary-container",
  secondary: "bg-secondary-container text-on-secondary-container",
  tertiary: "bg-tertiary-container text-on-tertiary-container",
  error: "bg-error-container text-on-error-container",
  neutral: "bg-surface-container-highest text-on-surface-variant",
}

const KINDS: [RegExp, string, Tone][] = [
  [/\.pdf$|application\/pdf/i, "picture_as_pdf", "error"],
  [/\.(png|jpe?g|gif|webp|avif|svg|heic)$|^image\//i, "image", "tertiary"],
  [/\.(csv|tsv|xlsx?|numbers)$|spreadsheet|text\/csv/i, "table", "tertiary"],
  [/\.(json|ya?ml|xml|toml|ini)$|json|yaml|xml/i, "data_object", "secondary"],
  [/\.(zip|tar|gz|tgz|rar|7z)$|zip|compressed/i, "folder_zip", "secondary"],
  [/\.(mp3|wav|m4a|ogg|flac)$|^audio\//i, "audio_file", "primary"],
  [/\.(mp4|mov|webm|mkv)$|^video\//i, "video_file", "primary"],
  [/\.(md|txt|docx?|rtf|pages)$|^text\//i, "description", "primary"],
]

/** Material Symbol and container tone for a file name or MIME type. */
export function fileKind(nameOrType: string): { icon: string; tone: Tone } {
  for (const [re, icon, tone] of KINDS) if (re.test(nameOrType)) return { icon, tone }
  return { icon: "draft", tone: "secondary" }
}

/** 14336 → "14 KB" */
export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${Math.round(bytes)} B`
  const units = ["KB", "MB", "GB", "TB"]
  let v = bytes / 1024
  let i = 0
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024
    i++
  }
  // KB whole; MB and up keep one decimal below 100 ("12.4 MB", "38 MB")
  return `${i === 0 || v >= 100 ? Math.round(v) : v.toFixed(1).replace(/\.0$/, "")} ${units[i]}`
}

/* ---------- Tile ---------- */

function FileTile({
  name,
  icon,
  tone,
  size = "md",
  className,
}: {
  name?: string
  icon?: string
  tone?: Tone
  size?: "sm" | "md"
  className?: string
}) {
  const kind = fileKind(name ?? "")
  return (
    <span
      aria-hidden
      className={cn(
        "grid shrink-0 place-items-center",
        size === "md" ? "size-10 rounded-sm [--icon-size:24px]" : "size-8 rounded-sm [--icon-size:18px]",
        TILE[tone ?? kind.tone],
        className,
      )}
    >
      <Icon>{icon ?? kind.icon}</Icon>
    </span>
  )
}

/* ---------- Drop zone ---------- */

export interface FileDropZoneProps extends Omit<AriaDropZoneProps, "className" | "children" | "onDrop"> {
  /** Files picked from the dialog or dropped. */
  onFiles?: (files: File[]) => void
  /** MIME types / extensions for the file dialog, e.g. [".yaml", ".json", "text/csv"]. */
  acceptedFileTypes?: string[]
  allowsMultiple?: boolean
  title?: React.ReactNode
  description?: React.ReactNode
  icon?: string
  /** Text while files hover over the zone. */
  dropLabel?: React.ReactNode
  dropDescription?: React.ReactNode
  /** Force the drag-over look (previews, docs). */
  isDropTarget?: boolean
  className?: string
}

async function filesFromDrop(items: DropItem[]) {
  const files: File[] = []
  for (const item of items) if (item.kind === "file") files.push(await item.getFile())
  return files
}

/** Dashed zone: click to browse, or drop files. Swells to primary-container while files hover over it. */
function FileDropZone({
  onFiles,
  acceptedFileTypes,
  allowsMultiple = true,
  title = (
    <>
      Drop files or <span className="text-primary">browse</span>
    </>
  ),
  description,
  icon = "upload",
  dropLabel = "Release to upload",
  dropDescription,
  isDropTarget: forced,
  className,
  ...props
}: FileDropZoneProps) {
  return (
    <AriaDropZone
      data-slot="file-drop-zone"
      {...props}
      onDrop={async (e) => onFiles?.(await filesFromDrop(e.items))}
      className={({ isDropTarget, isFocusVisible }) =>
        cn(
          "group/drop relative flex min-h-48 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center",
          "transition-[background-color,border-color,border-radius] duration-(--md-spring-default-effects-duration) ease-default-effects",
          isDropTarget || forced
            ? "rounded-xl border-primary bg-primary-container/50 text-on-primary-container"
            : "border-outline-variant bg-surface text-on-surface hover:border-primary hover:bg-primary/5",
          isFocusVisible && "outline-3 outline-offset-2 outline-secondary",
          className,
        )
      }
    >
      {({ isDropTarget }) =>
        isDropTarget || forced ? (
          <>
            <span className="grid size-14 animate-bounce place-items-center rounded-full bg-primary text-on-primary shadow-3 [--icon-size:28px] motion-reduce:animate-none">
              <Icon>file_download</Icon>
            </span>
            <div className="mt-1 text-title-md">{dropLabel}</div>
            {dropDescription && <div className="text-body-sm opacity-80">{dropDescription}</div>}
          </>
        ) : (
          <FileTrigger
            acceptedFileTypes={acceptedFileTypes}
            allowsMultiple={allowsMultiple}
            onSelect={(list) => list && onFiles?.(Array.from(list))}
          >
            <AriaButton className="focus-ring absolute inset-0 cursor-pointer rounded-[inherit] outline-offset-2">
              <span className="sr-only">Browse files</span>
            </AriaButton>
            <span className="pointer-events-none grid size-12 place-items-center rounded-full bg-primary-container text-on-primary-container transition-[border-radius] duration-(--md-spring-fast-spatial-duration) ease-fast-spatial group-hover/drop:rounded-[16px]">
              <Icon>{icon}</Icon>
            </span>
            <span className="pointer-events-none text-title-sm">{title}</span>
            {description && <span className="pointer-events-none text-body-sm text-on-surface-variant">{description}</span>}
          </FileTrigger>
        )
      }
    </AriaDropZone>
  )
}

/* ---------- Rows ---------- */

export type AttachmentStatus = "done" | "uploading" | "error" | "failed"

export interface AttachmentItemProps extends Omit<React.LiHTMLAttributes<HTMLLIElement>, "onError"> {
  name: string
  /** Bytes, or a preformatted string. */
  size?: number | string
  /** Uploaded bytes (for "7.8 of 12.4 MB"). Derived from `progress` when omitted. */
  loaded?: number
  /** 0–100 while uploading. */
  progress?: number
  /** done · uploading · error (rejected: size/type) · failed (network, retryable) */
  status?: AttachmentStatus
  /** Error / status line, e.g. "exceeds the 25 MB limit". */
  message?: React.ReactNode
  /** Override the type tile. */
  icon?: string
  tone?: Tone
  onRemove?: () => void
  onRetry?: () => void
  /** Extra trailing actions (download, preview…). */
  actions?: React.ReactNode
}

const fmtSize = (s?: number | string) => (s === undefined ? undefined : typeof s === "number" ? formatBytes(s) : s)

/** File row: tile · name · size, progress or error · actions. */
function AttachmentItem({
  name,
  size,
  loaded,
  progress = 0,
  status = "done",
  message,
  icon,
  tone,
  onRemove,
  onRetry,
  actions,
  className,
  ...props
}: AttachmentItemProps) {
  const sizeText = fmtSize(size)
  const isError = status === "error"
  const tileIcon = icon ?? (isError ? undefined : status === "failed" ? "cloud_off" : undefined)
  const tileTone = tone ?? (isError ? "error" : status === "failed" ? "neutral" : undefined)
  const loadedText =
    loaded !== undefined
      ? formatBytes(loaded)
      : typeof size === "number"
        ? formatBytes((size * progress) / 100)
        : undefined

  return (
    <li
      data-slot="attachment"
      data-status={status}
      className={cn("flex items-center gap-3 rounded-md bg-surface p-3", isError && "bg-error-container/40", className)}
      {...props}
    >
      <FileTile name={name} icon={tileIcon} tone={tileTone} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-body-md text-on-surface">{name}</div>
        {status === "uploading" ? (
          <>
            <LinearProgress value={progress} aria-label={`Uploading ${name}`} className="mt-1.5" />
            <div className="mt-1 text-body-sm text-on-surface-variant tabular-nums">
              {loadedText && sizeText ? `${loadedText} of ${sizeText} · ` : ""}
              {Math.round(progress)}%
            </div>
          </>
        ) : (
          <div className={cn("text-body-sm", isError ? "text-error" : "text-on-surface-variant")}>
            {[sizeText, message ?? (status === "done" ? "uploaded" : status === "failed" ? "Upload failed" : undefined)]
              .filter(Boolean)
              .join(" · ")}
          </div>
        )}
      </div>
      {actions}
      {onRetry && (status === "failed" || status === "error") && (
        <AriaButton
          onPress={onRetry}
          className="state-layer focus-ring relative inline-flex h-9 shrink-0 cursor-pointer items-center gap-1 rounded-full px-3 text-label-lg text-primary [--icon-size:18px]"
        >
          <Icon>replay</Icon>
          Retry
          <Ripple />
        </AriaButton>
      )}
      {onRemove && (
        <IconButton aria-label={`Remove ${name}`} onPress={onRemove} className="[--icon-size:20px]">
          <Icon>close</Icon>
        </IconButton>
      )}
    </li>
  )
}

function AttachmentList({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) {
  return <ul data-slot="attachment-list" aria-label="Attachments" className={cn("space-y-2", className)} {...props} />
}

/* ---------- Chips ---------- */

export interface AttachmentChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string
  size?: number | string
  /** compact: 32dp outlined chip · rich: 44dp chip with a type tile and a size / progress line */
  variant?: "compact" | "rich"
  /** 0–100: shows an upload ring (rich) and "Uploading · n%". */
  progress?: number
  icon?: string
  tone?: Tone
  onRemove?: () => void
}

/** Attachment chip for composers and forms. */
function AttachmentChip({ name, size, variant = "compact", progress, icon, tone, onRemove, className, ...props }: AttachmentChipProps) {
  const kind = fileKind(name)
  const remove = onRemove && (
    <AriaButton
      aria-label={`Remove ${name}`}
      onPress={onRemove}
      className={cn(
        "state-layer focus-ring relative grid shrink-0 cursor-pointer place-items-center rounded-full text-on-surface-variant [--icon-size:18px]",
        variant === "rich" ? "size-8" : "size-6",
      )}
    >
      <Icon>close</Icon>
      <Ripple />
    </AriaButton>
  )

  if (variant === "compact")
    return (
      <span
        data-slot="attachment-chip"
        className={cn(
          "inline-flex h-8 max-w-full items-center gap-2 rounded-sm border border-outline-variant ps-2 text-label-lg text-on-surface-variant [--icon-size:18px]",
          onRemove ? "pe-1" : "pe-3",
          className,
        )}
        {...props}
      >
        <Icon className="text-primary">{icon ?? kind.icon}</Icon>
        <span className="min-w-0 truncate">{name}</span>
        {remove}
      </span>
    )

  const uploading = progress !== undefined && progress < 100
  return (
    <span
      data-slot="attachment-chip"
      className={cn(
        "inline-flex h-11 max-w-full items-center gap-2 rounded-md bg-surface-container-high ps-1.5 text-label-lg text-on-surface",
        onRemove ? "pe-1" : "pe-3",
        className,
      )}
      {...props}
    >
      {uploading ? (
        <span className={cn("grid size-8 shrink-0 place-items-center rounded-sm", TILE[tone ?? "primary"])}>
          <CircularProgress value={progress} size={20} thickness={3} aria-label={`Uploading ${name}`} />
        </span>
      ) : (
        <FileTile name={name} icon={icon} tone={tone} size="sm" />
      )}
      <span className="min-w-0">
        <span className="block truncate">{name}</span>
        <span className="block text-label-sm font-normal text-on-surface-variant tabular-nums">
          {uploading ? `Uploading · ${Math.round(progress)}%` : fmtSize(size)}
        </span>
      </span>
      {remove}
    </span>
  )
}

/* ---------- Thumbnails ---------- */

export interface AttachmentThumbnailProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  /** Placeholder glyph when there's no image. */
  icon?: string
  tone?: Tone
  /** 0–100: dims the tile and shows an upload ring with the percentage. */
  progress?: number
  onRemove?: () => void
}

/** Square media tile with an optional upload ring and remove button. */
function AttachmentThumbnail({ src, alt = "", icon = "image", tone = "primary", progress, onRemove, className, ...props }: AttachmentThumbnailProps) {
  const uploading = progress !== undefined && progress < 100
  return (
    <div
      data-slot="attachment-thumbnail"
      className={cn("relative grid aspect-square place-items-center overflow-hidden rounded-md [--icon-size:28px]", TILE[tone], className)}
      {...props}
    >
      {src ? <img src={src} alt={alt} className="absolute inset-0 size-full object-cover" /> : <Icon>{icon}</Icon>}
      {uploading && (
        <div className="absolute inset-0 grid place-items-center bg-scrim/50 text-white">
          <CircularProgress value={progress} size={44} tone="inverse" aria-label="Uploading">
            <span className="text-label-sm tabular-nums">{Math.round(progress)}%</span>
          </CircularProgress>
        </div>
      )}
      {onRemove && (
        <AriaButton
          aria-label="Remove"
          onPress={onRemove}
          className="focus-ring absolute end-1 top-1 grid size-6 cursor-pointer place-items-center rounded-full bg-scrim/60 text-white [--icon-size:16px] data-hovered:bg-scrim/80"
        >
          <Icon>close</Icon>
        </AriaButton>
      )}
    </div>
  )
}

/** Dashed "add more" tile matching AttachmentThumbnail. */
function AttachmentAddTile({
  className,
  children,
  label = "Add files",
  icon = "add_photo_alternate",
  acceptedFileTypes,
  onFiles,
}: {
  className?: string
  children?: React.ReactNode
  label?: string
  icon?: string
  acceptedFileTypes?: string[]
  onFiles?: (files: File[]) => void
}) {
  return (
    <FileTrigger allowsMultiple acceptedFileTypes={acceptedFileTypes} onSelect={(l) => l && onFiles?.(Array.from(l))}>
      <AriaButton
        aria-label={label}
        className={composeRenderProps(className, (className) =>
          cn(
            "state-layer focus-ring relative grid aspect-square cursor-pointer place-items-center rounded-md border-2 border-dashed border-outline-variant text-on-surface-variant [--icon-size:28px]",
            className,
          ),
        )}
      >
        {children ?? <Icon>{icon}</Icon>}
        <Ripple />
      </AriaButton>
    </FileTrigger>
  )
}

/* ---------- Upload state ---------- */

export interface UploadItem {
  id: string
  file: File
  name: string
  size: number
  progress: number
  status: AttachmentStatus
  message?: string
}

export interface UseFileUploadsOptions {
  /** Upload one file, reporting 0–100. Reject to mark it failed (retryable). */
  upload?: (file: File, onProgress: (pct: number) => void) => Promise<void>
  /** Return a message to reject a file before uploading (size, type). */
  validate?: (file: File) => string | undefined
}

let seq = 0

/** Upload list state: add files, track progress, retry, remove. Pair with AttachmentItem rows. */
function useFileUploads({ upload, validate }: UseFileUploadsOptions = {}) {
  const [items, setItems] = React.useState<UploadItem[]>([])
  const patch = React.useCallback((id: string, p: Partial<UploadItem>) => {
    setItems((list) => list.map((it) => (it.id === id ? { ...it, ...p } : it)))
  }, [])

  const start = React.useCallback(
    (item: UploadItem) => {
      if (!upload) return patch(item.id, { status: "done", progress: 100 })
      patch(item.id, { status: "uploading", progress: 0, message: undefined })
      upload(item.file, (pct) => patch(item.id, { progress: pct })).then(
        () => patch(item.id, { status: "done", progress: 100 }),
        (err: unknown) => patch(item.id, { status: "failed", message: err instanceof Error ? err.message : "Upload failed" }),
      )
    },
    [upload, patch],
  )

  const add = React.useCallback(
    (files: File[]) => {
      const next = files.map<UploadItem>((file) => {
        const message = validate?.(file)
        return {
          id: `upload-${++seq}`,
          file,
          name: file.name,
          size: file.size,
          progress: 0,
          status: message ? "error" : "uploading",
          message,
        }
      })
      setItems((list) => [...list, ...next])
      next.filter((it) => it.status !== "error").forEach(start)
    },
    [validate, start],
  )

  const remove = React.useCallback((id: string) => setItems((list) => list.filter((it) => it.id !== id)), [])
  const retry = React.useCallback(
    (id: string) => {
      const it = items.find((x) => x.id === id)
      if (it) start(it)
    },
    [items, start],
  )
  const clear = React.useCallback(() => setItems([]), [])

  return { items, add, remove, retry, clear }
}

export {
  AttachmentAddTile,
  AttachmentChip,
  AttachmentItem,
  AttachmentList,
  AttachmentThumbnail,
  FileDropZone,
  FileTile,
  useFileUploads,
}
