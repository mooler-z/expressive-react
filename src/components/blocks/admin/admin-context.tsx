"use client"

import * as React from "react"

import type { AdminPage, RangeKey } from "./admin-data"

export type AdminDialog = "invite" | "product" | null

interface AdminContextValue {
  page: AdminPage
  /** Detail id for `customer` / `order` pages. */
  id?: string
  /** URL for a page, e.g. href("customer", "3") → "/admin/customer/3". */
  href: (page: AdminPage, id?: string) => string
  range: RangeKey
  setRange: (r: RangeKey) => void
  compare: boolean
  setCompare: (v: boolean) => void
  query: string
  setQuery: (q: string) => void
  dialog: AdminDialog
  openDialog: (d: AdminDialog) => void
  /** Imperative navigation (row clicks). Links use RAC's RouterProvider instead. */
  navigate: (href: string) => void
}

const AdminContext = React.createContext<AdminContextValue | null>(null)

export function useAdmin() {
  const ctx = React.useContext(AdminContext)
  if (!ctx) throw new Error("useAdmin must be used inside <AdminDashboard>")
  return ctx
}

export function AdminProvider({
  page,
  id,
  basePath,
  navigate = (to) => window.location.assign(to),
  children,
}: {
  page: AdminPage
  id?: string
  basePath: string
  navigate?: (href: string) => void
  children: React.ReactNode
}) {
  const [range, setRange] = React.useState<RangeKey>("30d")
  const [compare, setCompare] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [dialog, openDialog] = React.useState<AdminDialog>(null)

  // Each page starts with an empty search, like the kit.
  React.useEffect(() => setQuery(""), [page])

  const href = React.useCallback(
    (p: AdminPage, pid?: string) => {
      const base = basePath.replace(/\/$/, "")
      return p === "overview" ? base || "/" : `${base}/${p}${pid ? "/" + encodeURIComponent(pid) : ""}`
    },
    [basePath],
  )

  const value = React.useMemo(
    () => ({ page, id, href, range, setRange, compare, setCompare, query, setQuery, dialog, openDialog, navigate }),
    [page, id, href, range, compare, query, dialog, navigate],
  )
  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}
