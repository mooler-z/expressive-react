import { useState } from "react"
import type { Selection } from "react-aria-components"

import { Button } from "@/components/ui/button"
import { DataTable, DataTableBody, DataTableCard, DataTableCell, DataTableColumn, DataTableHeader, DataTableRow, DataTableToolbar } from "@/components/ui/data-table"
import { Icon } from "@/components/ui/icon"
import { snackbar } from "@/components/ui/snackbar"

const MEMBERS = [
  { id: "maya", name: "Maya Lindqvist", role: "Owner", email: "maya@kestrel.io" },
  { id: "ana", name: "Ana Ruiz", role: "Admin", email: "ana@kestrel.io" },
  { id: "kenji", name: "Kenji Sato", role: "Member", email: "kenji@kestrel.io" },
  { id: "lea", name: "Léa Martin", role: "Member", email: "lea@kestrel.io" },
]

export default function SelectionDataTable() {
  const [selected, setSelected] = useState<Selection>(new Set(["kenji"]))
  const count = selected === "all" ? MEMBERS.length : selected.size

  return (
    <DataTableCard className="w-full max-w-2xl">
      <DataTableToolbar className="min-h-18">
        <span className="text-title-sm">{count ? `${count} selected` : "Members"}</span>
        <Button
          variant="tonal"
          className="ml-auto"
          isDisabled={!count}
          icon={<Icon name="mail" />}
          onPress={() => snackbar(`Emailed ${count} member${count === 1 ? "" : "s"}`)}
        >
          Email
        </Button>
      </DataTableToolbar>
      <DataTable
        aria-label="Members"
        selectionMode="multiple"
        selectedKeys={selected}
        onSelectionChange={setSelected}
        disabledKeys={["maya"]}
      >
        <DataTableHeader>
          <DataTableColumn id="name" isRowHeader>Name</DataTableColumn>
          <DataTableColumn id="role">Role</DataTableColumn>
          <DataTableColumn id="email">Email</DataTableColumn>
        </DataTableHeader>
        <DataTableBody items={MEMBERS}>
          {(m) => (
            <DataTableRow id={m.id}>
              <DataTableCell className="font-medium">{m.name}</DataTableCell>
              <DataTableCell>{m.role}</DataTableCell>
              <DataTableCell muted>{m.email}</DataTableCell>
            </DataTableRow>
          )}
        </DataTableBody>
      </DataTable>
    </DataTableCard>
  )
}
