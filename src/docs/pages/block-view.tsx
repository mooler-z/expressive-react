import { Link, useParams } from "react-router"

import { Icon } from "@/components/ui/icon"
import { REGISTRY } from "@/docs/site/blocks-gallery/catalog"
import { PREVIEWS } from "@/docs/site/blocks-gallery/previews"

export const meta = { path: "/blocks/view/:name" }

/** One registry block, full page, no site chrome: the gallery's iframes and "Open in a new tab". */
export default function BlockViewPage() {
  const { name = "" } = useParams()
  const render = PREVIEWS[name]
  const item = REGISTRY[name]

  if (!render) {
    return (
      <div className="grid min-h-screen place-items-center bg-surface p-8 font-sans text-on-surface">
        <div className="max-w-md text-center">
          <Icon size={40} className="text-on-surface-variant">
            {item ? "visibility_off" : "search_off"}
          </Icon>
          <h1 className="mt-4 text-headline-sm">{item ? `${item.title ?? name} has no preview` : `No block named “${name}”`}</h1>
          <Link to="/blocks" className="mt-6 inline-flex h-10 items-center rounded-full bg-primary px-6 text-label-lg text-on-primary">
            Browse blocks
          </Link>
        </div>
      </div>
    )
  }

  return (
    // RAC links navigate client-side through the RouterProvider in app.tsx.
    <div data-block-view={name} className="min-h-screen bg-surface font-sans text-on-surface">
      {render()}
    </div>
  )
}
