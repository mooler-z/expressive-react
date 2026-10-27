/*
 * Admin portal · demo data (port of the kit's Admin Dashboard data + generators).
 * Deterministic: a seeded RNG keeps charts and tables stable between renders.
 */

export type RangeKey = "7d" | "30d" | "90d" | "12m"

export const RANGES: Record<RangeKey, { n: number; label: string; mult: number; lab: (i: number) => string }> = {
  "7d": { n: 7, label: "7 days", mult: 1, lab: (i) => ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i] },
  "30d": { n: 30, label: "30 days", mult: 1, lab: (i) => "Oct " + (i + 1) },
  "90d": { n: 13, label: "90 days", mult: 7, lab: (i) => "W" + (31 + i) },
  "12m": { n: 12, label: "12 months", mult: 30, lab: (i) => ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"][i] },
}

export function rangeLabels(range: RangeKey) {
  const r = RANGES[range]
  return Array.from({ length: r.n }, (_, i) => r.lab(i))
}

/** Seeded RNG (xmur3-style hash), identical to the kit so numbers match. */
export function rng(str: string) {
  let h = 1779033703 ^ str.length
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    return ((h ^= h >>> 16) >>> 0) / 4294967296
  }
}

export function series(key: string, base: number, amp: number, trend = 0.01, n: number, salt = "") {
  const r = rng(key + salt)
  return Array.from({ length: n }, (_, i) => Math.max(0, Math.round(base * (1 + trend * i) + (r() - 0.5) * amp)))
}

/** Smooth wave used by several report charts. */
export function wave(n: number, b: number, a: number, ph: number) {
  return Array.from({ length: n }, (_, i) => Math.round(b + a * Math.sin(i / 2.2 + ph) + a * 0.4 * Math.cos(i * 1.3 + ph)))
}

export const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US")
export const moneyK = (v: number) => (v >= 1000 ? "$" + (v / 1000).toFixed(1) + "M" : "$" + Math.round(v) + "k")

export const AVATAR_TONES = [
  "bg-primary-container text-on-primary-container",
  "bg-tertiary-container text-on-tertiary-container",
  "bg-secondary-container text-on-secondary-container",
  "bg-primary-fixed-dim text-on-primary-fixed",
]

export type Status = "Active" | "Paid" | "Invited" | "Pending" | "Suspended" | "Overdue" | "Refunded"

export const STATUS_STYLE: Record<Status, [badge: string, dot: string]> = {
  Active: ["bg-tertiary-container text-on-tertiary-container", "bg-tertiary"],
  Paid: ["bg-tertiary-container text-on-tertiary-container", "bg-tertiary"],
  Invited: ["bg-secondary-container text-on-secondary-container", "bg-secondary"],
  Pending: ["bg-secondary-container text-on-secondary-container", "bg-secondary"],
  Suspended: ["bg-error-container text-on-error-container", "bg-error"],
  Overdue: ["bg-error-container text-on-error-container", "bg-error"],
  Refunded: ["border border-outline-variant text-on-surface-variant", "bg-outline"],
}

export type Role = "Owner" | "Admin" | "Member" | "Billing" | "Viewer"

export const ROLE_STYLE: Record<Role, string> = {
  Owner: "bg-primary text-on-primary",
  Admin: "bg-primary-container text-on-primary-container",
  Billing: "bg-tertiary-container text-on-tertiary-container",
  Member: "bg-surface-container-highest text-on-surface",
  Viewer: "border border-outline-variant text-on-surface-variant",
}

/* ---------- Navigation ---------- */

export type AdminPage =
  | "overview" | "analytics" | "users" | "orders" | "products" | "settings" | "customers" | "customer" | "order"
  | "invoices" | "inventory" | "reports" | "calendar" | "inbox" | "support" | "projects" | "team"
  | "integrations" | "developers" | "audit" | "account"

export const ADMIN_PAGES: AdminPage[] = [
  "overview", "analytics", "users", "orders", "products", "settings", "customers", "customer", "order",
  "invoices", "inventory", "reports", "calendar", "inbox", "support", "projects", "team",
  "integrations", "developers", "audit", "account",
]

export type NavItem = { id: AdminPage; label: string; icon: string; badge?: string }

export const NAV_GROUPS: { name: string; items: NavItem[] }[] = [
  {
    name: "Workspace",
    items: [
      { id: "overview", label: "Overview", icon: "dashboard" },
      { id: "analytics", label: "Analytics", icon: "monitoring" },
      { id: "reports", label: "Reports", icon: "summarize" },
      { id: "calendar", label: "Calendar", icon: "calendar_month" },
      { id: "inbox", label: "Inbox", icon: "inbox", badge: "5" },
    ],
  },
  {
    name: "Commerce",
    items: [
      { id: "orders", label: "Orders", icon: "receipt_long", badge: "3" },
      { id: "customers", label: "Customers", icon: "apartment" },
      { id: "invoices", label: "Invoices", icon: "request_quote" },
      { id: "products", label: "Products", icon: "inventory_2" },
      { id: "inventory", label: "Inventory", icon: "warehouse" },
    ],
  },
  {
    name: "People",
    items: [
      { id: "users", label: "Users", icon: "group" },
      { id: "team", label: "Team & roles", icon: "admin_panel_settings" },
      { id: "support", label: "Support", icon: "support_agent", badge: "12" },
    ],
  },
  {
    name: "Build",
    items: [
      { id: "projects", label: "Projects", icon: "view_kanban" },
      { id: "integrations", label: "Integrations", icon: "extension" },
      { id: "developers", label: "Developers", icon: "code" },
      { id: "audit", label: "Audit log", icon: "history" },
    ],
  },
  {
    name: "Account",
    items: [
      { id: "settings", label: "Settings", icon: "settings" },
      { id: "account", label: "My account", icon: "account_circle" },
    ],
  },
]

/** Collapsed rail / compact bar destinations. */
export const PRIMARY_NAV: NavItem[] = [
  { id: "overview", label: "Overview", icon: "dashboard" },
  { id: "analytics", label: "Analytics", icon: "monitoring" },
  { id: "users", label: "Users", icon: "group" },
  { id: "orders", label: "Orders", icon: "receipt_long", badge: "3" },
  { id: "products", label: "Products", icon: "inventory_2" },
  { id: "settings", label: "Settings", icon: "settings" },
]

/** Detail pages highlight their parent destination. */
export const navOwner = (page: AdminPage): AdminPage => ({ customer: "customers", order: "orders" } as Partial<Record<AdminPage, AdminPage>>)[page] ?? page

/* ---------- Datasets ---------- */

export type User = {
  i: number
  name: string
  initials: string
  email: string
  role: Role
  workspace: string
  status: Status
  mfa: boolean
  last: string
  joined: string
  deploys: number
  avatarCls: string
}

export type Order = {
  i: number
  id: string
  customer: string
  initials: string
  plan: string
  amount: number
  ts: number
  month: number
  date: string
  status: Status
  method: string
  avatarCls: string
}

export type Product = {
  key: string
  name: string
  short: string
  cat: "Plans" | "Add-ons" | "Services"
  price: string
  unit: string
  sold: string
  rev: string
  revK: number
  icon: string
  shape: "cookie7" | "clover4" | "squircle" | "pentagon" | "sunny" | "cookie12" | "puffy" | "gem"
  role: "primary" | "secondary" | "tertiary"
}

export type Customer = {
  name: string
  industry: string
  plan: "Enterprise" | "Business" | "Starter"
  arr: string
  seats: number
  health: number
  owner: string
  region: string
  since: string
  contact: string
}

export const CUSTOMERS: Customer[] = (
  [
    ["Halide Bank", "Financial services", "Enterprise", "$1.42M", 1240, 92, "Maya Lindqvist", "EU", "2019", "Priya Nair"],
    ["Meridian Health", "Healthcare", "Enterprise", "$1.18M", 980, 84, "Jonah Park", "US", "2020", "Lena Ortiz"],
    ["Northwind", "Retail", "Business", "$0.96M", 610, 71, "Ava Reyes", "US", "2021", "Chris Hale"],
    ["Quorum Energy", "Energy", "Enterprise", "$0.71M", 540, 58, "Sam Okafor", "EU", "2021", "Ingrid Berg"],
    ["Tessera Logistics", "Logistics", "Business", "$0.58M", 420, 88, "Priya Nair", "APAC", "2022", "Kenji Mori"],
    ["Lattice Labs", "Software", "Business", "$0.33M", 180, 94, "Tomás Weber", "EU", "2023", "Noor Haddad"],
    ["Cobalt Insurance", "Insurance", "Business", "$0.29M", 160, 42, "Maya Lindqvist", "US", "2022", "Dana Wells"],
    ["Fjord Media", "Media", "Starter", "$0.04M", 24, 77, "Ava Reyes", "EU", "2025", "Ola Nilsen"],
  ] as const
).map(([name, industry, plan, arr, seats, health, owner, region, since, contact]) => ({
  name, industry, plan, arr, seats, health, owner, region, since, contact,
}))

export const initialsOf = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)

function buildData() {
  const r = rng("kestrel")
  const people = [
    "Maya Lindqvist", "Jonah Park", "Ava Reyes", "Tomás Weber", "Priya Nair", "Sam Okafor", "Elena Ruiz", "Kenji Watanabe",
    "Lena Fischer", "Omar Haddad", "Grace Liu", "Noah Bennett", "Sofia Rossi", "Arjun Mehta", "Chloe Martin", "Diego Alvarez",
    "Hannah Kim", "Lucas Moreau", "Fatima Zahra", "Ben Carter", "Ingrid Holm", "Mateo Silva", "Yuki Tanaka", "Zoe Adams",
  ]
  const ws = ["Kestrel Ops", "Kestrel Labs", "Halide Bank", "Meridian Health", "Northwind"]
  const roles: Role[] = ["Admin", "Member", "Member", "Billing", "Viewer", "Member", "Admin", "Member", "Viewer", "Member", "Billing", "Member"]
  const last = ["2 min ago", "14 min ago", "1 h ago", "3 h ago", "Yesterday", "2 days ago", "Last week"]
  const invited = [4, 13, 19, 22]
  const suspended = [7, 16]
  const users: User[] = people.map((n, i) => {
    const [f, l] = n.split(" ")
    const w = ws[i % 5]
    const dom = w.startsWith("Kestrel") ? "kestrel.io" : w.toLowerCase().replace(/\s+/g, "") + ".com"
    const inv = invited.includes(i)
    return {
      i,
      name: n,
      initials: f[0] + l[0],
      email: (f + "." + l).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "") + "@" + dom,
      role: i === 0 ? "Owner" : roles[i % roles.length],
      workspace: w,
      status: inv ? "Invited" : suspended.includes(i) ? "Suspended" : "Active",
      mfa: i % 5 !== 3 && !inv,
      last: inv ? "—" : last[i % 7],
      joined: ["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"][i % 7] + " " + (3 + i) + ", 2026",
      deploys: inv ? 0 : Math.round(r() * 180),
      avatarCls: AVATAR_TONES[i % 4],
    }
  })
  const cos = [
    "Halide Bank", "Meridian Health", "Northwind", "Tessera Logistics", "Quorum Energy", "Lattice Labs", "Atlas Freight", "Bluebird Air",
    "Cobalt Insurance", "Delta Grid", "Evergreen Retail", "Foxglove Media", "Granite Capital", "Harbor Telecom", "Ion Robotics", "Juniper Foods",
  ]
  const plans: [string, number, number][] = [
    ["Enterprise · annual", 120000, 260000], ["Business · annual", 18000, 90000], ["Business · monthly", 1500, 8000], ["Policy add-on", 2000, 12000],
    ["Observe add-on", 3000, 20000], ["Premium support", 12000, 48000], ["Migration program", 25000, 25000],
  ]
  const methods = ["Invoice · NET 30", "Visa •• 4242", "ACH transfer", "Mastercard •• 8812"]
  const orders: Order[] = Array.from({ length: 46 }, (_, i) => {
    const p = plans[Math.floor(r() * plans.length)]
    const amount = Math.round((p[1] + r() * (p[2] - p[1])) / 10) * 10
    const day = 25 - Math.floor(i * 0.9)
    const d = day > 0 ? new Date(2026, 9, day) : new Date(2026, 8, 30 + day)
    const c = cos[Math.floor(r() * cos.length)]
    return {
      i,
      id: "KS-" + (10482 - i),
      customer: c,
      initials: initialsOf(c),
      plan: p[0],
      amount,
      ts: d.getTime(),
      month: d.getMonth(),
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      status: [3, 11, 27].includes(i) ? "Overdue" : i % 7 === 2 ? "Pending" : [9, 31].includes(i) ? "Refunded" : "Paid",
      method: methods[Math.floor(r() * 4)],
      avatarCls: AVATAR_TONES[i % 4],
    }
  })
  const products: Product[] = [
    { key: "ent", name: "Kestrel Grid · Enterprise", short: "Enterprise", cat: "Plans", price: "Custom", unit: "from $180k/yr", sold: "62", rev: "$11.2M", revK: 11200, icon: "workspace_premium", shape: "cookie7", role: "primary" },
    { key: "biz", name: "Kestrel Grid · Business", short: "Business", cat: "Plans", price: "$23", unit: "/workload/mo", sold: "214", rev: "$5.4M", revK: 5400, icon: "business_center", shape: "clover4", role: "tertiary" },
    { key: "start", name: "Kestrel Grid · Starter", short: "Starter", cat: "Plans", price: "$0", unit: "up to 10 workloads", sold: "1,840", rev: "—", revK: 0, icon: "rocket_launch", shape: "squircle", role: "secondary" },
    { key: "pol", name: "Policy engine", short: "Policy", cat: "Add-ons", price: "$12", unit: "/seat/mo", sold: "3,120", rev: "$449k", revK: 449, icon: "policy", shape: "pentagon", role: "primary" },
    { key: "obs", name: "Observe", short: "Observe", cat: "Add-ons", price: "$0.40", unit: "/GB ingested", sold: "96", rev: "$1.1M", revK: 1100, icon: "monitoring", shape: "sunny", role: "tertiary" },
    { key: "cost", name: "Cost insights", short: "Cost insights", cat: "Add-ons", price: "$8", unit: "/workload/mo", sold: "540", rev: "$212k", revK: 212, icon: "savings", shape: "cookie12", role: "secondary" },
    { key: "sup", name: "Premium support", short: "Support", cat: "Services", price: "$4k", unit: "/month", sold: "48", rev: "$2.3M", revK: 2300, icon: "support_agent", shape: "puffy", role: "primary" },
    { key: "mig", name: "Migration program", short: "Migration", cat: "Services", price: "$25k", unit: "one-time", sold: "19", rev: "$475k", revK: 475, icon: "move_up", shape: "gem", role: "tertiary" },
  ]
  return { users, orders, products }
}

export const DATA = buildData()

/** Role → static container/on-container classes (kept literal so Tailwind sees them). */
export const ROLE_TONES = {
  primary: { box: "bg-primary-container text-on-primary-container", shape: "text-primary-container", icon: "text-on-primary-container" },
  secondary: { box: "bg-secondary-container text-on-secondary-container", shape: "text-secondary-container", icon: "text-on-secondary-container" },
  tertiary: { box: "bg-tertiary-container text-on-tertiary-container", shape: "text-tertiary-container", icon: "text-on-tertiary-container" },
} as const
