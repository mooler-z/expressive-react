import { RouterProvider } from "react-aria-components"
import { useHref, useNavigate } from "react-router"

import { LandingPage } from "@/docs/site/landing/landing-page"
import { SiteLayout } from "@/docs/site/site-layout"

export const meta = { path: "/" }

export default function HomePage() {
  const navigate = useNavigate()
  return (
    <RouterProvider navigate={navigate} useHref={useHref}>
      <SiteLayout active="home">
        <LandingPage />
      </SiteLayout>
    </RouterProvider>
  )
}
