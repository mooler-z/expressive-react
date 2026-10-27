import { CopyButton, InlineCode } from "@/components/ui/code-block"
import { snackbar } from "@/components/ui/snackbar"

export default function CodeBlockInline() {
  return (
    <div className="flex max-w-md flex-col gap-4 text-body-lg text-on-surface">
      <p>
        Set <InlineCode>shape="square"</InlineCode> to start from the square corners, or pass <InlineCode>isPending</InlineCode> while a request runs.
      </p>
      <div className="flex items-center gap-2 rounded-md bg-surface-container-high py-1 pr-1 pl-4">
        <span className="min-w-0 flex-1 truncate font-mono text-body-md">sk_live_51Hq…9ZcA</span>
        <CopyButton value="sk_live_51Hq9ZcA" aria-label="Copy API key" onCopied={() => snackbar("API key copied")} />
      </div>
    </div>
  )
}
