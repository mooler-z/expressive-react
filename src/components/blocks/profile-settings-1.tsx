"use client"

import * as React from "react"
import { FileTrigger } from "react-aria-components"

import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { StatusBadge } from "@/components/ui/badge"
import { Select, SelectItem } from "@/components/ui/select"
import { snackbar } from "@/components/ui/snackbar"
import { TextField } from "@/components/ui/text-field"
import { cn } from "@/lib/utils"

/*
 * Profile settings 01 · Sectioned form
 * Descriptions on the left, fields on the right. Editing anything raises a sticky save bar;
 * the photo picker previews a local image.
 */

export interface ProfileSettings1Values {
  displayName: string
  jobTitle: string
  bio: string
  timeZone: string
  language: string
  photo: File | null
}

export interface ProfileSettings1Props {
  onSave?: (values: ProfileSettings1Values) => void | Promise<void>
  className?: string
}

const TIME_ZONES = ["Los Angeles (UTC−7)", "New York (UTC−4)", "London (UTC+0)", "Stockholm (UTC+1)", "Tokyo (UTC+9)"]
const LANGUAGES = ["English (US)", "English (UK)", "Deutsch", "日本語", "Português (Brasil)"]

export function ProfileSettings1({ onSave, className }: ProfileSettings1Props) {
  const formRef = React.useRef<HTMLFormElement>(null)
  const [dirty, setDirty] = React.useState(false)
  const [photo, setPhoto] = React.useState<{ file: File; url: string } | null>(null)
  const [timeZone, setTimeZone] = React.useState("Stockholm (UTC+1)")
  const [language, setLanguage] = React.useState("English (US)")
  const [saving, setSaving] = React.useState(false)

  React.useEffect(
    () => () => {
      if (photo) URL.revokeObjectURL(photo.url)
    },
    [photo],
  )

  const pick = (files: FileList | null) => {
    const file = files?.[0]
    if (!file) return
    setPhoto({ file, url: URL.createObjectURL(file) })
    setDirty(true)
    snackbar(`Photo ready · ${file.name}`)
  }

  const save = async () => {
    const form = formRef.current
    if (!form) return
    const data = new FormData(form)
    setSaving(true)
    try {
      await onSave?.({
        displayName: String(data.get("displayName")),
        jobTitle: String(data.get("jobTitle")),
        bio: String(data.get("bio")),
        timeZone,
        language,
        photo: photo?.file ?? null,
      })
      setDirty(false)
      snackbar("Profile saved")
    } finally {
      setSaving(false)
    }
  }

  const discard = () => {
    formRef.current?.reset()
    setPhoto(null)
    setTimeZone("Stockholm (UTC+1)")
    setLanguage("English (US)")
    setDirty(false)
    snackbar("Changes discarded")
  }

  return (
    <div className={cn("relative max-h-[680px] overflow-y-auto bg-surface", className)}>
      <form
        ref={formRef}
        onChange={() => setDirty(true)}
        onSubmit={(e) => {
          e.preventDefault()
          save()
        }}
        className="divide-y divide-outline-variant px-4 md:px-8">
        <Row title="Profile" description="Shown to teammates on events you create and in the audit log.">
          <div className="flex flex-wrap items-center gap-4">
            <Avatar size="xl" name="Maya Ortiz" color="tertiary" src={photo?.url} className="size-20" />
            <div className="flex flex-wrap gap-2">
              <FileTrigger acceptedFileTypes={["image/png", "image/jpeg"]} onSelect={pick}>
                <Button variant="tonal" className="pr-4 pl-3">
                  <Icon>upload</Icon>
                  Upload photo
                </Button>
              </FileTrigger>
              <Button
                variant="text"
                isDisabled={!photo}
                onPress={() => {
                  setPhoto(null)
                  setDirty(true)
                }}
              >
                Remove
              </Button>
            </div>
            <p className="w-full text-body-sm text-on-surface-variant">PNG or JPG, at least 256 × 256 px.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField name="displayName" label="Display name" defaultValue="Maya Ortiz" isRequired errorMessage="Enter a display name" />
            <TextField name="jobTitle" label="Job title" defaultValue="Live ops lead" />
          </div>
          <TextField
            name="bio"
            label="Bio"
            multiline
            rows={3}
            maxLength={160}
            showCount
            description="Appears on your profile card"
            defaultValue="Runs seasons and live events for Ember Tactics. Ask me about Frostfire."
          />
        </Row>
        <Row title="Contact & region" description="Used for alerts, digests and the times shown across Lumen.">
          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-outline-variant p-4">
            <Icon className="text-on-surface-variant">mail</Icon>
            <div className="min-w-0 flex-1">
              <div className="truncate text-body-lg">maya@cinder.gg</div>
              <div className="text-body-sm text-on-surface-variant">Primary email · used for sign-in</div>
            </div>
            <StatusBadge variant="primary-container" size="md">
              <Icon>verified</Icon>
              Verified
            </StatusBadge>
            <Button variant="text" size="xs" className="h-9" onPress={() => snackbar("We'll send a confirmation link to the new address")}>
              Change
            </Button>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Select
              label="Time zone"
              selectedKey={timeZone}
              onSelectionChange={(k) => {
                setTimeZone(String(k))
                setDirty(true)
              }}
            >
              {TIME_ZONES.map((z) => (
                <SelectItem key={z} id={z}>
                  {z}
                </SelectItem>
              ))}
            </Select>
            <Select
              label="Language"
              selectedKey={language}
              onSelectionChange={(k) => {
                setLanguage(String(k))
                setDirty(true)
              }}
            >
              {LANGUAGES.map((l) => (
                <SelectItem key={l} id={l}>
                  {l}
                </SelectItem>
              ))}
            </Select>
          </div>
        </Row>
      </form>
      {dirty && (
        <div role="region" aria-label="Unsaved changes" className="sticky bottom-0 flex animate-fade-up flex-wrap items-center gap-3 border-t border-outline-variant bg-surface-container px-4 py-3 md:px-8">
          <Icon className="text-on-surface-variant">edit_note</Icon>
          <span className="flex-1 text-body-md">You have unsaved changes</span>
          <Button variant="text" onPress={discard}>
            Discard
          </Button>
          <Button isPending={saving} onPress={save}>
            Save changes
          </Button>
        </div>
      )}
    </div>
  )
}

function Row({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-6 py-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
      <div>
        <h3 className="text-title-lg font-medium">{title}</h3>
        <p className="mt-1 text-body-md text-on-surface-variant">{description}</p>
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  )
}
