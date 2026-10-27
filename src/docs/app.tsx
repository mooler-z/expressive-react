import * as React from "react"
import { RouterProvider } from "react-aria-components"
import { BrowserRouter, Route, Routes, useHref, useLocation, useNavigate } from "react-router"

import { DocsHeader } from "@/docs/docs-header"

/*
 * Every file in ./pages is a route:
 *   export const meta = { path: "/layouts" }   // add "/*" to own nested routes
 *   export default function Page() { … }
 */
type PageModule = { meta: { path: string }; default: React.ComponentType }
const pages = Object.values(import.meta.glob<PageModule>("./pages/*.tsx", { eager: true }))

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  React.useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

/** React Aria links (`<Link href>`, `<MenuItem href>`, nav items…) navigate client-side through react-router. */
function AriaRouter({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  return (
    <RouterProvider navigate={navigate} useHref={useHref}>
      {children}
    </RouterProvider>
  )
}

export function App() {
  return (
    <BrowserRouter>
      <AriaRouter>
        <ScrollToTop />
        <Routes>
          {pages.map(({ meta, default: Page }) => (
            <Route key={meta.path} path={meta.path} element={<Page />} />
          ))}
          <Route
            path="*"
            element={
              <>
                <DocsHeader />
                <p className="p-8 text-body-lg">Page not found.</p>
              </>
            }
          />
        </Routes>
      </AriaRouter>
    </BrowserRouter>
  )
}
