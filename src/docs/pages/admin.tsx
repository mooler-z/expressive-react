import { RouterProvider } from "react-aria-components"
import { useHref, useLocation, useNavigate } from "react-router"

import { AdminDashboard } from "@/components/blocks/admin/admin-dashboard"
import { ADMIN_PAGES, type AdminPage } from "@/components/blocks/admin/admin-data"

export const meta = { path: "/admin/*" }

/** /admin → overview · /admin/users · /admin/customer/3 · /admin/order/KS-10471 */
export default function AdminPageRoute() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [, , seg, id] = pathname.split("/")
  const page = (ADMIN_PAGES as string[]).includes(seg) ? (seg as AdminPage) : "overview"
  return (
    <RouterProvider navigate={navigate} useHref={useHref}>
      <AdminDashboard page={page} id={id ? decodeURIComponent(id) : undefined} basePath="/admin" navigate={navigate} exitHref="/" />
    </RouterProvider>
  )
}
