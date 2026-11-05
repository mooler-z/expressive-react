import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { ImageViewer } from "@/components/ui/image-viewer"

const album = [
  { id: 1043, alt: "Granite cliffs above a pine forest and river" },
  { id: 1036, alt: "Snow-covered valley below mountain peaks" },
  { id: 1039, alt: "Waterfall in a mossy gorge" },
  { id: 1050, alt: "Sea stacks off a rocky coast" },
  { id: 1069, alt: "Orange jellyfish in deep blue water" },
].map(({ id, alt }) => ({ src: `https://picsum.photos/id/${id}/1600/1067`, alt }))

export default function ControlledViewer() {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  const openAt = (i: number) => {
    setIndex(i)
    setOpen(true)
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap justify-center gap-2">
        <Button icon={<Icon name="photo_library" />} onPress={() => openAt(0)}>
          Open album
        </Button>
        <Button variant="tonal" onPress={() => openAt(album.length - 1)}>
          Open last photo
        </Button>
      </div>
      <span className="text-body-sm text-on-surface-variant">
        index: {index} · isOpen: {String(open)}
      </span>
      <ImageViewer images={album} isOpen={open} onOpenChange={setOpen} index={index} onIndexChange={setIndex} />
    </div>
  )
}
