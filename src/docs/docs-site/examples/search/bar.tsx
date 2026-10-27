import { useState } from "react"

import { Avatar } from "@/components/ui/avatar"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { SearchBar } from "@/components/ui/search"
import { snackbar } from "@/components/ui/snackbar"

export default function SearchBarExample() {
  const [query, setQuery] = useState("")

  return (
    <div className="grid w-full max-w-md gap-4">
      <SearchBar placeholder="Search photos" value={query} onChange={setQuery} onSubmit={(q) => snackbar(`Searched “${q}”`)} />
      <SearchBar
        placeholder="Search mail"
        leading={
          <IconButton aria-label="Open navigation">
            <Icon name="menu" />
          </IconButton>
        }
        trailing={
          <>
            <IconButton aria-label="Voice search">
              <Icon name="mic" />
            </IconButton>
            <Avatar name="Maya Lindqvist" size="sm" className="mx-2" />
          </>
        }
      />
      <p className="text-body-sm text-on-surface-variant">{query ? `Query: ${query}` : "Type above; Esc clears."}</p>
    </div>
  )
}
