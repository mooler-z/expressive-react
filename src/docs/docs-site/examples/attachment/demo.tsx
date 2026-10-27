import { AttachmentItem, AttachmentList, FileDropZone, useFileUploads } from "@/components/ui/attachment"

const MAX = 25 * 1024 * 1024

// Simulated upload: reports progress, fails ~1 in 5 so you can try Retry
const fakeUpload = (_file: File, onProgress: (pct: number) => void) =>
  new Promise<void>((resolve, reject) => {
    let pct = 0
    const fail = Math.random() < 0.2
    const t = setInterval(() => {
      pct += 8 + Math.random() * 12
      if (fail && pct > 55) {
        clearInterval(t)
        reject(new Error("Network error"))
      } else if (pct >= 100) {
        clearInterval(t)
        onProgress(100)
        resolve()
      } else onProgress(Math.round(pct))
    }, 200)
  })

export default function AttachmentDemo() {
  const uploads = useFileUploads({
    upload: fakeUpload,
    validate: (file) => (file.size > MAX ? "Exceeds the 25 MB limit" : undefined),
  })

  return (
    <div className="flex w-full max-w-lg flex-col gap-4">
      <FileDropZone onFiles={uploads.add} description="Any file type · up to 25 MB each" />
      {uploads.items.length > 0 && (
        <AttachmentList>
          {uploads.items.map((it) => (
            <AttachmentItem
              key={it.id}
              name={it.name}
              size={it.size}
              progress={it.progress}
              status={it.status}
              message={it.message}
              onRemove={() => uploads.remove(it.id)}
              onRetry={() => uploads.retry(it.id)}
            />
          ))}
        </AttachmentList>
      )}
    </div>
  )
}
