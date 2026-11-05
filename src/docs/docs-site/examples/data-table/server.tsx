import { useEffect, useState } from "react"

import {
  DataTable,
  DataTableBody,
  DataTableCard,
  DataTableCell,
  DataTableColumn,
  DataTableHeader,
  DataTablePagination,
  DataTableProgress,
  DataTableRow,
} from "@/components/ui/data-table"

const TOTAL = 1243
const FIRST = ["Abebe", "Hana", "Dawit", "Meron", "Yonas", "Selam", "Kidus", "Bethlehem", "Natnael", "Liya"]
const LAST = ["Kebede", "Tesfaye", "Alemu", "Girma", "Haile", "Bekele", "Tadesse", "Wolde"]

/** Stands in for an API call such as GET /students?page=3&limit=10. */
function fetchStudents(page: number, limit: number) {
  const start = (page - 1) * limit
  return Array.from({ length: Math.max(0, Math.min(limit, TOTAL - start)) }, (_, i) => {
    const n = start + i + 1
    return {
      id: `HSM-${String(n).padStart(4, "0")}`,
      name: `${FIRST[n % FIRST.length]} ${LAST[(n * 7) % LAST.length]}`,
      grade: `Grade ${(n % 12) + 1} · ${"ABC"[n % 3]}`,
    }
  })
}

export default function DataTableServer() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [rows, setRows] = useState(() => fetchStudents(1, 10))
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => {
      setRows(fetchStudents(page, pageSize))
      setLoading(false)
    }, 400)
    return () => clearTimeout(t)
  }, [page, pageSize])

  return (
    <DataTableCard className="w-full">
      <DataTableProgress isLoading={loading} />
      <DataTable aria-label="Students" isLoading={loading} density="dense">
        <DataTableHeader>
          <DataTableColumn id="id">ID</DataTableColumn>
          <DataTableColumn id="name" isRowHeader>Name</DataTableColumn>
          <DataTableColumn id="grade">Section</DataTableColumn>
        </DataTableHeader>
        <DataTableBody items={rows}>
          {(s) => (
            <DataTableRow id={s.id}>
              <DataTableCell muted className="tabular-nums">{s.id}</DataTableCell>
              <DataTableCell className="font-medium">{s.name}</DataTableCell>
              <DataTableCell muted>{s.grade}</DataTableCell>
            </DataTableRow>
          )}
        </DataTableBody>
      </DataTable>
      <DataTablePagination
        page={page}
        pageSize={pageSize}
        total={TOTAL}
        onPageChange={setPage}
        onPageSizeChange={(n) => {
          setPageSize(n)
          setPage(1)
        }}
        showJump
      />
    </DataTableCard>
  )
}
