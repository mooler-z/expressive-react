"use client"

import * as React from "react"

import { ConnectedButton, ConnectedButtonGroup } from "@/components/ui/button-group"
import { Icon } from "@/components/ui/icon"
import { Shape } from "@/components/ui/shape"
import { snackbar } from "@/components/ui/snackbar"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

import { ProductRevenueChart } from "./admin-charts"
import { useAdmin } from "./admin-context"
import { DATA, ROLE_TONES, type Product } from "./admin-data"
import { Card, CardHead, FilterChipButton, PageHeader } from "./admin-ui"
import { SearchInput } from "./admin-users"

type Cat = "All" | Product["cat"]
const CATS: Cat[] = ["All", "Plans", "Add-ons", "Services"]
const ATTACH = [
  ["Policy engine", 62, "bg-primary"],
  ["Observe", 41, "bg-tertiary"],
  ["Cost insights", 28, "bg-secondary"],
  ["Premium support", 19, "bg-primary-fixed-dim"],
] as const
const LIST_GRID = "grid-cols-[minmax(240px,2fr)_110px_minmax(150px,1fr)_100px_110px_80px]"

export function AdminProducts() {
  const { query, setQuery, openDialog } = useAdmin()
  const [cat, setCat] = React.useState<Cat>("All")
  const [view, setView] = React.useState<"grid" | "list">("grid")
  const [off, setOff] = React.useState<Record<string, boolean>>({})

  const q = query.trim().toLowerCase()
  const searched = DATA.products.filter((p) => !q || (p.name + " " + p.cat).toLowerCase().includes(q))
  const products = searched.filter((p) => cat === "All" || p.cat === cat)
  const toggle = (p: Product) => {
    const active = !off[p.key]
    setOff((o) => ({ ...o, [p.key]: active }))
    snackbar(p.name + (active ? " hidden from catalog" : " published"), {
      action: { label: "Undo", onAction: () => setOff((o) => ({ ...o, [p.key]: !active })) },
    })
  }

  return (
    <div data-page>
      <PageHeader
        title="Products"
        description="Plans, add-ons and services in the Kestrel catalog."
        actions={
          <>
            <ConnectedButtonGroup
              aria-label="View"
              variant="filled"
              size="sm"
              selectedKeys={[view]}
              onSelectionChange={(k) => {
                const v = [...k][0] as "grid" | "list" | undefined
                if (v) setView(v)
              }}
            >
              <ConnectedButton id="grid" iconOnly aria-label="Grid view">
                <Icon size={20}>grid_view</Icon>
              </ConnectedButton>
              <ConnectedButton id="list" iconOnly aria-label="List view">
                <Icon size={20}>view_list</Icon>
              </ConnectedButton>
            </ConnectedButtonGroup>
            <button
              className="state-layer inline-flex h-10 items-center gap-2 rounded-full bg-primary pr-5 pl-4 text-label-lg text-on-primary shape-morph active:rounded-md"
              onClick={() => openDialog("product")}
            >
              <Icon size={20}>add</Icon>
              New product
            </button>
          </>
        }
      />
      <div className="flex flex-wrap items-center gap-3 pb-4">
        <SearchInput placeholder="Search products" value={query} onChange={setQuery} />
        <div className="flex flex-wrap gap-2">
          {CATS.map((c) => (
            <FilterChipButton key={c} selected={cat === c} count={searched.filter((p) => c === "All" || p.cat === c).length} onPress={() => setCat(c)}>
              {c}
            </FilterChipButton>
          ))}
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {products.map((p) => {
            const active = !off[p.key]
            const tone = ROLE_TONES[p.role]
            return (
              <div
                key={p.key}
                className={cn(
                  "group flex flex-col rounded-xl bg-surface-container-low p-5 transition-all duration-300 ease-emphasized hover:-translate-y-1 hover:bg-surface-container",
                  !active && "opacity-60",
                )}
              >
                <div className="flex items-start justify-between">
                  <span className="relative grid size-16 place-items-center">
                    <Shape shape={p.shape} hoverShape="sunny" className={cn("absolute inset-0 size-16", tone.shape)} />
                    <Icon className={cn("relative", tone.icon)}>{p.icon}</Icon>
                  </span>
                  <Switch aria-label={`${p.name} active`} isSelected={active} onChange={() => toggle(p)} />
                </div>
                <div className="mt-4 text-title-lg">{p.name}</div>
                <div className="text-body-sm text-on-surface-variant">{p.cat}</div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-headline-sm font-medium tabular-nums">{p.price}</span>
                  <span className="text-body-sm text-on-surface-variant">{p.unit}</span>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-2 text-body-sm">
                  <div className="rounded-md bg-surface p-3">
                    <dt className="text-on-surface-variant">Customers</dt>
                    <dd className="text-title-sm tabular-nums">{p.sold}</dd>
                  </div>
                  <div className="rounded-md bg-surface p-3">
                    <dt className="text-on-surface-variant">Revenue YTD</dt>
                    <dd className="text-title-sm tabular-nums">{p.rev}</dd>
                  </div>
                </dl>
                <div className="mt-4 flex items-center justify-between">
                  <span className={cn("text-body-sm", active ? "text-tertiary" : "text-on-surface-variant")}>{active ? "Published" : "Hidden from catalog"}</span>
                  <button className="state-layer inline-flex h-9 items-center rounded-full px-3 text-label-lg text-primary" onClick={() => snackbar("Editing product (demo)")}>
                    Edit
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl bg-surface-container-low">
          <div className="relative overflow-x-auto">
            <div className="min-w-[760px]">
              <div className={cn("grid gap-3 border-b border-outline-variant px-5 py-3 text-label-md text-on-surface-variant", LIST_GRID)}>
                <span>Product</span>
                <span>Category</span>
                <span>Price</span>
                <span className="text-right">Customers</span>
                <span className="text-right">Revenue YTD</span>
                <span className="text-right">Active</span>
              </div>
              {products.map((p) => {
                const active = !off[p.key]
                return (
                  <div key={p.key} className={cn("grid items-center gap-3 border-b border-outline-variant/60 px-5 py-3 text-body-md", LIST_GRID, !active && "opacity-60")}>
                    <span className="flex min-w-0 items-center gap-3">
                      <span className={cn("grid size-10 shrink-0 place-items-center rounded-md", ROLE_TONES[p.role].box)}>
                        <Icon size={20}>{p.icon}</Icon>
                      </span>
                      <span className="truncate font-medium">{p.name}</span>
                    </span>
                    <span className="text-on-surface-variant">{p.cat}</span>
                    <span className="whitespace-nowrap">
                      <span className="tabular-nums">{p.price}</span>
                      <span className="ml-1 text-body-sm text-on-surface-variant">{p.unit}</span>
                    </span>
                    <span className="text-right tabular-nums">{p.sold}</span>
                    <span className="text-right tabular-nums">{p.rev}</span>
                    <span className="flex justify-end">
                      <Switch aria-label={`${p.name} active`} isSelected={active} onChange={() => toggle(p)} />
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
      {products.length === 0 && <div className="rounded-xl bg-surface-container-low px-6 py-14 text-center text-body-md text-on-surface-variant">No products match.</div>}

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHead title="Revenue by product" description="Year to date, USD" />
          <div className="relative mt-3 h-72">
            <ProductRevenueChart />
          </div>
        </Card>
        <Card>
          <CardHead title="Attach rate" description="Add-ons per Business+ customer" />
          <ul className="mt-4 space-y-4">
            {ATTACH.map(([label, pct, bar]) => (
              <li key={label}>
                <div className="flex justify-between text-body-md">
                  <span>{label}</span>
                  <span className="text-on-surface-variant tabular-nums">{pct}%</span>
                </div>
                <div className="mt-1.5 flex h-2 items-center gap-1">
                  <div className={cn("h-full rounded-full", bar)} style={{ width: pct + "%" }} />
                  <div className="h-full flex-1 rounded-full bg-secondary-container" />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
