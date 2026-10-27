import { CodeCommand } from "@/components/ui/code-block"
import { snackbar } from "@/components/ui/snackbar"

export default function CodeBlockCommand() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-3">
      <CodeCommand command="npx shadcn add @expressive/button" onCopied={() => snackbar("Command copied")} />
      <CodeCommand variant="inverse" prompt="❯" command="pnpm dlx shadcn add @expressive/init" onCopied={() => snackbar("Command copied")} />
    </div>
  )
}
