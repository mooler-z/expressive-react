import { useEffect, useState } from "react"

import { SearchItem, SearchView } from "@/components/ui/search"

const ALL = ["React Aria", "React Router", "Recharts", "Radix", "Remix", "Redux", "Relay", "Reanimated"]

export default function SearchAsync() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query) {
      setResults([])
      setLoading(false)
      return
    }
    setLoading(true)
    const t = setTimeout(() => {
      setResults(ALL.filter((name) => name.toLowerCase().includes(query.toLowerCase())))
      setLoading(false)
    }, 600)
    return () => clearTimeout(t)
  }, [query])

  return (
    <div className="w-full max-w-md">
      <SearchView
        placeholder="Search packages"
        inputValue={query}
        onInputChange={setQuery}
        filter={null}
        isLoading={loading}
        items={results.map((name) => ({ name }))}
        renderEmptyState={(q) => (
          <p className="px-4 py-8 text-center text-body-md text-on-surface-variant">{q ? (loading ? "Searching…" : `No packages match “${q}”`) : "Try “re”"}</p>
        )}
      >
        {(item) => (
          <SearchItem id={item.name} icon="package_2">
            {item.name}
          </SearchItem>
        )}
      </SearchView>
    </div>
  )
}
