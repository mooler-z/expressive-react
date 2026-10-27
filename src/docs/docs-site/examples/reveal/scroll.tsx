import { Icon } from "@/components/ui/icon"
import { Reveal } from "@/components/ui/reveal"

const items = [
  { icon: "bolt", title: "Fast", body: "Springs, not curves." },
  { icon: "palette", title: "Themable", body: "Any seed, any scheme." },
  { icon: "accessibility_new", title: "Accessible", body: "React Aria underneath." },
]

export default function RevealScroll() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-3">
      {items.map((item, i) => (
        <Reveal key={item.title} delay={i * 90} className="rounded-xl bg-surface-container-low p-6">
          <Icon name={item.icon} className="text-primary" />
          <h3 className="mt-3 text-title-md">{item.title}</h3>
          <p className="text-body-md text-on-surface-variant">{item.body}</p>
        </Reveal>
      ))}
    </div>
  )
}
