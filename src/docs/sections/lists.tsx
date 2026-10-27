import { Avatar } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Divider } from "@/components/ui/divider"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { InteractiveList, InteractiveListItem, List, ListItem, ListItemMedia } from "@/components/ui/list"
import { Switch } from "@/components/ui/switch"
import { Section, Variant, Variants } from "@/docs/section"

export default function ListsSection() {
  return (
    <Section
      id="lists"
      description="One-line (56dp), two-line (72dp), three-line (88dp). Leading avatars, icons or images; trailing meta, checkbox or switch."
      spec="https://m3.material.io/components/lists/overview"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <InteractiveList aria-label="Messages" selectionMode="multiple" className="overflow-hidden rounded-md bg-surface">
          <InteractiveListItem id="maya" leading={<Avatar name="Maya Lindqvist" fallback="M" />} trailingText="09:41">
            Maya Lindqvist
          </InteractiveListItem>
          <InteractiveListItem
            id="jonah"
            leading={<Avatar name="Jonah Park" fallback="J" color="tertiary" />}
            supportingText="Deploy pipeline is green again 🎉"
            trailingText="Yesterday"
          >
            Jonah Park
          </InteractiveListItem>
          <InteractiveListItem
            id="q3"
            lines={3}
            leading={
              <ListItemMedia className="bg-secondary-container text-on-secondary-container">
                <Icon>description</Icon>
              </ListItemMedia>
            }
            supportingText="Three-line list items hold a headline plus two lines of supporting text. Keep trailing text short."
            trailingText="2.4 MB"
          >
            Q3 infrastructure review
          </InteractiveListItem>
        </InteractiveList>

        <List className="rounded-md bg-surface">
          <ListItem leading={<Icon>wifi</Icon>} supportingText="Kestrel-Guest" trailing={<Switch defaultSelected aria-label="Wi-Fi" />}>
            Wi-Fi
          </ListItem>
          <li role="none"><Divider inset="start" /></li>
          <ListItem leading={<Icon>bluetooth</Icon>} trailing={<Switch aria-label="Bluetooth" />}>
            Bluetooth
          </ListItem>
          <li role="none"><Divider inset="start" /></li>
          <ListItem
            leading={<Checkbox defaultSelected aria-label="Email digests" className="-m-3" />}
            supportingText="Weekly on Monday"
            trailing={<Icon>chevron_right</Icon>}
          >
            Email digests
          </ListItem>
          <li role="none"><Divider inset="start" /></li>
          <ListItem
            leading={
              <span className="grid size-10 place-items-center rounded-md bg-primary-fixed-dim text-on-primary-fixed">
                <Icon>image</Icon>
              </span>
            }
            supportingText="Leading 56dp media also allowed"
            trailing={
              <IconButton aria-label="More">
                <Icon>more_vert</Icon>
              </IconButton>
            }
          >
            Image thumbnail
          </ListItem>
        </List>
      </div>

      <Variants cols="md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        <Variant n={1} label="Contacts" className="contents">
          <InteractiveList aria-label="Contacts" className="overflow-hidden rounded-lg bg-surface py-1">
            {[
              ["Maya Lindqvist", "On call · checkout", "primary"],
              ["Jonah Park", "Platform", "tertiary"],
              ["Ava Reyes", "Architecture", "secondary"],
            ].map(([name, role, color]) => (
              <InteractiveListItem
                key={name}
                id={name}
                textValue={name}
                leading={<Avatar name={name} color={color as "primary"} className="text-label-lg" />}
                supportingText={role}
                trailing={
                  <IconButton aria-label={`Call ${name}`} className="text-primary">
                    <Icon size={20}>call</Icon>
                  </IconButton>
                }
              >
                {name}
              </InteractiveListItem>
            ))}
          </InteractiveList>
        </Variant>

        <Variant n={2} label="Navigation" className="contents">
          <InteractiveList aria-label="Settings" className="overflow-hidden rounded-lg bg-surface py-1" onAction={() => {}}>
            {[
              ["General", "tune", "bg-primary-container text-on-primary-container"],
              ["Security", "shield", "bg-tertiary-container text-on-tertiary-container"],
              ["Billing", "credit_card", "bg-secondary-container text-on-secondary-container"],
            ].map(([label, icon, tone]) => (
              <InteractiveListItem
                key={label}
                id={label}
                leading={
                  <span className={`grid size-10 place-items-center rounded-md [--icon-size:20px] ${tone}`}>
                    <Icon>{icon}</Icon>
                  </span>
                }
                trailing={<Icon>chevron_right</Icon>}
              >
                {label}
              </InteractiveListItem>
            ))}
          </InteractiveList>
        </Variant>

        <Variant n={3} label="Media" className="contents">
          <InteractiveList aria-label="Videos" variant="segmented" onAction={() => {}}>
            {[
              ["Edge regions explained", "12:04", "bg-primary-container text-on-primary-container"],
              ["Policy in 5 minutes", "5:11", "bg-tertiary-container text-on-tertiary-container"],
              ["Rollback drills", "8:47", "bg-secondary-container text-on-secondary-container"],
            ].map(([title, dur, tone]) => (
              <InteractiveListItem
                key={title}
                id={title}
                className="[&_[data-slot=list-item-headline]]:text-body-md"
                leading={
                  <ListItemMedia variant="video" className={tone}>
                    <Icon filled>play_arrow</Icon>
                    <span className="absolute right-1 bottom-1 rounded-xs bg-scrim/70 px-1 text-label-sm text-white">{dur}</span>
                  </ListItemMedia>
                }
              >
                {title}
              </InteractiveListItem>
            ))}
          </InteractiveList>
        </Variant>

        <Variant n={4} label="Checklist" className="contents">
          <InteractiveList
            aria-label="Setup checklist"
            selectionMode="multiple"
            selectionBehavior="toggle"
            defaultSelectedKeys={["connect", "import"]}
            className="rounded-lg bg-surface py-1"
          >
            {[
              ["connect", "Connect a cloud account"],
              ["import", "Import ownership from GitHub"],
              ["policy", "Enable a policy"],
              ["invite", "Invite your team"],
            ].map(([id, label]) => (
              <InteractiveListItem
                key={id}
                id={id}
                className="data-selected:bg-transparent data-selected:text-on-surface-variant [&[data-selected]_[data-slot=list-item-headline]]:line-through"
                leading={<Checkbox slot="selection" className="-m-3" />}
              >
                {label}
              </InteractiveListItem>
            ))}
          </InteractiveList>
        </Variant>

        <Variant n={5} label="Expressive segmented" className="contents">
          <InteractiveList aria-label="Mailboxes" variant="segmented" selectionMode="single" disallowEmptySelection defaultSelectedKeys={["inbox"]}>
            {[
              ["inbox", "Inbox", "24"],
              ["starred", "Starred", ""],
              ["sent", "Sent", ""],
              ["drafts", "Drafts", "3"],
            ].map(([id, label, count]) => (
              <InteractiveListItem
                key={id}
                id={id}
                className="data-selected:[--icon-fill:1]"
                leading={<Icon>{id === "drafts" ? "draft" : id === "sent" ? "send" : id === "starred" ? "star" : "inbox"}</Icon>}
                trailingText={count ? <span className="text-label-md">{count}</span> : undefined}
              >
                {label}
              </InteractiveListItem>
            ))}
          </InteractiveList>
        </Variant>
      </Variants>
    </Section>
  )
}
