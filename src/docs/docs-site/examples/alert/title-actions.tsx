import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { snackbar } from "@/components/ui/snackbar"

export default function AlertTitleActions() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <Alert
        tone="error"
        title="Policy violation blocked the deploy"
        actions={
          <>
            <Button variant="text" size="xs" color="error" onPress={() => snackbar("Opening the policy")}>
              View policy
            </Button>
            <Button variant="text" size="xs" color="error" onPress={() => snackbar("Override requested")}>
              Request override
            </Button>
          </>
        }
      >
        checkout-api requires two approvals before production.
      </Alert>
      <Alert tone="info" title="SSO is now enforced" icon="shield_lock">
        Members sign in with your identity provider from now on.
      </Alert>
    </div>
  )
}
