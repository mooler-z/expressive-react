import { ChipGroup, FilterChip } from "@/components/ui/chip"

export default function ChipChoice() {
  return (
    <ChipGroup aria-label="Sort by" selectionMode="single" defaultSelectedKeys={["newest"]}>
      <FilterChip id="newest">Newest</FilterChip>
      <FilterChip id="oldest">Oldest</FilterChip>
      <FilterChip id="popular">Most popular</FilterChip>
    </ChipGroup>
  )
}
