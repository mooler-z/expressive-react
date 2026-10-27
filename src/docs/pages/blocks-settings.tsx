import { Integrations1 } from "@/components/blocks/integrations-1"
import { Integrations2 } from "@/components/blocks/integrations-2"
import { Integrations3 } from "@/components/blocks/integrations-3"
import { MembersSettings1 } from "@/components/blocks/members-settings-1"
import { MembersSettings2 } from "@/components/blocks/members-settings-2"
import { MembersSettings3 } from "@/components/blocks/members-settings-3"
import { Notifications1 } from "@/components/blocks/notifications-1"
import { Notifications2 } from "@/components/blocks/notifications-2"
import { Notifications3 } from "@/components/blocks/notifications-3"
import { ProfileSettings1 } from "@/components/blocks/profile-settings-1"
import { ProfileSettings2 } from "@/components/blocks/profile-settings-2"
import { ProfileSettings3 } from "@/components/blocks/profile-settings-3"
import { BlockDemo, BlockGroup } from "@/docs/block-demo"
import { BlocksLayout } from "@/docs/blocks-layout"

export const meta = { path: "/kit/blocks/settings" }

const AUTO = "h-auto"

export default function BlocksSettingsPage() {
  return (
    <BlocksLayout
      title="Settings"
      description="Profile, team, notification and integration settings for a studio workspace. Save bars, role menus, matrices, rule builders and key creation all work."
    >
      <BlockGroup
        id="profile-settings"
        title="Profile settings"
        description="Personal details for a staff account: a sectioned form with a save bar, tabbed account settings, and a read-first card with a guarded danger zone."
        count={3}
      >
        <BlockDemo
          id="profile-settings-1"
          n={1}
          title="Sectioned form"
          name="profile-settings-1"
          frameClassName={AUTO}
          description="Descriptions on the left, fields on the right. Editing anything raises a sticky save bar; the photo picker previews a local image."
        >
          <ProfileSettings1 />
        </BlockDemo>
        <BlockDemo
          id="profile-settings-2"
          n={2}
          title="Vertical tabs"
          name="profile-settings-2"
          frameClassName={AUTO}
          description="Four tabs on the left that become a horizontal row on compact. Other sessions can be signed out one at a time."
        >
          <ProfileSettings2 changePasswordHref="/kit/blocks/auth#reset-2" manageTwoFactorHref="/kit/blocks/auth#two-factor-3" />
        </BlockDemo>
        <BlockDemo
          id="profile-settings-3"
          n={3}
          title="Inline edit + danger zone"
          name="profile-settings-3"
          frameClassName={AUTO}
          description="A read-first card that turns into fields on Edit. Deleting the account asks you to type DELETE before the button unlocks."
        >
          <ProfileSettings3 />
        </BlockDemo>
      </BlockGroup>

      <BlockGroup
        id="members-settings"
        title="Members settings"
        description="Who's in the workspace and what they can do: member roles with pending invites, a permission matrix, and seat usage by team."
        count={3}
      >
        <BlockDemo
          id="members-settings-1"
          n={1}
          title="Members & invites"
          name="members-settings-1"
          frameClassName={AUTO}
          description="Search, presence dots, a role menu with descriptions on every row, removal with undo, and pending invites to resend or revoke."
        >
          <MembersSettings1 inviteHref="/kit/blocks/people#invite-user-1" />
        </BlockDemo>
        <BlockDemo
          id="members-settings-2"
          n={2}
          title="Roles matrix"
          name="members-settings-2"
          frameClassName={AUTO}
          description="Permissions grouped by area against every role, with headcounts per role. Owner is fixed; any change raises a save bar."
        >
          <MembersSettings2 />
        </BlockDemo>
        <BlockDemo
          id="members-settings-3"
          n={3}
          title="Seats & teams"
          name="members-settings-3"
          frameClassName={AUTO}
          description="Seat usage for the plan above team cards. Adding a member takes a seat; when they run out the meter turns red and prompts for more."
        >
          <MembersSettings3 />
        </BlockDemo>
      </BlockGroup>

      <BlockGroup
        id="notification-settings"
        title="Notification settings"
        description="Per-channel preferences, grouped switches with quiet hours and a digest, and metric alert rules with a builder."
        count={3}
      >
        <BlockDemo
          id="notifications-1"
          n={1}
          title="Channel matrix"
          name="notifications-1"
          frameClassName={AUTO}
          description="Events down the side, Email, Push and Slack across the top. Each column header turns its whole column on or off."
        >
          <Notifications1 />
        </BlockDemo>
        <BlockDemo
          id="notifications-2"
          n={2}
          title="Switches + quiet hours"
          name="notifications-2"
          frameClassName={AUTO}
          description="Grouped switches with descriptions (incidents are locked on for on-call), quiet hours with a time range and days, and digest frequency."
        >
          <Notifications2 />
        </BlockDemo>
        <BlockDemo
          id="notifications-3"
          n={3}
          title="Alert rules"
          name="notifications-3"
          frameClassName={AUTO}
          description="Threshold rules written as sentences, each with a severity, an on/off switch and delete with undo. New rule opens an inline builder."
        >
          <Notifications3 />
        </BlockDemo>
      </BlockGroup>

      <BlockGroup
        id="integration-settings"
        title="Integration settings"
        description="Storefronts, alerting and analytics connections: a filterable catalog, one integration's routing and delivery log, and API keys."
        count={3}
      >
        <BlockDemo
          id="integrations-1"
          n={1}
          title="Integration grid"
          name="integrations-1"
          frameClassName={AUTO}
          description="Category filter chips over integration cards. Connect runs a short pending state; disconnect offers undo."
        >
          <Integrations1 />
        </BlockDemo>
        <BlockDemo
          id="integrations-2"
          n={2}
          title="Slack routing"
          name="integrations-2"
          frameClassName={AUTO}
          description="One connected integration: workspace header, a channel per alert type, a test message, and recent deliveries with retry for failures."
        >
          <Integrations2 />
        </BlockDemo>
        <BlockDemo
          id="integrations-3"
          n={3}
          title="API keys"
          name="integrations-3"
          frameClassName={AUTO}
          description="Masked keys with reveal, copy and revoke. Creating a key picks a name, scopes and expiry, then shows the full key once."
        >
          <Integrations3 />
        </BlockDemo>
      </BlockGroup>
    </BlocksLayout>
  )
}
