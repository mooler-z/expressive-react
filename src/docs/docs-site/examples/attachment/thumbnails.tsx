import { useState } from "react"

import { AttachmentAddTile, AttachmentThumbnail } from "@/components/ui/attachment"
import { snackbar } from "@/components/ui/snackbar"

export default function AttachmentThumbnails() {
  const [tiles, setTiles] = useState([
    { id: "a", tone: "primary" as const, icon: "landscape" },
    { id: "b", tone: "tertiary" as const, icon: "photo_camera", progress: 68 },
    { id: "c", tone: "secondary" as const, icon: "image" },
  ])

  return (
    <div className="grid w-full max-w-sm grid-cols-4 gap-2">
      {tiles.map((t) => (
        <AttachmentThumbnail key={t.id} icon={t.icon} tone={t.tone} progress={t.progress} onRemove={() => setTiles((list) => list.filter((x) => x.id !== t.id))} />
      ))}
      <AttachmentAddTile label="Add photos" acceptedFileTypes={["image/*"]} onFiles={(files) => snackbar(`${files.length} photo(s) selected`)} />
    </div>
  )
}
