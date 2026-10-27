import * as React from "react"

import { Icon } from "@/components/ui/icon"
import { KIT_FALLBACK_EXCLUDED, KIT_SECTION, kitSectionLoader } from "@/docs/docs-site/kit-map"
import { findPage, neighbours, type DocsPageRef } from "@/docs/docs-site/nav"
import { ExampleBlock, KitPreview, MainPreview } from "@/docs/docs-site/preview"
import {
  CodePanel,
  copyText,
  DocTable,
  HeaderChip,
  InlineCode,
  KeyCap,
  Pager,
  Segmented,
  SectionHeading,
  Step,
  Steps,
  Terminal,
  TextLink,
} from "@/docs/docs-site/primitives"
import { displayPath, installCommand, loadSource, registryItem } from "@/docs/docs-site/registry"
import type { ComponentDoc } from "@/docs/docs-site/types"

/** Sections a component page can have, in TOC order. */
export const TOC_SECTIONS = [
  ["preview", "Preview"],
  ["installation", "Installation"],
  ["usage", "Usage"],
  ["examples", "Examples"],
  ["api", "API reference"],
  ["a11y", "Accessibility"],
  ["spec", "M3 spec values"],
] as const

export type TocId = (typeof TOC_SECTIONS)[number][0]

/** Which TOC entries a page renders (fallback pages: preview + installation). */
export function tocFor(doc: ComponentDoc | null): TocId[] {
  if (!doc) return ["preview", "installation"]
  return TOC_SECTIONS.map(([id]) => id).filter((id) => {
    if (id === "usage") return !!doc.usage
    if (id === "examples") return !!doc.examples?.length
    if (id === "api") return !!doc.api?.length
    if (id === "a11y") return !!doc.accessibility
    if (id === "spec") return !!doc.spec
    return true
  })
}

export function ComponentPage({ page, doc }: { page: DocsPageRef; doc: ComponentDoc | null }) {
  const id = page.id
  const item = registryItem(id)
  const title = doc?.title ?? page.label
  const { prev, next } = neighbours(id)
  const kit = kitSectionLoader(id)

  return (
    <article className="mx-auto max-w-4xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl min-w-0">
          <h1 className="text-display-sm font-semibold tracking-tight break-words">{title}</h1>
          <div className="mt-3 text-body-lg text-pretty text-on-surface-variant">{doc?.description ?? item?.description}</div>
        </div>
        <div className="flex flex-wrap gap-2">
          {doc?.links?.m3 && (
            <HeaderChip href={doc.links.m3} icon="menu_book">
              M3 spec
            </HeaderChip>
          )}
          {doc?.links?.aria && (
            <HeaderChip href={doc.links.aria} icon="accessibility_new">
              React Aria
            </HeaderChip>
          )}
          <HeaderChip icon="content_copy" tonal onPress={() => copyText(installCommand(id), "install command")}>
            @expressive/{id}
          </HeaderChip>
        </div>
      </div>

      {!doc && (
        <div className="mt-6 flex items-start gap-3 rounded-lg bg-surface-container-low p-4 text-body-md text-on-surface-variant">
          <Icon name="construction" className="text-tertiary" />
          <p className="min-w-0">
            The full reference for {title} (usage, numbered examples, props, keyboard and M3 spec values) is being written. Meanwhile the kit demos and install
            steps below are live. <TextLink to="/docs/button">See Button</TextLink> for the complete page.
          </p>
        </div>
      )}

      <section id="preview" className="mt-8 scroll-mt-24" aria-label="Preview">
        {doc ? (
          <MainPreview demo={doc.preview} />
        ) : kit ? (
          <KitPreview load={kit} />
        ) : (
          <div className="grid min-h-40 place-items-center rounded-xl bg-surface-container-low p-8 text-center text-body-md text-on-surface-variant">
            <p className="max-w-md">
              {KIT_FALLBACK_EXCLUDED[id] ?? "No demo yet."}{" "}
              {KIT_SECTION[id] && <TextLink to={`/kit#${KIT_SECTION[id]}`}>Open it in the kit</TextLink>}
            </p>
          </div>
        )}
      </section>

      <Installation id={id} />

      {doc?.usage && (
        <section className="mt-12">
          <SectionHeading id="usage">Usage</SectionHeading>
          <CodePanel code={doc.usage} copyLabel="usage" className="mt-4" />
        </section>
      )}

      {!!doc?.examples?.length && (
        <section className="mt-12 space-y-10">
          <SectionHeading id="examples">Examples</SectionHeading>
          {doc.examples.map((ex, i) => (
            <ExampleBlock key={ex.id} example={ex} n={i + 1} />
          ))}
        </section>
      )}

      {!!doc?.api?.length && (
        <section className="mt-12">
          <SectionHeading id="api">API reference</SectionHeading>
          <div className="mt-2 space-y-8">
            {doc.api.map((api) => (
              <div key={api.name}>
                {doc.api!.length > 1 && <h3 className="mt-4 font-mono text-title-md">{api.name}</h3>}
                {api.description && <div className="mt-2 max-w-prose text-body-md text-on-surface-variant">{api.description}</div>}
                <DocTable
                  className="mt-4"
                  minWidth={640}
                  columns={["Prop", "Type", "Default", "Description"]}
                  cellClassName={["font-mono text-body-sm text-primary", "font-mono text-body-sm text-on-surface-variant", "font-mono text-body-sm", "text-on-surface-variant"]}
                  rows={api.props.map((p) => [p.name, p.type, p.default ?? "—", p.description])}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {doc?.accessibility && (
        <section className="mt-12">
          <SectionHeading id="a11y">Accessibility</SectionHeading>
          {doc.accessibility.description && <div className="mt-2 max-w-prose text-body-md text-on-surface-variant">{doc.accessibility.description}</div>}
          {!!doc.accessibility.keyboard?.length && (
            <DocTable
              className="mt-4"
              columns={["Key", "Interaction"]}
              cellClassName={["whitespace-nowrap text-on-surface-variant", "text-on-surface-variant"]}
              rows={doc.accessibility.keyboard.map((k) => [
                k.keys ? (
                  <span className="inline-flex flex-wrap gap-1">
                    {k.keys.map((key) => (
                      <KeyCap key={key}>{key}</KeyCap>
                    ))}
                  </span>
                ) : (
                  k.label
                ),
                k.description,
              ])}
            />
          )}
          {!!doc.accessibility.notes?.length && (
            <ul className="mt-4 space-y-2 text-body-md text-on-surface-variant">
              {doc.accessibility.notes.map((n, i) => (
                <li key={i} className="flex gap-3">
                  <Icon name="check_circle" size={20} className="mt-0.5 text-primary" />
                  <span className="min-w-0">{n}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {doc?.spec && (
        <section className="mt-12">
          <SectionHeading id="spec">M3 spec values</SectionHeading>
          {doc.spec.description && <div className="mt-2 max-w-prose text-body-md text-on-surface-variant">{doc.spec.description}</div>}
          {doc.spec.tables?.map((t, i) => (
            <div key={i} className="mt-4">
              {t.title && <h3 className="mb-2 text-title-md">{t.title}</h3>}
              <DocTable columns={t.columns} rows={t.rows} minWidth={t.columns.length > 4 ? 720 : undefined} className="tabular-nums" cellClassName={["font-medium"]} />
            </div>
          ))}
          {!!doc.spec.cards?.length && (
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {doc.spec.cards.map((c) => (
                <div key={c.title} className="rounded-lg bg-surface-container-low p-4">
                  <div className="text-label-md tracking-wider text-on-surface-variant uppercase">{c.title}</div>
                  <ul className="mt-2 space-y-1 text-body-md">
                    {c.items.map((it, i) => (
                      <li key={i}>{it}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
          {doc.spec.source && <p className="mt-3 text-body-sm text-on-surface-variant">{doc.spec.source}</p>}
        </section>
      )}

      <Pager
        prev={prev && { to: `/docs/${prev.id}`, label: prev.label }}
        next={next && { to: `/docs/${next.id}`, label: next.label }}
      />
    </article>
  )
}

/** CLI / Manual install, derived from registry/<id>.json and the real source files. */
function Installation({ id }: { id: string }) {
  const [mode, setMode] = React.useState<"cli" | "manual">("cli")
  const item = registryItem(id)
  const files = item?.files ?? []
  const deps = item?.dependencies ?? []
  const regDeps = (item?.registryDependencies ?? []).map((d) => d.replace("@expressive/", "")).filter((d) => d !== "utils" && d !== "theme")
  const [sources, setSources] = React.useState<Record<string, string | null>>({})

  React.useEffect(() => {
    if (mode !== "manual") return
    let live = true
    Promise.all(files.map(async (f) => [f.path, await loadSource(f.path)] as const)).then((entries) => live && setSources(Object.fromEntries(entries)))
    return () => {
      live = false
    }
    // files come from the static registry item for `id`
  }, [mode, id])

  return (
    <section className="mt-12">
      <SectionHeading id="installation">Installation</SectionHeading>
      <Segmented
        className="mt-4 flex w-full sm:inline-flex sm:w-auto"
        label="Install method"
        value={mode}
        onChange={setMode}
        options={[
          { id: "cli", label: "CLI" },
          { id: "manual", label: "Manual" },
        ]}
      />
      {mode === "cli" ? (
        <div className="mt-4">
          <Terminal commands={[installCommand(id)]} />
          <p className="mt-3 text-body-md text-on-surface-variant">
            Needs the <InlineCode>@expressive</InlineCode> registry in your components.json. Not there yet? <TextLink to="/docs/install">Run init first</TextLink>.
          </p>
        </div>
      ) : (
        <div className="mt-4">
          <Steps size="md">
            {deps.length > 0 && (
              <Step>
                Install the runtime {deps.length === 1 ? "dependency" : "dependencies"}.
                <Terminal className="mt-2" header={false} commands={[`npm i ${deps.join(" ")}`]} />
              </Step>
            )}
            {regDeps.length > 0 && (
              <Step>
                Add the Expressive items it imports:{" "}
                {regDeps.map((d, i) => (
                  <React.Fragment key={d}>
                    {i > 0 && ", "}
                    {findPage(d) ? <TextLink to={`/docs/${d}`}>{d}</TextLink> : <InlineCode>{d}</InlineCode>}
                  </React.Fragment>
                ))}
                .
              </Step>
            )}
            {files.map((f) => (
              <Step key={f.path}>
                Copy <InlineCode>{(f.target ?? displayPath(f.path)).split("/").pop()}</InlineCode> into <InlineCode>{dirOf(f.target ?? displayPath(f.path))}</InlineCode>.
                {sources[f.path] != null ? (
                  <CodePanel className="mt-2" filename={f.target ?? displayPath(f.path)} code={sources[f.path]!} preClassName="max-h-72 p-4" />
                ) : (
                  <div className="mt-2 h-24 animate-pulse rounded-lg bg-surface-container-high" />
                )}
              </Step>
            ))}
            <Step>
              Make sure the theme CSS from <InlineCode>@expressive/init</InlineCode> is imported once, so <InlineCode>bg-primary</InlineCode>,{" "}
              <InlineCode>rounded-xl</InlineCode> and <InlineCode>ease-fast-spatial</InlineCode> resolve.
            </Step>
          </Steps>
        </div>
      )}
    </section>
  )
}

const dirOf = (path: string) => path.split("/").slice(0, -1).join("/") + "/"
