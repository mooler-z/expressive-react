import { Avatar } from "@/components/ui/avatar"
import { SearchHighlight, SearchItem, SearchSection, SearchView } from "@/components/ui/search"
import { snackbar } from "@/components/ui/snackbar"

export default function SearchDemo() {
  return (
    <div className="w-full max-w-md">
      <SearchView
        placeholder="Search services, incidents…"
        trailing={<Avatar name="Maya Lindqvist" size="sm" className="me-2" />}
        onAction={(key) => snackbar(`Opened ${key}`)}
        onSubmit={(q) => snackbar(`Searched “${q}”`)}
      >
        <SearchSection title="Recent">
          <SearchItem id="checkout-api" icon="history" trailing="north_west">
            checkout-api
          </SearchItem>
          <SearchItem id="INC-2041" icon="history" trailing="north_west">
            INC-2041
          </SearchItem>
        </SearchSection>
        <SearchSection title="Services">
          <SearchItem id="payments-gateway" textValue="payments-gateway" icon="dns" description="Healthy · eu-west-1">
            <SearchHighlight>payments-gateway</SearchHighlight>
          </SearchItem>
          <SearchItem id="search-indexer" textValue="search-indexer" icon="dns" description="Degraded · us-east-2">
            <SearchHighlight>search-indexer</SearchHighlight>
          </SearchItem>
          <SearchItem id="auth-service" textValue="auth-service" icon="dns" description="Healthy · global">
            <SearchHighlight>auth-service</SearchHighlight>
          </SearchItem>
        </SearchSection>
      </SearchView>
    </div>
  )
}
