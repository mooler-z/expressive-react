import { TracePipeline } from "@/components/ui/trace"

export default function TracePipelineExample() {
  return (
    <div className="w-full max-w-2xl rounded-xl bg-surface-container-low p-5">
      <TracePipeline
        stages={[
          { label: "Build", status: "success", meta: "1m 12s" },
          { label: "Test", status: "success", meta: "3m 40s" },
          { label: "Deploy", status: "running", meta: "2 of 3" },
          { label: "Verify", status: "pending" },
        ]}
      />
    </div>
  )
}
