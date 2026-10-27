import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"

const fakeRequest = () => new Promise((resolve) => setTimeout(resolve, 1600))

export default function ButtonPending() {
  const [saving, setSaving] = useState(false)
  const [deploying, setDeploying] = useState(false)

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button
        isPending={saving}
        icon={<Icon name="save" />}
        onPress={async () => {
          setSaving(true)
          await fakeRequest()
          setSaving(false)
        }}
      >
        {saving ? "Saving…" : "Save changes"}
      </Button>
      <Button
        variant="tonal"
        isPending={deploying}
        icon={<Icon name="rocket_launch" />}
        onPress={async () => {
          setDeploying(true)
          await fakeRequest()
          setDeploying(false)
        }}
      >
        {deploying ? "Deploying…" : "Deploy"}
      </Button>
      <span className="text-body-sm text-on-surface-variant">Press to run a 1.6s fake request.</span>
    </div>
  )
}
