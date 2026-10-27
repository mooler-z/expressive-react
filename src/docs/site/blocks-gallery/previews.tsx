// registry name → full-page preview, rendered by /blocks/view/:name (the gallery's iframes).
// Demo props mirror the kit docs pages; cross-links point at other block views.

import * as React from "react"

import { AdminDashboard } from "@/components/blocks/admin/admin-dashboard"
import { AppShell1 } from "@/components/blocks/app-shell-1"
import { AppShell2 } from "@/components/blocks/app-shell-2"
import { AppShell3 } from "@/components/blocks/app-shell-3"
import { ChartCard1 } from "@/components/blocks/chart-card-1"
import { ChartCard2 } from "@/components/blocks/chart-card-2"
import { ChartCard3 } from "@/components/blocks/chart-card-3"
import { Dashboard1 } from "@/components/blocks/dashboard-1"
import { Dashboard2 } from "@/components/blocks/dashboard-2"
import { Dashboard3 } from "@/components/blocks/dashboard-3"
import { KitChartGrid } from "@/components/blocks/dashboard-kit/chart-card"
import { ChartStates } from "@/components/blocks/dashboard-kit/chart-states"
import { ComparisonCharts } from "@/components/blocks/dashboard-kit/comparison-charts"
import { CompositionCharts } from "@/components/blocks/dashboard-kit/composition-charts"
import { DashboardKit, DashboardKitFilterBar } from "@/components/blocks/dashboard-kit/dashboard-kit"
import { DashboardViz } from "@/components/blocks/dashboard-kit/dashboard-viz"
import { DataDisplay } from "@/components/blocks/dashboard-kit/data-display"
import { InteractiveCharts } from "@/components/blocks/dashboard-kit/interactive-charts"
import { DashboardKitProvider } from "@/components/blocks/dashboard-kit/kit-data"
import { KpiCards } from "@/components/blocks/dashboard-kit/kpi-cards"
import { RelationshipCharts } from "@/components/blocks/dashboard-kit/relationship-charts"
import { TREND_CHARTS, TrendCharts } from "@/components/blocks/dashboard-kit/trend-charts"
import { DataTableBlock1 } from "@/components/blocks/data-table-block-1"
import { DataTableBlock2 } from "@/components/blocks/data-table-block-2"
import { DataTableBlock3 } from "@/components/blocks/data-table-block-3"
import { Integrations1 } from "@/components/blocks/integrations-1"
import { Integrations2 } from "@/components/blocks/integrations-2"
import { Integrations3 } from "@/components/blocks/integrations-3"
import { InviteUser1 } from "@/components/blocks/invite-user-1"
import { InviteUser2 } from "@/components/blocks/invite-user-2"
import { InviteUser3 } from "@/components/blocks/invite-user-3"
import { Landing } from "@/components/blocks/landing/landing"
import { IncidentsApp } from "@/components/blocks/layouts/incidents-app"
import { Login1 } from "@/components/blocks/login-1"
import { Login2 } from "@/components/blocks/login-2"
import { Login3 } from "@/components/blocks/login-3"
import { LandingBento } from "@/components/blocks/marketing/landing-bento"
import { LandingCalculator } from "@/components/blocks/marketing/landing-calculator"
import { LandingEditorial } from "@/components/blocks/marketing/landing-editorial"
import { LandingGlobal } from "@/components/blocks/marketing/landing-global"
import { LandingMarquee } from "@/components/blocks/marketing/landing-marquee"
import { LandingOrbit } from "@/components/blocks/marketing/landing-orbit"
import { LandingPlayful } from "@/components/blocks/marketing/landing-playful"
import { LandingSplit } from "@/components/blocks/marketing/landing-split"
import { LandingSteps } from "@/components/blocks/marketing/landing-steps"
import { LandingTerminal } from "@/components/blocks/marketing/landing-terminal"
import { LandingV1 } from "@/components/blocks/marketing/landing-v1"
import { LandingV3 } from "@/components/blocks/marketing/landing-v3"
import { AboutPage } from "@/components/blocks/marketing/marketing-about"
import { ChangelogTimeline, SubscribeForm } from "@/components/blocks/marketing/marketing-changelog"
import { ContactPage } from "@/components/blocks/marketing/marketing-contact"
import { CtaBanner } from "@/components/blocks/marketing/marketing-cta-banner"
import { FeatureListDetail } from "@/components/blocks/marketing/marketing-feature-list-detail"
import {
  IntegrationsPreview,
  InventoryPreview,
  PolicyPreview,
  RolloutPreview,
  TracePreview,
} from "@/components/blocks/marketing/marketing-feature-previews"
import { FeatureRows } from "@/components/blocks/marketing/marketing-feature-rows"
import { HeroShowcase } from "@/components/blocks/marketing/marketing-hero-showcase"
import { PricingPage } from "@/components/blocks/marketing/marketing-pricing"
import { ProblemCards } from "@/components/blocks/marketing/marketing-problem-cards"
import { ProofBento } from "@/components/blocks/marketing/marketing-proof-bento"
import { BrandLogo, LogoCloud, SimpleFooter } from "@/components/blocks/marketing/marketing-shared"
import { MemberList1 } from "@/components/blocks/member-list-1"
import { MemberList2 } from "@/components/blocks/member-list-2"
import { MemberList3 } from "@/components/blocks/member-list-3"
import { MembersSettings1 } from "@/components/blocks/members-settings-1"
import { MembersSettings2 } from "@/components/blocks/members-settings-2"
import { MembersSettings3 } from "@/components/blocks/members-settings-3"
import { Notifications1 } from "@/components/blocks/notifications-1"
import { Notifications2 } from "@/components/blocks/notifications-2"
import { Notifications3 } from "@/components/blocks/notifications-3"
import { ProfileSettings1 } from "@/components/blocks/profile-settings-1"
import { ProfileSettings2 } from "@/components/blocks/profile-settings-2"
import { ProfileSettings3 } from "@/components/blocks/profile-settings-3"
import { Reset1 } from "@/components/blocks/reset-1"
import { Reset2 } from "@/components/blocks/reset-2"
import { Reset3 } from "@/components/blocks/reset-3"
import { SidebarBlock1 } from "@/components/blocks/sidebar-block-1"
import { SidebarBlock2 } from "@/components/blocks/sidebar-block-2"
import { SidebarBlock3 } from "@/components/blocks/sidebar-block-3"
import { Signup1 } from "@/components/blocks/signup-1"
import { Signup2 } from "@/components/blocks/signup-2"
import { Signup3 } from "@/components/blocks/signup-3"
import { Stats1 } from "@/components/blocks/stats-1"
import { Stats2 } from "@/components/blocks/stats-2"
import { Stats3 } from "@/components/blocks/stats-3"
import { TwoFactor1 } from "@/components/blocks/two-factor-1"
import { TwoFactor2 } from "@/components/blocks/two-factor-2"
import { TwoFactor3 } from "@/components/blocks/two-factor-3"
import { UserProfile1 } from "@/components/blocks/user-profile-1"
import { UserProfile2 } from "@/components/blocks/user-profile-2"
import { UserProfile3 } from "@/components/blocks/user-profile-3"
import { Verify1 } from "@/components/blocks/verify-1"
import { Verify2 } from "@/components/blocks/verify-2"
import { Verify3 } from "@/components/blocks/verify-3"
import { AdaptiveScaffoldDemo, FeedDemo, ListDetailDemo, PaneLayoutDemo, SupportingPaneDemo } from "@/docs/site/blocks-gallery/layout-demos"

const view = (name: string) => `/blocks/view/${name}`

/** Page padding for blocks that are sections or cards rather than whole pages. */
function Padded({ children, wide }: { children: React.ReactNode; wide?: boolean }) {
  return <div className={wide ? "mx-auto max-w-[1400px] px-4 py-8 md:px-8" : "mx-auto max-w-6xl px-4 py-8 md:px-8"}>{children}</div>
}

/** Dashboard-kit galleries share the kit's filter state. */
function Kit({ children }: { children: React.ReactNode }) {
  return (
    <DashboardKitProvider>
      <Padded wide>{children}</Padded>
    </DashboardKitProvider>
  )
}

function HelperNote({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Padded>
      <div className="rounded-xl border border-dashed border-outline-variant p-6">
        <h1 className="text-headline-sm">{title} · helper module</h1>
        <p className="mt-2 max-w-prose text-body-md text-on-surface-variant">
          Installed automatically as a dependency of the blocks that use it. A sample of what it provides:
        </p>
      </div>
      <div className="mt-8">{children}</div>
    </Padded>
  )
}

export const PREVIEWS: Record<string, () => React.ReactNode> = {
  // Templates
  landing: () => <Landing links={{ kit: "/kit", dashboard: view("admin-dashboard") }} />,
  "landing-v1": () => <LandingV1 />,
  "landing-v3": () => <LandingV3 />,
  "admin-dashboard": () => <AdminDashboard basePath="/admin" exitHref="/blocks" />,
  "dashboard-kit": () => (
    <Padded wide>
      <DashboardKit />
    </Padded>
  ),

  // Marketing sections
  "marketing-hero-showcase": () => <HeroShowcase />,
  "marketing-problem-cards": () => <ProblemCards />,
  "marketing-proof-bento": () => (
    <div className="py-8">
      <ProofBento />
    </div>
  ),
  "marketing-feature-previews": () => (
    <Padded>
      <div className="grid gap-6 md:grid-cols-2">
        <InventoryPreview />
        <PolicyPreview />
        <RolloutPreview />
        <TracePreview />
        <div className="md:col-span-2">
          <IntegrationsPreview />
        </div>
      </div>
    </Padded>
  ),
  "marketing-feature-rows": () => <FeatureRows />,
  "marketing-feature-list-detail": () => <FeatureListDetail />,
  "marketing-pricing": () => <PricingPage />,
  "marketing-about": () => <AboutPage />,
  "marketing-contact": () => <ContactPage />,
  "marketing-changelog": () => (
    <Padded>
      <SubscribeForm className="mb-10" />
      <ChangelogTimeline />
    </Padded>
  ),
  "marketing-cta-banner": () => (
    <div className="pt-12">
      <CtaBanner />
    </div>
  ),
  "marketing-shared": () => (
    <HelperNote title="Marketing · shared">
      <BrandLogo />
      <div className="mt-8">
        <LogoCloud />
      </div>
      <div className="mt-8">
        <SimpleFooter />
      </div>
    </HelperNote>
  ),
  "landing-orbit": () => <LandingOrbit />,
  "landing-bento": () => <LandingBento />,
  "landing-terminal": () => <LandingTerminal />,
  "landing-editorial": () => <LandingEditorial />,
  "landing-split": () => <LandingSplit />,
  "landing-marquee": () => <LandingMarquee />,
  "landing-global": () => <LandingGlobal />,
  "landing-steps": () => <LandingSteps />,
  "landing-calculator": () => <LandingCalculator />,
  "landing-playful": () => <LandingPlayful />,

  // Dashboard kit
  "kpi-cards": () => (
    <Kit>
      <KpiCards />
    </Kit>
  ),
  "interactive-chart-cards": () => (
    <Kit>
      <InteractiveCharts />
    </Kit>
  ),
  "trend-charts": () => (
    <Kit>
      <TrendCharts />
    </Kit>
  ),
  "comparison-charts": () => (
    <Kit>
      <ComparisonCharts />
    </Kit>
  ),
  "composition-charts": () => (
    <Kit>
      <CompositionCharts />
    </Kit>
  ),
  "relationship-charts": () => (
    <Kit>
      <RelationshipCharts />
    </Kit>
  ),
  "dashboard-viz": () => (
    <Kit>
      <DashboardViz />
    </Kit>
  ),
  "dashboard-data-display": () => (
    <Kit>
      <DataDisplay />
    </Kit>
  ),
  "chart-states": () => (
    <Kit>
      <ChartStates />
    </Kit>
  ),
  "dashboard-kit-core": () => (
    <DashboardKitProvider>
      <HelperNote title="Dashboard kit · core">
        <DashboardKitFilterBar />
        <KitChartGrid className="mt-6" specs={TREND_CHARTS.slice(0, 2)} />
      </HelperNote>
    </DashboardKitProvider>
  ),

  // Layouts
  "adaptive-scaffold": () => <AdaptiveScaffoldDemo />,
  "list-detail-layout": () => <ListDetailDemo />,
  "supporting-pane-layout": () => <SupportingPaneDemo />,
  "feed-layout": () => <FeedDemo />,
  "pane-layout": () => <PaneLayoutDemo />,
  "incidents-app": () => (
    <div className="flex h-dvh min-h-[520px] flex-col">
      <IncidentsApp className="flex-1" />
    </div>
  ),

  // Auth
  "login-1": () => <Login1 forgotPasswordHref={view("reset-1")} />,
  "login-2": () => <Login2 forgotPasswordHref={view("reset-1")} />,
  "login-3": () => <Login3 />,
  "signup-1": () => <Signup1 signInHref={view("login-1")} />,
  "signup-2": () => <Signup2 />,
  "signup-3": () => <Signup3 />,
  "reset-1": () => <Reset1 signInHref={view("login-1")} />,
  "reset-2": () => <Reset2 />,
  "reset-3": () => <Reset3 signInHref={view("login-1")} />,
  "two-factor-1": () => <TwoFactor1 cancelHref={view("login-1")} />,
  "two-factor-2": () => <TwoFactor2 />,
  "two-factor-3": () => <TwoFactor3 />,
  "verify-1": () => <Verify1 changeEmailHref={view("signup-1")} />,
  "verify-2": () => <Verify2 />,
  "verify-3": () => <Verify3 />,

  // Settings
  "profile-settings-1": () => <ProfileSettings1 />,
  "profile-settings-2": () => <ProfileSettings2 changePasswordHref={view("reset-2")} manageTwoFactorHref={view("two-factor-3")} />,
  "profile-settings-3": () => <ProfileSettings3 />,
  "members-settings-1": () => <MembersSettings1 inviteHref={view("invite-user-1")} />,
  "members-settings-2": () => <MembersSettings2 />,
  "members-settings-3": () => <MembersSettings3 />,
  "notifications-1": () => <Notifications1 />,
  "notifications-2": () => <Notifications2 />,
  "notifications-3": () => <Notifications3 />,
  "integrations-1": () => <Integrations1 />,
  "integrations-2": () => <Integrations2 />,
  "integrations-3": () => <Integrations3 />,

  // Shell
  "app-shell-1": () => <AppShell1 />,
  "app-shell-2": () => <AppShell2 />,
  "app-shell-3": () => <AppShell3 />,
  "sidebar-block-1": () => <SidebarBlock1 />,
  "sidebar-block-2": () => <SidebarBlock2 />,
  "sidebar-block-3": () => <SidebarBlock3 />,

  // Data
  "dashboard-1": () => <Dashboard1 />,
  "dashboard-2": () => <Dashboard2 />,
  "dashboard-3": () => <Dashboard3 />,
  "data-table-block-1": () => <DataTableBlock1 />,
  "data-table-block-2": () => <DataTableBlock2 />,
  "data-table-block-3": () => <DataTableBlock3 />,
  "stats-1": () => <Stats1 />,
  "stats-2": () => <Stats2 />,
  "stats-3": () => <Stats3 />,
  "chart-card-1": () => <ChartCard1 />,
  "chart-card-2": () => <ChartCard2 />,
  "chart-card-3": () => <ChartCard3 />,

  // People
  "invite-user-1": () => <InviteUser1 preview />,
  "invite-user-2": () => <InviteUser2 />,
  "invite-user-3": () => <InviteUser3 preview />,
  "user-profile-1": () => <UserProfile1 />,
  "user-profile-2": () => <UserProfile2 />,
  "user-profile-3": () => <UserProfile3 />,
  "member-list-1": () => <MemberList1 />,
  "member-list-2": () => <MemberList2 />,
  "member-list-3": () => <MemberList3 />,
}
