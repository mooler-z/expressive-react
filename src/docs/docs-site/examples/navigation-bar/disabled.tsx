import { NavigationBar, NavigationBarItem } from "@/components/ui/navigation-bar"
import { snackbar } from "@/components/ui/snackbar"

export default function NavigationBarDisabled() {
  return (
    <div className="w-full max-w-sm overflow-hidden rounded-xl border border-outline-variant">
      <NavigationBar defaultValue="wallet" onValueChange={(v) => snackbar(`Opened ${v}`)}>
        <NavigationBarItem value="wallet" icon="account_balance_wallet" label="Wallet" />
        <NavigationBarItem value="pay" icon="contactless" label="Pay" />
        <NavigationBarItem value="offers" icon="sell" label="Offers" isDisabled />
      </NavigationBar>
    </div>
  )
}
