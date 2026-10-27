import { Link } from "react-router"

import { Shape } from "@/components/ui/shape"
import { SITE_LINKS } from "@/docs/site/site-nav"

/* Site footer · bottom of design-reference/site/Landing.dc.html */

type FooterLink = [label: string, href: string, external?: boolean]

const COLUMNS: [title: string, links: FooterLink[]][] = [
  [
    "Product",
    [
      ["Docs", "/docs"],
      ["Components", "/docs/button"],
      ["Blocks", "/blocks"],
      ["Themes", "/themes"],
      ["Charts", "/docs/chart"],
    ],
  ],
  [
    "Resources",
    [
      ["GitHub", SITE_LINKS.github, true],
      ["Registry · /r/{name}.json", "/docs/registry"],
      ["Changelog", "/docs/changelog"],
      ["M3 Expressive spec", SITE_LINKS.m3, true],
      ["Design tokens", "/tokens"],
    ],
  ],
  [
    "Legal",
    [
      ["MIT License", SITE_LINKS.github, true],
      ["Code of conduct", SITE_LINKS.github, true],
      ["Motion annotations", "/annotations"],
      ["Review board", "/review"],
    ],
  ],
]

const linkClass = "rounded-xs hover:text-primary focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-secondary"

export function SiteFooter() {
  return (
    <footer data-slot="site-footer" className="border-t border-outline-variant/60 bg-surface-container-low">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:px-8">
        <div>
          <Link to="/" className="inline-flex items-center gap-2 rounded-full focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-secondary">
            <Shape shape="clover4" className="size-8 text-primary" />
            <span className="text-title-md font-semibold tracking-tight">
              Expressive<span className="font-normal text-on-surface-variant"> React</span>
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-body-md text-on-surface-variant">
            Material 3 Expressive for React. Built on React Aria Components, Tailwind CSS v4 and Google's Material color utilities. Not
            affiliated with Google.
          </p>
        </div>
        {COLUMNS.map(([title, links]) => (
          <div key={title}>
            <div className="text-title-sm">{title}</div>
            <ul className="mt-3 space-y-2 text-body-md text-on-surface-variant">
              {links.map(([label, href, external]) => (
                <li key={label}>
                  {external ? (
                    <a href={href} target="_blank" rel="noreferrer" className={linkClass}>
                      {label}
                    </a>
                  ) : (
                    <Link to={href} className={linkClass}>
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 border-t border-outline-variant/60 px-4 py-5 text-body-sm text-on-surface-variant md:px-8">
        <span>© 2026 Expressive React contributors</span>
        <span className="font-mono">{SITE_LINKS.version} · React 19 · Tailwind 4</span>
      </div>
    </footer>
  )
}
