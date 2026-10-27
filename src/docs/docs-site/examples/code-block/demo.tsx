import { CodeBlock } from "@/components/ui/code-block"
import { snackbar } from "@/components/ui/snackbar"

const code = `import { Button } from "@/components/ui/button"

export function Save() {
  return <Button onPress={() => save()}>Save changes</Button>
}`

export default function CodeBlockDemo() {
  return (
    <CodeBlock
      className="w-full max-w-xl"
      filename="components/save.tsx"
      language="tsx"
      lineNumbers
      code={code}
      onCopied={() => snackbar("Copied to clipboard")}
    />
  )
}
