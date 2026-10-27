import { useState } from "react"
import type { Selection } from "react-aria-components"

import { Checkbox } from "@/components/ui/checkbox"
import { InteractiveList, InteractiveListItem } from "@/components/ui/list"

const FILES = [
  { id: "brief", name: "Project brief.pdf", size: "1.2 MB" },
  { id: "tokens", name: "tokens.json", size: "18 KB" },
  { id: "logo", name: "Logo.svg", size: "4 KB" },
  { id: "deck", name: "Launch deck.key", size: "48 MB" },
]

export default function ListSelection() {
  const [selected, setSelected] = useState<Selection>(new Set(["tokens"]))
  const count = selected === "all" ? FILES.length : selected.size

  return (
    <div className="w-full max-w-md">
      <InteractiveList
        aria-label="Files"
        selectionMode="multiple"
        selectedKeys={selected}
        onSelectionChange={setSelected}
        items={FILES}
        className="rounded-lg bg-surface-container-low"
      >
        {(file) => (
          <InteractiveListItem id={file.id} textValue={file.name} leading={<Checkbox slot="selection" />} trailingText={file.size}>
            {file.name}
          </InteractiveListItem>
        )}
      </InteractiveList>
      <p className="mt-3 text-body-sm text-on-surface-variant">{count} selected</p>
    </div>
  )
}
