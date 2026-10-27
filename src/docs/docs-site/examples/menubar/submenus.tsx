import { Menu, MenuItem, MenuPopover, SubmenuTrigger } from "@/components/ui/menu"
import { Menubar, MenubarMenu } from "@/components/ui/menubar"
import { snackbar } from "@/components/ui/snackbar"

export default function MenubarSubmenus() {
  return (
    <div className="h-72 w-full max-w-2xl rounded-xl border border-outline-variant bg-surface">
      <Menubar aria-label="Spreadsheet" className="h-12 px-2">
        <MenubarMenu label="Insert" aria-label="Insert" onAction={(k) => snackbar(`Inserted ${k}`)} className="w-56">
          <MenuItem id="row" icon="table_rows">Row</MenuItem>
          <MenuItem id="column" icon="view_column">Column</MenuItem>
          <SubmenuTrigger>
            <MenuItem id="chart" icon="bar_chart">Chart</MenuItem>
            <MenuPopover>
              <Menu aria-label="Chart type" onAction={(k) => snackbar(`Inserted ${k} chart`)}>
                <MenuItem id="bar" icon="bar_chart">Bar</MenuItem>
                <MenuItem id="line" icon="show_chart">Line</MenuItem>
                <MenuItem id="pie" icon="pie_chart">Pie</MenuItem>
              </Menu>
            </MenuPopover>
          </SubmenuTrigger>
        </MenubarMenu>
        <MenubarMenu label="Format" aria-label="Format" onAction={(k) => snackbar(String(k))}>
          <MenuItem id="Bold" icon="format_bold" shortcut="⌘B">Bold</MenuItem>
          <MenuItem id="Italic" icon="format_italic" shortcut="⌘I">Italic</MenuItem>
        </MenubarMenu>
      </Menubar>
    </div>
  )
}
