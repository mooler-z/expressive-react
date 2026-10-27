import { useState } from "react"

import { Button } from "@/components/ui/button"
import { LinearProgress } from "@/components/ui/progress"
import { snackbar } from "@/components/ui/snackbar"

export default function SnackbarPersistent() {
  const [key, setKey] = useState<string | null>(null)

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button
        isDisabled={key != null}
        onPress={() =>
          setKey(
            snackbar("Uploading 3 files…", {
              timeout: 0,
              children: <LinearProgress aria-label="Upload" isIndeterminate tone="inverse" className="mt-2" />,
              onClose: () => setKey(null),
            }),
          )
        }
      >
        Start upload
      </Button>
      <Button
        variant="tonal"
        isDisabled={key == null}
        onPress={() => {
          if (key) snackbar.dismiss(key)
          snackbar("Upload complete")
        }}
      >
        Finish
      </Button>
    </div>
  )
}
