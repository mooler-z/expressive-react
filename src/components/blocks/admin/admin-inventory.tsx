"use client"

import * as React from "react"

import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, useTableSort } from "@/components/ui/table"

import { AsyncButton, Meter, Panel, TonePill, notify, type Tone } from "./admin-actions"
import { InventoryCapacityChart } from "./admin-charts"
import { PageHeader } from "./admin-ui"

type RegionStatus = "Healthy" | "Spare" | "Near limit"
const REGION_TONE: Record<RegionStatus, Tone> = { Healthy: "tertiary", Spare: "neutral", "Near limit": "error" }

const REGIONS: { name: string; code: string; pct: number; vcpu: number; status: RegionStatus }[] = [
  { name: "Frankfurt", code: "eu-central-1", pct: 82, vcpu: 1240, status: "Healthy" },
  { name: "Stockholm", code: "eu-north-1", pct: 54, vcpu: 620, status: "Spare" },
  { name: "N. Virginia", code: "us-east-1", pct: 91, vcpu: 1880, status: "Near limit" },
  { name: "Oregon", code: "us-west-2", pct: 63, vcpu: 940, status: "Healthy" },
  { name: "Tokyo", code: "ap-northeast-1", pct: 71, vcpu: 760, status: "Healthy" },
  { name: "Sydney", code: "ap-southeast-2", pct: 38, vcpu: 310, status: "Spare" },
]

type StockStatus = "In stock" | "Low" | "Critical"
const STOCK_TONE: Record<StockStatus, Tone> = { "In stock": "tertiary", Low: "secondary", Critical: "error" }
const STOCK_BAR: Record<StockStatus, "primary" | "secondary" | "error"> = { "In stock": "primary", Low: "secondary", Critical: "error" }

const TYPES: { type: string; family: string; stock: number; target: number; status: StockStatus }[] = [
  { type: "m7i.large", family: "General purpose", stock: 412, target: 520, status: "In stock" },
  { type: "c7g.xlarge", family: "Compute", stock: 88, target: 300, status: "Low" },
  { type: "r7i.2xlarge", family: "Memory", stock: 36, target: 200, status: "Critical" },
  { type: "g5.xlarge", family: "GPU", stock: 12, target: 40, status: "Low" },
  { type: "i4i.large", family: "Storage", stock: 140, target: 160, status: "In stock" },
  { type: "t4g.medium", family: "Burstable", stock: 980, target: 1000, status: "In stock" },
]

export function AdminInventory() {
  const [alertOpen, setAlertOpen] = React.useState(true)
  const { sorted, headProps } = useTableSort(TYPES, {
    type: (t) => t.type,
    family: (t) => t.family,
    stock: (t) => t.stock / t.target,
  })

  return (
    <div>
      <PageHeader
        title="Inventory"
        description="Reserved capacity across 6 regions"
        actions={
          <>
            <Button variant="outlined" onPress={() => notify("Opening capacity forecast")}>
              <Icon>trending_up</Icon>
              Forecast
            </Button>
            <Button onPress={() => notify("Reservation request started", "Open")}>
              <Icon>add</Icon>
              Reserve capacity
            </Button>
          </>
        }
      />

      {alertOpen && (
        <Alert
          tone="error"
          icon="inventory"
          className="mb-4 rounded-lg"
          onDismiss={() => setAlertOpen(false)}
          actions={
            <Button size="sm" className="h-9 bg-error text-on-error" onPress={() => notify("Reorder placed for 160 × r7i.2xlarge")}>
              Reorder
            </Button>
          }
        >
          r7i.2xlarge is at 18% of target in us-east-1. Reorder before Nov 2 to avoid throttling.
        </Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {REGIONS.map((r) => (
          <div key={r.code} className="rounded-xl bg-surface-container-low p-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-title-md">{r.name}</div>
                <div className="font-mono text-body-sm text-on-surface-variant">{r.code}</div>
              </div>
              <TonePill tone={REGION_TONE[r.status]}>{r.status}</TonePill>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-headline-sm font-medium tabular-nums">{r.pct}%</span>
              <span className="text-body-sm text-on-surface-variant">{r.vcpu.toLocaleString("en-US")} vCPU reserved</span>
            </div>
            <div className="mt-2 flex">
              <Meter value={r.pct} label={`${r.name} reserved capacity`} tone={r.pct >= 90 ? "error" : "primary"} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Panel title="Capacity mix" description="In use · reserved · free">
          <div className="relative h-72">
            <InventoryCapacityChart />
          </div>
        </Panel>

        <Panel title="Instance types" description="Stock against target" className="overflow-hidden xl:col-span-2">
          <Table aria-label="Instance types" className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead {...headProps("type")}>Type</TableHead>
                <TableHead {...headProps("family")}>Family</TableHead>
                <TableHead {...headProps("stock")}>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((t) => (
                <TableRow key={t.type}>
                  <TableCell className="font-mono text-body-sm">{t.type}</TableCell>
                  <TableCell muted>{t.family}</TableCell>
                  <TableCell>
                    <div className="flex w-48 items-center gap-2">
                      <Meter value={Math.round((t.stock / t.target) * 100)} label={`${t.type} stock`} tone={STOCK_BAR[t.status]} className="h-1.5" />
                      <span className="w-16 text-right text-label-md tabular-nums">
                        {t.stock}/{t.target}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <TonePill tone={STOCK_TONE[t.status]}>{t.status}</TonePill>
                  </TableCell>
                  <TableCell align="end" className="py-1">
                    <AsyncButton variant="text" busy="Ordering…" done="Ordered" onDone={() => notify(`Reorder placed for ${t.type}`)}>
                      Reorder
                    </AsyncButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Panel>
      </div>
    </div>
  )
}
