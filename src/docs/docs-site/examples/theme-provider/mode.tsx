import { ConnectedButton, ConnectedButtonGroup } from "@/components/ui/button-group"
import { Icon } from "@/components/ui/icon"
import { useTheme, type ThemeMode } from "@/components/ui/theme-provider"

export default function ThemeProviderMode() {
  const { mode, setMode, resolvedMode } = useTheme()

  return (
    <div className="flex flex-col items-center gap-3">
      <ConnectedButtonGroup aria-label="Theme" selectedKeys={[mode]} onSelectionChange={(keys) => setMode([...keys][0] as ThemeMode)}>
        <ConnectedButton id="light">
          <Icon name="light_mode" />
          Light
        </ConnectedButton>
        <ConnectedButton id="dark">
          <Icon name="dark_mode" />
          Dark
        </ConnectedButton>
        <ConnectedButton id="system">
          <Icon name="contrast" />
          System
        </ConnectedButton>
      </ConnectedButtonGroup>
      <p className="text-body-md text-on-surface-variant">
        Mode <b className="text-on-surface">{mode}</b> · showing <b className="text-on-surface">{resolvedMode}</b>
      </p>
    </div>
  )
}
