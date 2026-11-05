import { Fragment, useState } from "react"
import type { Selection } from "react-aria-components"

import {
  DataTable,
  DataTableBody,
  DataTableCard,
  DataTableCell,
  DataTableColumn,
  DataTableDetailRow,
  DataTableExpandButton,
  DataTableHeader,
  DataTablePagination,
  DataTableRow,
  useDataTable,
  useExpandedRows,
} from "@/components/ui/data-table"

type Bill = { id: string; title: string; amount: number; paid: boolean }

const STUDENTS: { id: string; name: string; section: string; bills: Bill[] }[] = [
  {
    id: "s1",
    name: "Abebe Kebede",
    section: "Grade 7 · A",
    bills: [
      { id: "b1", title: "Tuition · Term 1", amount: 4500, paid: true },
      { id: "b2", title: "Transport · Tekemt", amount: 900, paid: false },
    ],
  },
  {
    id: "s2",
    name: "Hana Tesfaye",
    section: "Grade 7 · A",
    bills: [{ id: "b3", title: "Tuition · Term 1", amount: 4500, paid: true }],
  },
  {
    id: "s3",
    name: "Dawit Alemu",
    section: "Grade 8 · B",
    bills: [
      { id: "b4", title: "Tuition · Term 1", amount: 4800, paid: false },
      { id: "b5", title: "Lab fee", amount: 350, paid: false },
      { id: "b6", title: "Uniform", amount: 1200, paid: true },
    ],
  },
  {
    id: "s4",
    name: "Meron Girma",
    section: "Grade 8 · B",
    bills: [{ id: "b7", title: "Tuition · Term 1", amount: 4800, paid: true }],
  },
  {
    id: "s5",
    name: "Yonas Haile",
    section: "Grade 9 · A",
    bills: [
      { id: "b8", title: "Tuition · Term 1", amount: 5200, paid: false },
      { id: "b9", title: "Exam fee", amount: 300, paid: true },
    ],
  },
]

const birr = (n: number) => `${n.toLocaleString("en-US")} ETB`
const balance = (bills: Bill[]) => bills.filter((b) => !b.paid).reduce((sum, b) => sum + b.amount, 0)

export default function DataTableExpandable() {
  const [selected, setSelected] = useState<Selection>(new Set())
  const dt = useDataTable(STUDENTS, { pageSize: 4, sortValue: (s, col) => (col === "balance" ? balance(s.bills) : s.name) })
  const rows = useExpandedRows({ defaultExpandedKeys: ["s3"] })
  const count = selected === "all" ? STUDENTS.length : selected.size

  return (
    <DataTableCard className="w-full">
      <DataTable
        aria-label="Student bills"
        selectionMode="multiple"
        selectedKeys={selected}
        onSelectionChange={setSelected}
        {...dt.tableProps}
        {...rows.tableProps}
      >
        <DataTableHeader>
          <DataTableColumn id="name" isRowHeader allowsSorting>Student</DataTableColumn>
          <DataTableColumn id="section">Section</DataTableColumn>
          <DataTableColumn id="balance" allowsSorting align="end">Balance</DataTableColumn>
          <DataTableColumn id="expand" width={64}>
            <span className="sr-only">Bills</span>
          </DataTableColumn>
        </DataTableHeader>
        <DataTableBody>
          {dt.items.map((s) => (
            <Fragment key={s.id}>
              <DataTableRow id={s.id}>
                <DataTableCell className="font-medium whitespace-nowrap">{s.name}</DataTableCell>
                <DataTableCell muted className="whitespace-nowrap">{s.section}</DataTableCell>
                <DataTableCell numeric className={balance(s.bills) > 0 ? "text-error" : undefined}>
                  {birr(balance(s.bills))}
                </DataTableCell>
                <DataTableCell className="px-2 py-1">
                  <DataTableExpandButton label={`Bills for ${s.name}`} {...rows.expandButtonProps(s.id)} />
                </DataTableCell>
              </DataTableRow>
              {rows.isExpanded(s.id) && (
                <DataTableDetailRow id={rows.detailKey(s.id)} colSpan={4}>
                  <ul className="divide-y divide-outline-variant">
                    {s.bills.map((b) => (
                      <li key={b.id} className="flex items-center gap-4 py-2 text-body-sm">
                        <span className="flex-1">{b.title}</span>
                        <span className={b.paid ? "text-on-surface-variant" : "text-error"}>{b.paid ? "Paid" : "Unpaid"}</span>
                        <span className="w-24 text-right tabular-nums">{birr(b.amount)}</span>
                      </li>
                    ))}
                  </ul>
                </DataTableDetailRow>
              )}
            </Fragment>
          ))}
        </DataTableBody>
      </DataTable>
      <DataTablePagination {...dt.paginationProps} onPageSizeChange={undefined} start={`${count} of ${STUDENTS.length} selected`} />
    </DataTableCard>
  )
}
