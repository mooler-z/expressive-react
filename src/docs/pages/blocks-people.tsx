import { InviteUser1 } from "@/components/blocks/invite-user-1"
import { InviteUser2 } from "@/components/blocks/invite-user-2"
import { InviteUser3 } from "@/components/blocks/invite-user-3"
import { UserProfile1 } from "@/components/blocks/user-profile-1"
import { UserProfile2 } from "@/components/blocks/user-profile-2"
import { UserProfile3 } from "@/components/blocks/user-profile-3"
import { MemberList1 } from "@/components/blocks/member-list-1"
import { MemberList2 } from "@/components/blocks/member-list-2"
import { MemberList3 } from "@/components/blocks/member-list-3"
import { BlockDemo, BlockGroup } from "@/docs/block-demo"
import { BlocksLayout } from "@/docs/blocks-layout"

export const meta = { path: "/kit/blocks/people" }

export default function BlocksPeoplePage() {
  return (
    <BlocksLayout
      title="People"
      description="Inviting staff, looking up players and teammates, and browsing the studio directory. Chip inputs, parsing, tabs, timelines and filters all work."
    >
      <BlockGroup id="invite-user" title="Invite user" description="Bringing staff and partners into the workspace: a quick dialog, bulk lists and shareable links, and a side sheet that scopes access per title." count={3}>
        <BlockDemo id="invite-user-1" n={1} title="Dialog · email chips" name="invite-user-1" frameClassName="h-auto" description={"Addresses turn into chips on Enter, comma or space, and pasted lists split automatically. Invalid ones turn red and block sending."}>
          <InviteUser1 preview />
        </BlockDemo>
        <BlockDemo id="invite-user-2" n={2} title="Bulk list or link" name="invite-user-2" frameClassName="h-auto" description={"Paste \"email, role\" lines and see them parsed live, or share a join link with a role, expiry and an off switch."}>
          <InviteUser2 />
        </BlockDemo>
        <BlockDemo id="invite-user-3" n={3} title="Side sheet · access" name="invite-user-3" frameClassName="h-auto" description={"A modal side sheet with role cards and per-title access. The footer summarises what the invite grants."}>
          <InviteUser3 preview />
        </BlockDemo>
      </BlockGroup>
      <BlockGroup id="user-profile" title="User profile" description="Profiles for the two kinds of people in a live-ops console: players, seen by support and moderation, and staff." count={3}>
        <BlockDemo id="user-profile-1" n={1} title="Player · header + tabs" name="user-profile-1" frameClassName="h-auto" description={"Identity, status and actions in the header; overview, purchases with refunds, matches and reports in tabs. Ban asks for a duration and reason."}>
          <UserProfile1 />
        </BlockDemo>
        <BlockDemo id="user-profile-2" n={2} title="Player · support timeline" name="user-profile-2" frameClassName="h-auto" description={"Key facts and open tickets on the left, a filterable activity timeline on the right. Internal notes post straight into the timeline."}>
          <UserProfile2 />
        </BlockDemo>
        <BlockDemo id="user-profile-3" n={3} title="Staff member" name="user-profile-3" frameClassName="h-auto" description={"A teammate's page: local time, on-call status, contact and page actions, what their role allows, and recent audit-log activity."}>
          <UserProfile3 />
        </BlockDemo>
      </BlockGroup>
      <BlockGroup id="member-list" title="Member list" description="Browsing the studio: a filterable list with row actions, presence cards with an on-call filter, and a directory grouped by team." count={3}>
        <BlockDemo id="member-list-1" n={1} title="List · role filter" name="member-list-1" frameClassName="h-auto" description={"Search across name, title and team, role filter chips, presence and local time on each row, and a row menu."}>
          <MemberList1 />
        </BlockDemo>
        <BlockDemo id="member-list-2" n={2} title="Cards · on call" name="member-list-2" frameClassName="h-auto" description={"Presence cards with local time and quick actions. The switch narrows the grid to whoever is on call right now."}>
          <MemberList2 />
        </BlockDemo>
        <BlockDemo id="member-list-3" n={3} title="Directory by team" name="member-list-3" frameClassName="h-auto" description={"A compact two-column directory with sticky team headers inside a scroll area. The chips above jump to a team."}>
          <MemberList3 />
        </BlockDemo>
      </BlockGroup>
    </BlocksLayout>
  )
}
