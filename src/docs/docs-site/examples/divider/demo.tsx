import { Divider } from "@/components/ui/divider"

export default function DividerDemo() {
  return (
    <div className="w-full max-w-md rounded-lg bg-surface-container-low py-2">
      <p className="px-4 py-3 text-body-lg">Inbox</p>
      <Divider />
      <p className="px-4 py-3 text-body-lg">Starred</p>
      <Divider inset="start" />
      <p className="px-4 py-3 text-body-lg">Snoozed</p>
      <Divider inset="middle" />
      <p className="px-4 py-3 text-body-lg">Archive</p>
    </div>
  )
}
