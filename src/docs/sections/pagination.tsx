import * as React from "react"
import { Button as AriaButton } from "react-aria-components"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { Menu, MenuItem, MenuPopover, MenuTrigger } from "@/components/ui/menu"
import { Pagination, PaginationDots, PaginationRange } from "@/components/ui/pagination"
import { LinearProgress } from "@/components/ui/progress"
import { Section, Variant, Variants } from "@/docs/section"

export default function PaginationSection() {
  const [rows, setRows] = React.useState(10)
  const [dot, setDot] = React.useState(1)
  const [loaded, setLoaded] = React.useState(20)
  const [page, setPage] = React.useState(3)
  return (
    <Section
      id="pagination"
      description="Numbered pages as 40dp round buttons (current on primary), an ellipsis, the Expressive connected group, and the compact range + arrows form used in table footers."
    >
      <div className="flex flex-col gap-6">
        <Pagination pageCount={12} defaultPage={2} showLabels />
        <div className="flex flex-wrap items-center gap-4">
          <Pagination pageCount={4} defaultPage={2} variant="connected" />
          <span className="text-body-sm text-on-surface-variant">Connected group · the current page morphs to a pill</span>
        </div>
        <PaginationRange total={240} pageSize={rows} defaultPage={3} pageSizeOptions={[10, 25, 50]} onPageSizeChange={setRows} showJump />
      </div>

      <Variants cols="md:grid-cols-2 xl:grid-cols-3">
        <Variant n={1} label="Dots · expressive">
          <IconButton aria-label="Previous slide" isDisabled={dot === 0} onPress={() => setDot((d) => d - 1)}>
            <Icon>chevron_left</Icon>
          </IconButton>
          <PaginationDots count={5} index={dot} onIndexChange={setDot} />
          <IconButton aria-label="Next slide" isDisabled={dot === 4} onPress={() => setDot((d) => d + 1)}>
            <Icon>chevron_right</Icon>
          </IconButton>
        </Variant>
        <Variant n={2} label="Load more · progress" className="flex min-h-24 flex-col items-center justify-center gap-3 rounded-lg bg-surface p-4">
          <div className="text-body-sm text-on-surface-variant">
            Showing {loaded} of 240 events
          </div>
          <LinearProgress value={loaded} maxValue={240} aria-label="Events loaded" className="w-48" />
          <Button variant="tonal" isDisabled={loaded >= 240} onPress={() => setLoaded((n) => Math.min(240, n + 20))}>
            <Icon>expand_more</Icon>
            Load 20 more
          </Button>
        </Variant>
        <Variant n={3} label="Dense · 32dp">
          <Pagination pageCount={18} defaultPage={3} size="sm" />
        </Variant>
        <Variant n={4} label="Tonal & outlined current" className="flex min-h-24 flex-col items-center justify-center gap-3 rounded-lg bg-surface p-4">
          <Pagination pageCount={5} defaultPage={2} variant="tonal" />
          <Pagination pageCount={5} defaultPage={4} variant="outlined" />
        </Variant>
        <Variant n={5} label="Compact · page x of y">
          <IconButton aria-label="Previous page" isDisabled={page <= 1} onPress={() => setPage((p) => p - 1)}>
            <Icon>chevron_left</Icon>
          </IconButton>
          <span className="flex items-center gap-1 text-body-md text-on-surface-variant">
            Page
            <MenuTrigger>
              <AriaButton aria-label={`Page ${page}, choose page`} className="state-layer focus-ring relative inline-flex h-8 cursor-pointer items-center rounded-[8px] ps-2 pe-0.5 text-label-lg text-on-surface tabular-nums">
                {page}
                <Icon size={20}>arrow_drop_down</Icon>
              </AriaButton>
              <MenuPopover>
                <Menu aria-label="Page" selectionMode="single" selectedKeys={[page]} onAction={(k) => setPage(Number(k))} className="max-h-72 min-w-20">
                  {Array.from({ length: 12 }, (_, i) => (
                    <MenuItem key={i + 1} id={i + 1}>
                      {String(i + 1)}
                    </MenuItem>
                  ))}
                </Menu>
              </MenuPopover>
            </MenuTrigger>
            of 12
          </span>
          <IconButton aria-label="Next page" isDisabled={page >= 12} onPress={() => setPage((p) => p + 1)}>
            <Icon>chevron_right</Icon>
          </IconButton>
        </Variant>
        <Variant n={6} label="First & last page" className="flex min-h-24 flex-col items-center justify-center gap-3 rounded-lg bg-surface p-4">
          <Pagination pageCount={3} defaultPage={1} showLabels />
          <Pagination pageCount={12} defaultPage={12} siblings={0} showEdges size="sm" />
        </Variant>
      </Variants>
    </Section>
  )
}
