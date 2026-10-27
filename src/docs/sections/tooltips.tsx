import { Button as AriaButton } from "react-aria-components"

import { Button, buttonVariants } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { Popover, PopoverTrigger } from "@/components/ui/popover"
import { snackbar } from "@/components/ui/snackbar"
import { RichTooltip, RichTooltipActions, RichTooltipSubhead, Tooltip, TooltipTrigger, richTooltipStyles } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { Section, Variant, Variants } from "@/docs/section"

/** Static (always-visible) tooltip visuals for the variant tiles. */
const plain = "rounded-xs bg-inverse-surface px-2 py-1 text-body-sm text-inverse-on-surface"

export default function TooltipsSection() {
  return (
    <Section
      id="tooltips"
      description="Plain tooltips label an icon; rich tooltips add a subhead, body and actions. Hover or focus the icon buttons — tooltips wait 500ms, then follow focus between controls instantly."
      spec="https://m3.material.io/components/tooltips/overview"
    >
      <div className="flex flex-wrap items-start gap-12 pb-8">
        <TooltipTrigger>
          <IconButton aria-label="Bookmark">
            <Icon>bookmark</Icon>
          </IconButton>
          <Tooltip placement="bottom">Save to bookmarks</Tooltip>
        </TooltipTrigger>

        <div className="inline-flex items-center gap-2">
          <span className="text-body-md text-on-surface-variant">static:</span>
          <span className={plain}>Plain tooltip</span>
        </div>

        <TooltipTrigger>
          <IconButton aria-label="About rich tooltips">
            <Icon>info</Icon>
          </IconButton>
          <RichTooltip title="Rich tooltip" placement="bottom start">
            Rich tooltips bring attention to a particular element or feature that warrants the user's focus.
          </RichTooltip>
        </TooltipTrigger>

        <PopoverTrigger>
          <IconButton aria-label="Help with canaries" variant="tonal">
            <Icon>help</Icon>
          </IconButton>
          <Popover aria-label="Canary deploys" className={richTooltipStyles}>
            <RichTooltipSubhead>Rich tooltip · with actions</RichTooltipSubhead>
            <p>Actions make it interactive, so it opens on press as a popover and holds focus.</p>
            <RichTooltipActions>
              <Button variant="text" slot="close">Learn more</Button>
              <Button variant="text" slot="close">Dismiss</Button>
            </RichTooltipActions>
          </Popover>
        </PopoverTrigger>

        <div className={richTooltipStyles}>
          <RichTooltipSubhead>Rich tooltip · static</RichTooltipSubhead>
          <p>Supporting text up to three lines, with up to two text buttons.</p>
          <RichTooltipActions>
            <Button variant="text">Action</Button>
            <Button variant="text">Dismiss</Button>
          </RichTooltipActions>
        </div>
      </div>

      <Variants>
        <Variant n={1} label="Plain · multi-line">
          <span className={cn(plain, "max-w-[200px]")}>Grants read access to every project in this workspace</span>
        </Variant>
        <Variant n={2} label="Plain · below anchor">
          <div className="flex flex-col items-center gap-1">
            <IconButton aria-label="Share">
              <Icon>ios_share</Icon>
            </IconButton>
            <span className={plain}>Share</span>
          </div>
        </Variant>
        <Variant n={3} label="With shortcut">
          <TooltipTrigger>
            <IconButton aria-label="Bold">
              <Icon>format_bold</Icon>
            </IconButton>
            <Tooltip shortcut="⌘B">Bold</Tooltip>
          </TooltipTrigger>
          <TooltipTrigger>
            <IconButton aria-label="Search">
              <Icon>search</Icon>
            </IconButton>
            <Tooltip shortcut="/">Search</Tooltip>
          </TooltipTrigger>
        </Variant>
        <Variant n={4} label="Rich · body only">
          <div className={richTooltipStyles}>
            <p>Canary runs on 5% of traffic for 30 minutes before promotion.</p>
            <RichTooltipActions>
              <Button variant="text">Learn more</Button>
            </RichTooltipActions>
          </div>
        </Variant>
        <Variant n={5} label="Rich · onboarding" className="flex min-h-24 flex-col items-start justify-center gap-2 rounded-lg bg-surface p-4">
          <Button variant="tonal" className="ring-2 ring-primary ring-offset-2 ring-offset-surface">
            <Icon>splitscreen</Icon>
            Split view
          </Button>
          <div className={cn(richTooltipStyles, "w-full")}>
            <RichTooltipSubhead>New: split view</RichTooltipSubhead>
            <p>Compare two deploys side by side.</p>
            <RichTooltipActions>
              <Button variant="text">Dismiss</Button>
              <Button variant="text">Try it</Button>
            </RichTooltipActions>
          </div>
        </Variant>
        <Variant n={6} label="On a disabled control">
          <TooltipTrigger>
            {/* aria-disabled (not disabled) keeps it focusable and hoverable, so the tooltip can explain why.
                Disabled tokens applied directly: React Aria only sets data-disabled for isDisabled. */}
            <AriaButton
              aria-disabled="true"
              className={cn(buttonVariants(), "bg-on-surface/10 text-on-surface/38 shadow-none after:hidden", "cursor-not-allowed !pointer-events-auto")}
            >
              Delete project
            </AriaButton>
            <Tooltip placement="bottom">Requires the Owner role</Tooltip>
          </TooltipTrigger>
        </Variant>
        <Variant n={7} label="Truncated label">
          <TooltipTrigger>
            <AriaButton
              aria-label="Copy payments-reconciliation-worker-eu-central-1"
              onPress={() => {
                void navigator.clipboard?.writeText("payments-reconciliation-worker-eu-central-1")
                snackbar("Service name copied")
              }}
              className="state-layer focus-ring max-w-full min-w-0 cursor-pointer truncate rounded-xs bg-surface-container-high px-3 py-2 text-start font-mono text-body-sm"
            >
              payments-reconciliation-worker-eu-central-1
            </AriaButton>
            <Tooltip placement="bottom" className="max-w-[280px] break-all">
              payments-reconciliation-worker-eu-central-1
            </Tooltip>
          </TooltipTrigger>
        </Variant>
        <Variant n={8} label="Hover · 500ms delay">
          <TooltipTrigger>
            <IconButton aria-label="History">
              <Icon>history</Icon>
            </IconButton>
            <Tooltip placement="bottom">Version history</Tooltip>
          </TooltipTrigger>
        </Variant>
      </Variants>
    </Section>
  )
}
