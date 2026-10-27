import { useEffect, useState } from "react"

import { ComboBox, ComboBoxItem } from "@/components/ui/combobox"

const SERVICES = ["checkout-api", "billing-worker", "search-indexer", "auth-gateway", "media-resizer", "notifications"]

export default function ComboBoxAsync() {
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<string[]>([])

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      setResults(SERVICES.filter((s) => s.includes(input.toLowerCase())))
      setLoading(false)
    }, 700)
    return () => clearTimeout(timer)
  }, [input])

  return (
    <div className="w-full max-w-xs">
      <ComboBox
        label="Service"
        items={loading ? [] : results.map((name) => ({ id: name, name }))}
        inputValue={input}
        onInputChange={setInput}
        isLoading={loading}
        loadingText="Searching services…"
        emptyText="No services match"
        menuTrigger="focus"
      >
        {(service) => (
          <ComboBoxItem id={service.id} icon="dns">
            {service.name}
          </ComboBoxItem>
        )}
      </ComboBox>
    </div>
  )
}
