import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"

export default function CardVariants() {
  return (
    <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-3">
      <Card variant="elevated">
        <CardContent>
          <CardTitle>Elevated</CardTitle>
          <CardDescription className="mt-1">surface-container-low · level 1</CardDescription>
        </CardContent>
      </Card>
      <Card variant="filled">
        <CardContent>
          <CardTitle>Filled</CardTitle>
          <CardDescription className="mt-1">surface-container-highest · level 0</CardDescription>
        </CardContent>
      </Card>
      <Card variant="outlined">
        <CardContent>
          <CardTitle>Outlined</CardTitle>
          <CardDescription className="mt-1">surface · 1dp outline-variant</CardDescription>
        </CardContent>
      </Card>
    </div>
  )
}
