import { RouterProvider } from "react-aria-components"
import { Navigate, Route, Routes, useHref, useNavigate, useParams } from "react-router"

import { Landing, type LandingPage } from "@/components/blocks/landing/landing"
import { LANDING_PAGES } from "@/components/blocks/landing/landing-shared"

export const meta = { path: "/landing/*" }

const LINKS = { kit: "/kit", dashboard: "/admin" }

const href = (page: LandingPage) => (page === "home" ? "/landing" : `/landing/${page}`)

/** One Landing instance for every sub-page (rail state survives navigation); the page comes from the URL. */
function LandingRoute() {
  const { page = "home" } = useParams()
  if (!LANDING_PAGES.includes(page as LandingPage)) return <Navigate to="/landing" replace />
  return <Landing page={page as LandingPage} getHref={href} links={LINKS} />
}

/** /landing, /landing/features, /landing/pricing, /landing/about, /landing/changelog, /landing/contact */
export default function LandingDocsPage() {
  const navigate = useNavigate()
  return (
    <RouterProvider navigate={navigate} useHref={useHref}>
      <Routes>
        <Route path=":page?" element={<LandingRoute />} />
      </Routes>
    </RouterProvider>
  )
}
