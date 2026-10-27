import { AppShell1 } from "@/components/blocks/app-shell-1"
import { AppShell2 } from "@/components/blocks/app-shell-2"
import { AppShell3 } from "@/components/blocks/app-shell-3"
import { SidebarBlock1 } from "@/components/blocks/sidebar-block-1"
import { SidebarBlock2 } from "@/components/blocks/sidebar-block-2"
import { SidebarBlock3 } from "@/components/blocks/sidebar-block-3"
import { BlockDemo, BlockGroup } from "@/docs/block-demo"
import { BlocksLayout } from "@/docs/blocks-layout"

export const meta = { path: "/kit/blocks/shell" }

export default function BlocksShellPage() {
  return (
    <BlocksLayout
      title="Shell & navigation"
      description="The frame around every admin page: where navigation sits, how titles and environments switch, and what happens at compact widths. Every block is interactive and installs with the shadcn CLI."
    >
      <BlockGroup
        id="app-shell"
        title="App shell"
        description="Navigation, top bar and body pane for a live-ops console. Each one adapts from compact to large windows."
        count={3}
      >
        <BlockDemo
          id="app-shell-1"
          n={1}
          title="Rail + top bar"
          name="app-shell-1"
          description="Navigation rail with FAB and badges; title switcher, search and alerts in the top bar. Below 600px the rail becomes a bottom navigation bar."
        >
          <AppShell1 />
        </BlockDemo>
        <BlockDemo
          id="app-shell-2"
          n={2}
          title="Drawer + tabs"
          name="app-shell-2"
          description="Standard drawer with a title card and grouped destinations. Tabs filter the page. Below 840px the drawer opens as a modal from the menu button."
        >
          <AppShell2 />
        </BlockDemo>
        <BlockDemo
          id="app-shell-3"
          n={3}
          title="Top nav + environments"
          name="app-shell-3"
          description="Inverse top bar with horizontal destinations and a Production / Staging / Dev switch. Non-production environments get a persistent banner. Shown on an event detail page."
        >
          <AppShell3 />
        </BlockDemo>
      </BlockGroup>

      <BlockGroup
        id="sidebar"
        title="Sidebar"
        description="Persistent side navigation on its own: workspace switching, counts, collapse behavior and nested trees."
        count={3}
      >
        <BlockDemo
          id="sidebar-1"
          n={1}
          title="Grouped with meters"
          name="sidebar-block-1"
          frameClassName="h-[600px]"
          description="Workspace menu, jump-to search, grouped destinations with counts, a capacity meter and an account menu in the footer."
        >
          <SidebarBlock1 />
        </BlockDemo>
        <BlockDemo
          id="sidebar-2"
          n={2}
          title="Collapsible rail"
          name="sidebar-block-2"
          frameClassName="h-[600px]"
          description="Collapses from 288px to an icon rail and back. Nested groups turn into menus when collapsed."
        >
          <SidebarBlock2 />
        </BlockDemo>
        <BlockDemo
          id="sidebar-3"
          n={3}
          title="Title switcher + tree"
          name="sidebar-block-3"
          frameClassName="h-[600px]"
          description="Two levels: a narrow column of game titles and a contextual tree for the selected one. Titles morph from round to square when active; groups fold away."
        >
          <SidebarBlock3 />
        </BlockDemo>
      </BlockGroup>
    </BlocksLayout>
  )
}
