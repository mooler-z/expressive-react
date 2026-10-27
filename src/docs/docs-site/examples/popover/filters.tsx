import * as React from "react"
import type { Key } from "react-aria-components"

import { Button } from "@/components/ui/button"
import { ChipGroup, FilterChip } from "@/components/ui/chip"
import { Icon } from "@/components/ui/icon"
import { Popover, PopoverDescription, PopoverTitle, PopoverTrigger } from "@/components/ui/popover"

const REGIONS = ["Europe", "North America", "Asia Pacific", "South America"]

export default function PopoverFilters() {
  const [regions, setRegions] = React.useState<Set<Key>>(new Set(["Europe"]))

  return (
    <PopoverTrigger>
      <Button variant="tonal" icon={<Icon name="filter_list" />}>
        Regions · {regions.size}
      </Button>
      <Popover className="w-80">
        <PopoverTitle>Filter by region</PopoverTitle>
        <PopoverDescription>Only nodes in these regions are shown.</PopoverDescription>
        <ChipGroup aria-label="Regions" selectedKeys={regions} onSelectionChange={setRegions} className="mt-4">
          {REGIONS.map((r) => (
            <FilterChip key={r} id={r}>
              {r}
            </FilterChip>
          ))}
        </ChipGroup>
        <div className="mt-4 flex justify-end">
          <Button variant="text" slot="close">
            Done
          </Button>
        </div>
      </Popover>
    </PopoverTrigger>
  )
}
