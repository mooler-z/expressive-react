import { CodeBlock } from "@/components/ui/code-block"

const patch = ` export default {
-  timeout: 30_000,
+  timeout: 10_000,
+  retries: 3,
   region: "eu-central-1",
 }`

export default function CodeBlockDiff() {
  return <CodeBlock className="w-full max-w-xl" filename="deploy.config.ts" diff code={patch} />
}
