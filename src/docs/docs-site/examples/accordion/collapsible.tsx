import { Collapsible } from "@/components/ui/accordion"

export default function CollapsibleExample() {
  return (
    <div className="grid w-full max-w-xl gap-4">
      <Collapsible title="3 more environment variables">
        <ul className="space-y-1 px-4 py-3 font-mono text-body-sm text-on-surface-variant">
          <li>DATABASE_URL</li>
          <li>REDIS_URL</li>
          <li>SENTRY_DSN</li>
        </ul>
      </Collapsible>
      <Collapsible variant="tonal" title="Advanced options">
        <p className="px-4 pb-3 text-body-sm text-on-surface-variant">Build cache, output directory and Node version.</p>
      </Collapsible>
    </div>
  )
}
