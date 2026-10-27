import { SearchItem, SearchView } from "@/components/ui/search"
import { snackbar } from "@/components/ui/snackbar"

const cities = [
  { id: "lisbon", name: "Lisbon", country: "Portugal" },
  { id: "oslo", name: "Oslo", country: "Norway" },
  { id: "osaka", name: "Osaka", country: "Japan" },
  { id: "ottawa", name: "Ottawa", country: "Canada" },
  { id: "quito", name: "Quito", country: "Ecuador" },
]

export default function SearchItems() {
  return (
    <div className="w-full max-w-md">
      <SearchView placeholder="Search cities" items={cities} onAction={(key) => snackbar(`Selected ${key}`)}>
        {(city) => (
          <SearchItem id={city.id} textValue={city.name} icon="location_city" description={city.country}>
            {city.name}
          </SearchItem>
        )}
      </SearchView>
    </div>
  )
}
