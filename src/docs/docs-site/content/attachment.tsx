import Chips from "@/docs/docs-site/examples/attachment/chips"
import chipsSrc from "@/docs/docs-site/examples/attachment/chips?raw"
import Demo from "@/docs/docs-site/examples/attachment/demo"
import demoSrc from "@/docs/docs-site/examples/attachment/demo?raw"
import DropTarget from "@/docs/docs-site/examples/attachment/drop-target"
import dropTargetSrc from "@/docs/docs-site/examples/attachment/drop-target?raw"
import States from "@/docs/docs-site/examples/attachment/states"
import statesSrc from "@/docs/docs-site/examples/attachment/states?raw"
import Thumbnails from "@/docs/docs-site/examples/attachment/thumbnails"
import thumbnailsSrc from "@/docs/docs-site/examples/attachment/thumbnails?raw"
import { InlineCode } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  description:
    "Files in and around forms and chat: a drop zone that swells while files hover, file rows with a type tile, size, progress and errors, compact chips for composers, square thumbnails with an upload ring, and a hook that drives a live upload list.",
  links: { aria: "https://react-spectrum.adobe.com/react-aria/DropZone.html" },
  preview: { component: Demo, source: demoSrc },
  usage: `import { AttachmentItem, AttachmentList, FileDropZone, useFileUploads } from "@/components/ui/attachment"

const uploads = useFileUploads({ upload: (file, onProgress) => putToStorage(file, onProgress) })

<FileDropZone onFiles={uploads.add} />
<AttachmentList>
  {uploads.items.map((it) => (
    <AttachmentItem key={it.id} {...it} onRemove={() => uploads.remove(it.id)} onRetry={() => uploads.retry(it.id)} />
  ))}
</AttachmentList>`,
  examples: [
    {
      id: "states",
      title: "Row states",
      description: (
        <>
          <InlineCode>status</InlineCode> is done, uploading (progress bar and “7.8 of 12.4 MB · 63%”), error (rejected before upload, error tint) or failed
          (retryable, with Retry). Pass <InlineCode>actions</InlineCode> for download or preview.
        </>
      ),
      component: States,
      source: statesSrc,
    },
    {
      id: "chips",
      title: "Chips",
      description: (
        <>
          Compact 32dp chips for composers, or <InlineCode>variant="rich"</InlineCode> with a type tile and a size line. Rich chips show an upload ring while{" "}
          <InlineCode>progress</InlineCode> is under 100.
        </>
      ),
      component: Chips,
      source: chipsSrc,
    },
    {
      id: "thumbnails",
      title: "Thumbnails",
      description: "Square tiles for images, with a scrim upload ring and a remove button. AttachmentAddTile opens the file dialog and matches their shape.",
      component: Thumbnails,
      source: thumbnailsSrc,
    },
    {
      id: "drop-target",
      title: "File types and drag-over",
      description: (
        <>
          <InlineCode>acceptedFileTypes</InlineCode> filters the file dialog. While files hover, the zone fills with primary-container, rounds to 28dp and shows{" "}
          <InlineCode>dropLabel</InlineCode>; <InlineCode>isDropTarget</InlineCode> forces that look for previews.
        </>
      ),
      component: DropTarget,
      source: dropTargetSrc,
    },
  ],
  api: [
    {
      name: "FileDropZone",
      description: <>React Aria {c("DropZone")} props (except onDrop), plus:</>,
      props: [
        { name: "onFiles", type: "(files: File[]) => void", default: "—", description: "Files picked from the dialog or dropped." },
        { name: "acceptedFileTypes", type: "string[]", default: "—", description: 'MIME types or extensions for the file dialog, e.g. [".yaml", "image/*"].' },
        { name: "allowsMultiple", type: "boolean", default: "true", description: "Allow picking several files." },
        { name: "title · description", type: "ReactNode", default: "“Drop files or browse”", description: "Resting text." },
        { name: "icon", type: "string", default: '"upload"', description: "Icon in the 48dp circle." },
        { name: "dropLabel · dropDescription", type: "ReactNode", default: '"Release to upload"', description: "Text while files hover." },
        { name: "isDropTarget", type: "boolean", default: "—", description: "Force the drag-over look." },
      ],
    },
    {
      name: "AttachmentItem",
      description: <>A file row ({c("<li>")}); put it in an AttachmentList.</>,
      props: [
        { name: "name", type: "string", default: "—", description: "File name; also picks the type icon and tone." },
        { name: "size", type: "number | string", default: "—", description: "Bytes (formatted) or a preformatted string." },
        { name: "status", type: '"done" | "uploading" | "error" | "failed"', default: '"done"', description: "Row state." },
        { name: "progress", type: "number", default: "0", description: "0–100 while uploading." },
        { name: "loaded", type: "number", default: "derived", description: "Uploaded bytes for “7.8 of 12.4 MB”; derived from progress when omitted." },
        { name: "message", type: "ReactNode", default: "—", description: "Status or error line, e.g. “Exceeds the 25 MB limit”." },
        { name: "icon · tone", type: "string · Tone", default: "by file type", description: "Override the type tile." },
        { name: "onRemove · onRetry", type: "() => void", default: "—", description: "Remove button; Retry shows for error and failed rows." },
        { name: "actions", type: "ReactNode", default: "—", description: "Extra trailing actions." },
      ],
    },
    {
      name: "AttachmentChip · AttachmentThumbnail · AttachmentAddTile",
      props: [
        { name: "AttachmentChip", type: "{ name, size?, variant?, progress?, icon?, tone?, onRemove? }", default: 'variant "compact"', description: "compact: 32dp outlined. rich: 44dp with a type tile and size or progress." },
        { name: "AttachmentThumbnail", type: "{ src?, alt?, icon?, tone?, progress?, onRemove? }", default: 'icon "image"', description: "Square image tile; progress under 100 dims it and shows a ring." },
        { name: "AttachmentAddTile", type: "{ label?, icon?, acceptedFileTypes?, onFiles? }", default: 'label "Add files"', description: "Dashed tile that opens the file dialog." },
        { name: "AttachmentList", type: "HTMLAttributes<HTMLUListElement>", default: "—", description: "List labelled “Attachments”." },
      ],
    },
    {
      name: "useFileUploads(options)",
      description: <>Upload list state. Returns {c("{ items, add, remove, retry, clear }")}; each item is {c("{ id, file, name, size, progress, status, message? }")}.</>,
      props: [
        { name: "upload", type: "(file, onProgress) => Promise<void>", default: "—", description: "Upload one file, reporting 0–100. Reject to mark it failed (retryable). Without it, files complete immediately." },
        { name: "validate", type: "(file) => string | undefined", default: "—", description: "Return a message to reject a file before uploading (size, type)." },
      ],
    },
    {
      name: "Helpers",
      props: [
        { name: "fileKind", type: "(nameOrType) => { icon, tone }", default: "—", description: "Type icon and tone for a file name or MIME type." },
        { name: "formatBytes", type: "(bytes) => string", default: "—", description: "“482 KB”, “12.4 MB”." },
        { name: "FileTile", type: "{ name?, icon?, tone?, size? }", default: 'size "md"', description: "The 40dp (or 32dp) type tile on its own." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        The drop zone is a React Aria DropZone with a full-size “Browse files” button inside, so keyboard and screen-reader users pick files through the native
        dialog; drops are announced. Upload progress bars are labelled “Uploading name”, and remove buttons “Remove name” on rows and chips.
      </>
    ),
    keyboard: [
      { keys: ["Tab"], description: "Focuses the drop zone's browse button, then each row's actions." },
      { keys: ["Space", "Enter"], description: "Opens the file dialog, or activates Retry and Remove." },
    ],
    notes: [<>Thumbnail remove buttons are labelled just “Remove”. With several thumbnails, give each tile an accessible name in context (e.g. a list with captions).</>],
  },
  spec: {
    tables: [
      {
        columns: ["Part", "Value"],
        rows: [
          ["Drop zone", "min 192dp, 2dp dashed outline-variant, 16dp corners; drag-over primary-container 50%, primary outline, 28dp corners"],
          ["Type tile", "40dp (32dp small), 8dp corners, tonal container by type"],
          ["Row", "surface, 12dp corners, 12dp padding; error rows error-container 40%"],
          ["Chip · compact", "32dp, 8dp corners, 1dp outline-variant, label-large"],
          ["Chip · rich", "44dp, 12dp corners, surface-container-high"],
          ["Thumbnail", "square, 12dp corners, 44dp upload ring on a scrim"],
        ],
      },
    ],
    cards: [{ title: "Motion", items: [<>Drag-over swell: {c("default-effects")} 1.0 / 1600 (223ms)</>, <>Icon circle morph on hover: {c("fast-spatial")}</>] }],
    source: <>From the kit's attachment article, on the M3 shape scale.</>,
  },
} satisfies ComponentDoc
