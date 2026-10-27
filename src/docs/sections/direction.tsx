import * as React from "react"

import { Button } from "@/components/ui/button"
import { DirectionProvider } from "@/components/ui/direction"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { LinearProgress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { snackbar } from "@/components/ui/snackbar"
import { TextField } from "@/components/ui/text-field"
import { Section, Variant, Variants } from "@/docs/section"

const COPY = {
  ltr: { title: "Settings", language: "Language", value: "English" },
  rtl: { title: "الإعدادات", language: "اللغة", value: "العربية" },
}

function SettingsCard({ dir }: { dir: "ltr" | "rtl" }) {
  const t = COPY[dir]
  return (
    <>
      <div className="flex h-16 items-center gap-1 ps-1 pe-2">
        <IconButton aria-label={dir === "rtl" ? "رجوع" : "Back"} size="md" width="narrow" onPress={() => snackbar("Back")}>
          <Icon className="rtl:-scale-x-100">arrow_back</Icon>
        </IconButton>
        <span className="flex-1 text-title-lg">{t.title}</span>
        <span className="grid size-8 place-items-center rounded-full bg-primary-container text-label-lg text-on-primary-container">K</span>
      </div>
      <ul className="divide-y divide-outline-variant">
        <li className="flex min-h-14 items-center gap-4 px-4 py-2 text-body-lg">
          <Icon className="text-on-surface-variant">language</Icon>
          <span className="flex-1">{t.language}</span>
          <span className="text-body-md text-on-surface-variant">{t.value}</span>
          <Icon className="text-on-surface-variant rtl:-scale-x-100">chevron_right</Icon>
        </li>
      </ul>
    </>
  )
}

function IconRow({ dir }: { dir: "ltr" | "rtl" }) {
  return (
    <DirectionProvider dir={dir} className="flex flex-wrap items-center gap-3">
      <span className="w-9 font-mono text-label-sm text-on-surface-variant uppercase">{dir}</span>
      <span className="flex gap-2 text-on-surface">
        {["arrow_forward", "send", "chevron_right", "undo"].map((i) => (
          <Icon key={i} className="rtl:-scale-x-100">
            {i}
          </Icon>
        ))}
      </span>
      <span className="h-6 w-px bg-outline-variant" />
      <span className="flex gap-2 text-on-surface-variant">
        {["check", "search", "play_arrow", "schedule"].map((i) => (
          <Icon key={i}>{i}</Icon>
        ))}
      </span>
    </DirectionProvider>
  )
}

export default function DirectionSection() {
  const [dir, setDir] = React.useState<"ltr" | "rtl">("rtl")
  return (
    <Section
      id="direction"
      description="Wrap a subtree in DirectionProvider: it sets dir for CSS and the locale React Aria uses for keyboard, sliders and dates. Use logical utilities (ps-* pe-* ms-* start-* text-start) and the layout mirrors; flip directional icons with rtl:-scale-x-100."
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <DirectionProvider dir="ltr" className="rounded-md bg-surface">
          <SettingsCard dir="ltr" />
          <div className="p-3">
            <Button variant="tonal" onPress={() => setDir((d) => (d === "rtl" ? "ltr" : "rtl"))}>
              <Icon>swap_horiz</Icon>
              Flip right card to {dir === "rtl" ? "LTR" : "RTL"}
            </Button>
          </div>
        </DirectionProvider>
        <DirectionProvider dir={dir} className="rounded-md bg-surface">
          <SettingsCard dir={dir} />
        </DirectionProvider>
      </div>

      <Variants cols="md:grid-cols-2">
        <Variant n={1} label="Mirrored icons" className="flex min-h-24 w-full flex-col gap-4 rounded-lg bg-surface p-4">
          <div className="flex gap-8 ps-12 text-label-sm text-on-surface-variant">
            <span>Mirror</span>
            <span className="ms-16">Never mirror</span>
          </div>
          <IconRow dir="ltr" />
          <IconRow dir="rtl" />
        </Variant>

        <Variant n={2} label="Bidi text · bdi" className="flex min-h-24 w-full flex-col gap-4 rounded-lg bg-surface p-4">
          <DirectionProvider dir="rtl">
            <p className="text-body-lg">
              تم نشر <bdi className="font-mono text-body-md text-primary">checkout-api 4.2.0</bdi> على <bdi>12</bdi> عنقودًا بواسطة{" "}
              <bdi>@maya</bdi>
            </p>
          </DirectionProvider>
          <p className="text-body-md text-on-surface-variant">
            Reviewed by <bdi className="text-on-surface">سارة العلي</bdi> · 2 comments
          </p>
          <p className="text-body-sm text-on-surface-variant">
            Wrap user-supplied names and versions in <code className="rounded-xs bg-surface-container-high px-1.5 py-0.5 font-mono">&lt;bdi&gt;</code>{" "}
            so punctuation stays put.
          </p>
        </Variant>

        <Variant n={3} label="Progress & slider fill" className="flex min-h-24 w-full flex-col gap-6 rounded-lg bg-surface p-4">
          {(["ltr", "rtl"] as const).map((d) => (
            <DirectionProvider key={d} dir={d} className="space-y-3">
              <div className="flex justify-between text-label-md">
                <span>{d === "rtl" ? "الرفع" : "Upload"}</span>
                <span className="text-on-surface-variant tabular-nums">62%</span>
              </div>
              <LinearProgress aria-label={d === "rtl" ? "الرفع" : "Upload"} value={62} />
              <Slider aria-label={d === "rtl" ? "مستوى الصوت" : "Volume"} defaultValue={62} size="sm" />
            </DirectionProvider>
          ))}
        </Variant>

        <Variant n={4} label="RTL form field" className="flex min-h-24 w-full flex-col gap-4 rounded-lg bg-surface p-4">
          <DirectionProvider dir="rtl" className="space-y-4">
            <TextField
              label="البريد الإلكتروني"
              defaultValue="maya@kestrel.io"
              leading="mail"
              description="سنرسل رمز التحقق إلى هذا العنوان"
              inputClassName="[direction:ltr] text-end"
            />
            <div className="flex justify-end gap-2">
              <Button variant="text">رجوع</Button>
              <Button className="ps-6 pe-4" onPress={() => snackbar("التالي")}>
                التالي
                <Icon className="rtl:-scale-x-100">arrow_forward</Icon>
              </Button>
            </div>
          </DirectionProvider>
        </Variant>
      </Variants>
    </Section>
  )
}
