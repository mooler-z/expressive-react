import { CodeBlock } from "@/components/ui/code-block"

const snippets = [
  { label: "cURL", code: `curl https://api.kestrel.io/v1/deploys \\\n  -H "Authorization: Bearer $TOKEN"` },
  { label: "JavaScript", code: `const res = await fetch("https://api.kestrel.io/v1/deploys", {\n  headers: { Authorization: \`Bearer \${token}\` },\n})` },
  { label: "Python", code: `requests.get(\n    "https://api.kestrel.io/v1/deploys",\n    headers={"Authorization": f"Bearer {token}"},\n)` },
]

export default function CodeBlockTabs() {
  return <CodeBlock className="w-full max-w-xl" snippets={snippets} filename="List deploys" />
}
