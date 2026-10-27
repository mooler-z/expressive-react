import { useState } from "react"

import { AttachmentChip } from "@/components/ui/attachment"

export default function AttachmentChips() {
  const [files, setFiles] = useState(["incident-timeline.pdf", "p95-latency.png", "values.yaml"])
  const remove = (name: string) => setFiles((f) => f.filter((n) => n !== name))

  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-5">
      <div className="flex flex-wrap justify-center gap-2">
        {files.map((name) => (
          <AttachmentChip key={name} name={name} onRemove={() => remove(name)} />
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <AttachmentChip variant="rich" name="capacity-plan.xlsx" size={482_000} />
        <AttachmentChip variant="rich" name="dashboard.mp4" size={31_000_000} progress={42} />
      </div>
    </div>
  )
}
