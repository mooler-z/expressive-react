import { RouterProvider } from "react-aria-components"
import { useState } from "react"

import { Icon } from "@/components/ui/icon"
import { LinkButton } from "@/components/ui/link-button"

/* Your app wraps everything once, e.g. with react-router:
   <RouterProvider navigate={useNavigate()} useHref={useHref}>…</RouterProvider>
   Here a local router records the navigation instead. */
export default function LinkButtonRouter() {
  const [path, setPath] = useState("/sessions/4821")
  return (
    <RouterProvider navigate={setPath}>
      <div className="flex w-full max-w-md flex-col gap-4 rounded-lg bg-surface-container-low p-4">
        <div className="text-body-md text-on-surface-variant">
          Location: <code className="font-mono text-on-surface">{path}</code>
        </div>
        <div className="flex flex-wrap gap-2">
          <LinkButton href="/sessions" variant="text" size="xs" icon={<Icon name="arrow_back" />}>
            Sessions
          </LinkButton>
          <LinkButton href="/sessions/4821/replay" variant="tonal" size="xs" trailingIcon={<Icon name="play_arrow" />}>
            Open replay
          </LinkButton>
        </div>
      </div>
    </RouterProvider>
  )
}
