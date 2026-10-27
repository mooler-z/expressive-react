import * as React from "react"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { snackbar } from "@/components/ui/snackbar"
import {
  DockedToolbar,
  DockedToolbarAction,
  FloatingToolbar,
  ToolbarButton,
  ToolbarFab,
  ToolbarToggleButton,
  ToolbarToggleGroup,
} from "@/components/ui/toolbar"
import { Section, Variant, Variants } from "@/docs/section"

export default function ToolbarsSection() {
  const [publishing, setPublishing] = React.useState(false)
  return (
    <Section
      id="toolbars"
      description="New in Expressive: floating toolbars (standard or vibrant, horizontal or vertical, optionally paired with a FAB) and docked toolbars that replace the bottom app bar for contextual actions. Arrow keys move between items."
      spec="https://m3.material.io/components/toolbars/overview"
    >
      <div className="flex flex-wrap items-center gap-6">
        <FloatingToolbar aria-label="Formatting">
          <ToolbarToggleGroup aria-label="Text style" selectionMode="multiple">
            {[
              ["bold", "format_bold"],
              ["italic", "format_italic"],
              ["bullets", "format_list_bulleted"],
              ["link", "link"],
            ].map(([id, icon]) => (
              <ToolbarToggleButton key={id} id={id} aria-label={id}>
                <Icon>{icon}</Icon>
              </ToolbarToggleButton>
            ))}
          </ToolbarToggleGroup>
          <IconButton
            variant="filled"
            aria-label="Send"
            className="ms-1"
            onPress={() => snackbar("Sent", { action: { label: "Undo", onAction: () => snackbar("Unsent") } })}
          >
            <Icon>send</Icon>
          </IconButton>
        </FloatingToolbar>

        <FloatingToolbar aria-label="Editing" color="vibrant">
          <ToolbarButton aria-label="Undo" onPress={() => snackbar("Undo")}>
            <Icon>undo</Icon>
          </ToolbarButton>
          <ToolbarButton aria-label="Redo" onPress={() => snackbar("Redo")}>
            <Icon>redo</Icon>
          </ToolbarButton>
          <Button
            isPending={publishing}
            onPress={() => {
              setPublishing(true)
              setTimeout(() => {
                setPublishing(false)
                snackbar("Published")
              }, 1600)
            }}
          >
            {!publishing && <Icon>publish</Icon>}
            {publishing ? "Publishing…" : "Publish"}
          </Button>
        </FloatingToolbar>

        <FloatingToolbar aria-label="Tools" orientation="vertical">
          <ToolbarToggleGroup aria-label="Tool" selectionMode="single" disallowEmptySelection defaultSelectedKeys={["select"]}>
            {[
              ["select", "near_me"],
              ["pan", "pan_tool"],
              ["shape", "rectangle"],
            ].map(([id, icon]) => (
              <ToolbarToggleButton key={id} id={id} aria-label={id}>
                <Icon>{icon}</Icon>
              </ToolbarToggleButton>
            ))}
          </ToolbarToggleGroup>
        </FloatingToolbar>
      </div>

      <DockedToolbar aria-label="Selection actions" className="rounded-md">
        <span className="ps-3 text-label-lg">Docked · 3 selected</span>
        <div className="flex items-center gap-1">
          <ToolbarButton aria-label="Archive" onPress={() => snackbar("Archived", { action: { label: "Undo", onAction: () => {} } })}>
            <Icon>archive</Icon>
          </ToolbarButton>
          <ToolbarButton aria-label="Delete" onPress={() => snackbar("Deleted", { action: { label: "Undo", onAction: () => {} } })}>
            <Icon>delete</Icon>
          </ToolbarButton>
          <ToolbarButton aria-label="Label" onPress={() => snackbar("Label added")}>
            <Icon>label</Icon>
          </ToolbarButton>
          <Button variant="tonal" onPress={() => snackbar("3 conversations marked read")}>
            Mark read
          </Button>
        </div>
      </DockedToolbar>

      <Variants>
        <Variant n={1} label="Floating · vibrant">
          <FloatingToolbar aria-label="Formatting" color="vibrant">
            <ToolbarToggleGroup aria-label="Text style" selectionMode="multiple" defaultSelectedKeys={["bold"]}>
              {[
                ["bold", "format_bold"],
                ["italic", "format_italic"],
                ["underline", "format_underlined"],
              ].map(([id, icon]) => (
                <ToolbarToggleButton key={id} id={id} aria-label={id}>
                  <Icon>{icon}</Icon>
                </ToolbarToggleButton>
              ))}
            </ToolbarToggleGroup>
            <ToolbarButton aria-label="Link">
              <Icon>link</Icon>
            </ToolbarButton>
            <ToolbarButton aria-label="More">
              <Icon>more_vert</Icon>
            </ToolbarButton>
          </FloatingToolbar>
        </Variant>
        <Variant n={2} label="Floating · vertical">
          <FloatingToolbar aria-label="Drawing" orientation="vertical">
            <ToolbarToggleGroup aria-label="Tool" selectionMode="single" disallowEmptySelection defaultSelectedKeys={["brush"]}>
              {[
                ["edit", "edit"],
                ["brush", "brush"],
                ["category", "category"],
              ].map(([id, icon]) => (
                <ToolbarToggleButton key={id} id={id} aria-label={id}>
                  <Icon>{icon}</Icon>
                </ToolbarToggleButton>
              ))}
            </ToolbarToggleGroup>
            <ToolbarButton aria-label="Undo">
              <Icon>undo</Icon>
            </ToolbarButton>
          </FloatingToolbar>
        </Variant>
        <Variant n={3} label="With FAB">
          <FloatingToolbar
            aria-label="Browser"
            fab={
              <ToolbarFab aria-label="New tab" onPress={() => snackbar("New tab")}>
                <Icon>add</Icon>
              </ToolbarFab>
            }
          >
            {[
              ["Back", "arrow_back"],
              ["Forward", "arrow_forward"],
              ["Refresh", "refresh"],
              ["Share", "ios_share"],
            ].map(([label, icon]) => (
              <ToolbarButton key={label} aria-label={label}>
                <Icon>{icon}</Icon>
              </ToolbarButton>
            ))}
          </FloatingToolbar>
        </Variant>
        <Variant n={4} label="Docked · labeled" className="flex min-h-40 flex-col justify-end overflow-hidden rounded-lg bg-surface">
          <DockedToolbar aria-label="Message actions" justify="around" className="h-20">
            <DockedToolbarAction icon="reply">Reply</DockedToolbarAction>
            <DockedToolbarAction icon="forward">Forward</DockedToolbarAction>
            <DockedToolbarAction icon="archive">Archive</DockedToolbarAction>
            <DockedToolbarAction icon="delete">Delete</DockedToolbarAction>
          </DockedToolbar>
        </Variant>
      </Variants>
    </Section>
  )
}
