import * as React from "react"

import { Alert, Banner } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { snackbar } from "@/components/ui/snackbar"
import { Section, Variant, Variants } from "@/docs/section"

const noop = () => {}
const demo = (label: string) => () => snackbar(`${label} · demo action`)

export default function AlertSection() {
  const [dismissed, setDismissed] = React.useState<string[]>([])
  const shown = (id: string) => !dismissed.includes(id)
  const dismiss = (id: string) => () => setDismissed((d) => [...d, id])
  return (
    <Section
      id="alert"
      description="Inline alerts on container roles with a leading icon and text-button actions. The M3 banner variant spans the content width under the app bar."
    >
      <div className="space-y-3">
        {shown("maint") && (
          <Alert
            actions={
              <Button variant="text" onPress={demo("Details")}>
                Details
              </Button>
            }
            onDismiss={dismiss("maint")}
          >
            Scheduled maintenance Sunday 02:00–03:00 UTC. Expect brief API latency.
          </Alert>
        )}
        {shown("deploy") && (
          <Alert
            tone="success"
            actions={
              <Button variant="text" className="text-on-tertiary-container" onPress={demo("View")}>
                View
              </Button>
            }
          >
            Deployment <span className="font-mono">v4.2.0</span> succeeded across 3 regions.
          </Alert>
        )}
        {shown("trial") && (
          <Alert
            tone="warning"
            actions={
              <Button className="bg-secondary text-on-secondary" onPress={demo("Add payment")}>
                Add payment
              </Button>
            }
          >
            Your trial ends in 3 days. Add a payment method to keep workloads running.
          </Alert>
        )}
        {shown("policy") && (
          <Alert
            tone="error"
            title="Policy violation blocked the deploy"
            actions={
              <>
                <Button variant="text" className="text-on-error-container" onPress={demo("Request exception")}>
                  Request exception
                </Button>
                <Button className="bg-error text-on-error" onPress={demo("See CVEs")}>
                  See CVEs
                </Button>
              </>
            }
          >
            Image <span className="font-mono">checkout:9f2a</span> has 2 critical CVEs. Fix or request an exception.
          </Alert>
        )}
        {shown("banner") && (
          <Banner
            icon="cloud_sync"
            className="rounded-md"
            actions={
              <>
                <Button variant="text" onPress={dismiss("banner")}>
                  Not now
                </Button>
                <Button
                  variant="text"
                  onPress={() => {
                    dismiss("banner")()
                    snackbar("Redirecting to your cloud provider…")
                  }}
                >
                  Reauthorize
                </Button>
              </>
            }
          >
            Two of your connected cloud accounts need re-authorization before the next sync.
          </Banner>
        )}
        <Button variant="text" onPress={() => setDismissed([])} isDisabled={dismissed.length === 0}>
          <Icon>restart_alt</Icon>
          Restore dismissed alerts
        </Button>
      </div>

      <Variants cols="md:grid-cols-2 xl:grid-cols-3">
        <Variant n={1} label="Tonal">
          <Alert tone="warning" icon="info" title="Maintenance" className="w-full" onDismiss={noop}>
            <span className="text-body-sm">Sunday 02:00–03:00 UTC, brief API latency.</span>
          </Alert>
        </Variant>
        <Variant n={2} label="Outlined">
          <Alert
            variant="outlined"
            icon="verified_user"
            title="SSO is now enforced"
            className="w-full"
            onDismiss={noop}
            actions={
              <Button variant="text" size="sm">
                Review settings
              </Button>
            }
          >
            <span className="text-body-sm text-on-surface-variant">Members sign in with Okta from today.</span>
          </Alert>
        </Variant>
        <Variant n={3} label="Inverse pill">
          <Alert variant="inverse" icon="cloud_off" className="w-full" onDismiss={noop}>
            You're offline. Changes are queued.
          </Alert>
        </Variant>
        <AutoDismissVariant />
        <Variant n={5} label="Expressive">
          <Alert
            tone="error"
            icon={null}
            title={<span className="text-title-md">2 critical CVEs</span>}
            className="w-full items-start gap-4 rounded-2xl p-5"
            actions={
              <div className="flex w-full justify-end gap-1">
                <Button variant="text" className="text-on-error-container">
                  Dismiss
                </Button>
                <Button className="bg-error text-on-error">See CVEs</Button>
              </div>
            }
          >
            <span className="text-body-sm">Deploy of checkout:9f2a is blocked.</span>
          </Alert>
        </Variant>
      </Variants>
    </Section>
  )
}

function AutoDismissVariant() {
  const [left, setLeft] = React.useState(100)
  React.useEffect(() => {
    const t = setInterval(() => setLeft((v) => (v <= 0 ? 100 : v - 2)), 100)
    return () => clearInterval(t)
  }, [])
  return (
    <Variant n={4} label="Auto-dismiss">
      <div className="w-full overflow-hidden rounded-md bg-surface-container-highest">
        <Alert icon="check_circle" className="bg-transparent [&_[data-slot=icon]]:text-tertiary [&_[data-slot=icon]]:[--icon-fill:1]" onDismiss={() => setLeft(100)}>
          Policy saved and enforced
        </Alert>
        <div className="h-1 bg-secondary-container">
          <div className="h-full bg-tertiary transition-[width] duration-100 ease-linear" style={{ width: `${left}%` }} />
        </div>
      </div>
    </Variant>
  )
}
