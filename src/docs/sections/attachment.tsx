import * as React from "react"

import {
  AttachmentAddTile,
  AttachmentChip,
  AttachmentItem,
  AttachmentList,
  AttachmentThumbnail,
  FileDropZone,
  useFileUploads,
  type AttachmentThumbnailProps,
} from "@/components/ui/attachment"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { ChatComposer } from "@/components/ui/message-scroller"
import { snackbar } from "@/components/ui/snackbar"
import { Section, Variant, Variants } from "@/docs/section"

const LIMIT = 25 * 1024 * 1024

/** Demo uploader: progress in random steps; files named *fail* fail once. */
function fakeUpload(file: File, onProgress: (pct: number) => void) {
  return new Promise<void>((resolve, reject) => {
    let pct = 0
    const failAt = /fail/i.test(file.name) && !failed.has(file) ? 40 + Math.random() * 30 : Infinity
    const t = setInterval(() => {
      pct = Math.min(100, pct + 6 + Math.random() * 14)
      if (pct >= failAt) {
        clearInterval(t)
        failed.add(file)
        reject(new Error("Upload failed · connection lost"))
        return
      }
      onProgress(pct)
      if (pct >= 100) {
        clearInterval(t)
        resolve()
      }
    }, 220)
  })
}
const failed = new WeakSet<File>()

const MB = 1024 * 1024

function UploadDemo() {
  const uploads = useFileUploads({
    upload: fakeUpload,
    validate: (f) => (f.size > LIMIT ? "exceeds the 25 MB limit" : undefined),
  })
  const [statics, setStatics] = React.useState(["policy", "usage", "png"])
  const [chips, setChips] = React.useState(["runbook.md", "screenshot.png"])
  const drop = (k: string) => setStatics((s) => s.filter((x) => x !== k))

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <FileDropZone onFiles={uploads.add} description="YAML, JSON or CSV · up to 25 MB each" />
      <AttachmentList>
        {statics.includes("policy") && (
          <AttachmentItem
            name="cluster-policy.yaml"
            size={14 * 1024}
            onRemove={() => drop("policy")}
            actions={
              <IconButton aria-label="Download cluster-policy.yaml" onPress={() => snackbar("download · demo action")} className="[--icon-size:20px]">
                <Icon>download</Icon>
              </IconButton>
            }
          />
        )}
        {statics.includes("usage") && (
          <AttachmentItem name="usage-export-oct.csv" size={12.4 * MB} progress={62} status="uploading" onRemove={() => drop("usage")} />
        )}
        {statics.includes("png") && (
          <AttachmentItem
            name="architecture.png"
            size={38 * MB}
            status="error"
            message="exceeds the 25 MB limit"
            onRetry={() => {
              drop("png")
              snackbar("Compressing architecture.png and retrying…")
            }}
          />
        )}
        {uploads.items.map((u) => (
          <AttachmentItem
            key={u.id}
            name={u.name}
            size={u.size}
            progress={u.progress}
            status={u.status}
            message={u.message}
            onRemove={() => uploads.remove(u.id)}
            onRetry={u.status === "failed" ? () => uploads.retry(u.id) : undefined}
          />
        ))}
        {chips.length > 0 && (
          <li className="flex flex-wrap gap-2 pt-1">
            {chips.map((c) => (
              <AttachmentChip key={c} name={c} onRemove={() => setChips((l) => l.filter((x) => x !== c))} />
            ))}
          </li>
        )}
      </AttachmentList>
    </div>
  )
}

const COMPOSER_FILES = [
  { name: "rollout-plan.pdf", size: 1.2 * MB },
  { name: "canary-graph.png", size: 340 * 1024 },
  { name: "trace.json", size: 2.1 * MB, progress: 64 },
]

function ComposerDemo() {
  const [files, setFiles] = React.useState(COMPOSER_FILES)
  return (
    <div className="w-full overflow-hidden rounded-xl bg-surface-container-low">
      <ChatComposer
        className="border-0 p-0"
        placeholder="Message #platform-oncall"
        onAttach={() => setFiles(COMPOSER_FILES)}
        onSend={() => snackbar(`Sent with ${files.length} attachment${files.length === 1 ? "" : "s"}`)}
        attachments={
          files.length
            ? files.map((f) => (
                <AttachmentChip
                  key={f.name}
                  variant="rich"
                  name={f.name}
                  size={f.size}
                  progress={f.progress}
                  className="bg-surface-container-highest"
                  onRemove={() => setFiles((l) => l.filter((x) => x.name !== f.name))}
                />
              ))
            : undefined
        }
      />
    </div>
  )
}

type Thumb = { key: string; tone: NonNullable<AttachmentThumbnailProps["tone"]>; src?: string; progress?: number }

function ThumbnailsDemo() {
  const [thumbs, setThumbs] = React.useState<Thumb[]>([
    { key: "a", tone: "primary" },
    { key: "b", tone: "secondary" },
    { key: "c", tone: "tertiary", progress: 48 },
    { key: "d", tone: "neutral" },
    { key: "e", tone: "secondary" },
  ])
  // Advance any uploading tile.
  React.useEffect(() => {
    if (!thumbs.some((t) => t.progress !== undefined && t.progress < 100)) return
    const t = setTimeout(
      () =>
        setThumbs((list) =>
          list.map((x) => (x.progress !== undefined && x.progress < 100 ? { ...x, progress: Math.min(100, x.progress + 4) } : x)),
        ),
      300,
    )
    return () => clearTimeout(t)
  }, [thumbs])

  return (
    <div className="grid w-full grid-cols-3 gap-2">
      {thumbs.map((t) => (
        <AttachmentThumbnail
          key={t.key}
          src={t.src}
          tone={t.tone}
          progress={t.progress}
          onRemove={() => setThumbs((l) => l.filter((x) => x.key !== t.key))}
        />
      ))}
      <AttachmentAddTile
        label="Add photos"
        acceptedFileTypes={["image/*"]}
        onFiles={(files) =>
          setThumbs((l) => [
            ...l,
            ...files.map((f, i) => ({ key: `${f.name}-${Date.now()}-${i}`, tone: "primary" as const, src: URL.createObjectURL(f), progress: 0 })),
          ])
        }
      />
    </div>
  )
}

function ErrorsDemo() {
  const [retry, setRetry] = React.useState<"failed" | "uploading" | "done">("failed")
  const [progress, setProgress] = React.useState(0)
  React.useEffect(() => {
    if (retry !== "uploading") return
    if (progress >= 100) {
      setRetry("done")
      snackbar("usage-export.csv uploaded")
      return
    }
    const t = setTimeout(() => setProgress((p) => Math.min(100, p + 12)), 180)
    return () => clearTimeout(t)
  }, [retry, progress])

  return (
    <AttachmentList className="w-full">
      <AttachmentItem
        name="cluster-dump.tar.gz"
        size={48 * MB}
        status="error"
        icon="error"
        message="exceeds the 25 MB limit"
        className="bg-surface-container-low"
        onRemove={() => snackbar("Removed cluster-dump.tar.gz")}
      />
      <AttachmentItem
        name="setup.exe"
        status="error"
        icon="block"
        message="File type not allowed"
        className="bg-surface-container-low"
        onRemove={() => snackbar("Removed setup.exe")}
      />
      <AttachmentItem
        name="usage-export.csv"
        size={retry === "failed" ? undefined : 4.2 * MB}
        status={retry}
        progress={progress}
        message={retry === "failed" ? "Upload failed · connection lost" : undefined}
        className="bg-surface-container-low"
        onRetry={() => {
          setProgress(0)
          setRetry("uploading")
        }}
      />
    </AttachmentList>
  )
}

export default function AttachmentSection() {
  return (
    <Section id="attachment" description="Drop zone, file rows with type icon, size and progress, and compact attachment chips for composers.">
      <UploadDemo />
      <p className="-mt-4 text-body-sm text-on-surface-variant">
        Drop or browse real files: they upload with simulated progress, anything over 25 MB is rejected, and names containing
        “fail” fail once so you can retry.
      </p>
      <Variants cols="md:grid-cols-2">
        <Variant n={1} label="Composer chips" className="flex min-h-24 flex-col gap-4 rounded-lg bg-surface p-4">
          <ComposerDemo />
        </Variant>
        <Variant n={2} label="Thumbnails · uploading" className="flex min-h-24 flex-col gap-4 rounded-lg bg-surface p-4">
          <ThumbnailsDemo />
        </Variant>
        <Variant n={3} label="Errors · size, type, network" className="flex min-h-24 flex-col gap-4 rounded-lg bg-surface p-4">
          <ErrorsDemo />
        </Variant>
        <Variant n={4} label="Drop zone · drag-over" className="flex min-h-24 flex-col gap-4 rounded-lg bg-surface p-4">
          <FileDropZone
            isDropTarget
            className="w-full"
            dropLabel="Release to upload 3 files"
            dropDescription="cluster-policy.yaml, usage.csv and 1 more"
          />
        </Variant>
      </Variants>
    </Section>
  )
}
