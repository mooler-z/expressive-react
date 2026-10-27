import { Login1 } from "@/components/blocks/login-1"
import { Login2 } from "@/components/blocks/login-2"
import { Login3 } from "@/components/blocks/login-3"
import { Reset1 } from "@/components/blocks/reset-1"
import { Reset2 } from "@/components/blocks/reset-2"
import { Reset3 } from "@/components/blocks/reset-3"
import { Signup1 } from "@/components/blocks/signup-1"
import { Signup2 } from "@/components/blocks/signup-2"
import { Signup3 } from "@/components/blocks/signup-3"
import { TwoFactor1 } from "@/components/blocks/two-factor-1"
import { TwoFactor2 } from "@/components/blocks/two-factor-2"
import { TwoFactor3 } from "@/components/blocks/two-factor-3"
import { Verify1 } from "@/components/blocks/verify-1"
import { Verify2 } from "@/components/blocks/verify-2"
import { Verify3 } from "@/components/blocks/verify-3"
import { BlockDemo, BlockGroup } from "@/docs/block-demo"
import { BlocksLayout } from "@/docs/blocks-layout"

export const meta = { path: "/kit/blocks/auth" }

const AUTO = "h-auto"

export default function BlocksAuthPage() {
  return (
    <BlocksLayout
      title="Authentication"
      description="Sign-in, signup, recovery and verification screens for staff accounts. Validation, step flows and code entry all work; in code fields any six digits pass and 000000 shows the error state."
    >
      <BlockGroup id="login" title="Login" description="Staff sign-in: password with SSO, a split layout with service status, and passwordless email links." count={3}>
        <BlockDemo
          id="login-1"
          n={1}
          title="Centered card"
          name="login-1"
          frameClassName={AUTO}
          description="Email and password with show/hide, keep-me-signed-in, SSO options and an async submit. The email field validates as you type."
        >
          <Login1 forgotPasswordHref="#reset-1" />
        </BlockDemo>
        <BlockDemo
          id="login-2"
          n={2}
          title="Split with status"
          name="login-2"
          frameClassName={AUTO}
          description="Brand panel with morphing M3 shapes and live service status beside filled text fields. The panel drops away below 840px."
        >
          <Login2 forgotPasswordHref="#reset-1" />
        </BlockDemo>
        <BlockDemo
          id="login-3"
          n={3}
          title="Magic link"
          name="login-3"
          frameClassName={AUTO}
          description="Passwordless by default, with a password tab as fallback. Sending the link swaps the form for a confirmation that echoes the address."
        >
          <Login3 />
        </BlockDemo>
      </BlockGroup>

      <BlockGroup id="signup" title="Signup" description="Account creation for a new studio, a guided workspace setup, and joining from an invite." count={3}>
        <BlockDemo
          id="signup-1"
          n={1}
          title="Strength meter"
          name="signup-1"
          frameClassName={AUTO}
          description="Name, email and password with a four-segment strength meter. Create stays disabled until the password rates Fair or better and the terms are accepted."
        >
          <Signup1 signInHref="#login-1" />
        </BlockDemo>
        <BlockDemo
          id="signup-2"
          n={2}
          title="Multi-step"
          name="signup-2"
          frameClassName={AUTO}
          description="Workspace setup in three steps with a vertical stepper (a progress bar on compact). Back and Continue move between steps; finishing shows the ready state."
        >
          <Signup2 />
        </BlockDemo>
        <BlockDemo
          id="signup-3"
          n={3}
          title="Invite acceptance"
          name="signup-3"
          frameClassName={AUTO}
          description="Joining from an email invite: the inviter, role and title access sit beside a short form, with the email locked to the invited address."
        >
          <Signup3 />
        </BlockDemo>
      </BlockGroup>

      <BlockGroup
        id="reset"
        title="Forgot & reset password"
        description="Recovery by email link, the new-password screen it leads to, and a code-based flow for accounts without email links."
        count={3}
      >
        <BlockDemo id="reset-1" n={1} title="Request a link" name="reset-1" frameClassName={AUTO} description="Email-only request that swaps to a confirmation in place, with a way back to the form.">
          <Reset1 signInHref="#login-1" />
        </BlockDemo>
        <BlockDemo
          id="reset-2"
          n={2}
          title="New password rules"
          name="reset-2"
          frameClassName={AUTO}
          description="Two fields with a live checklist. Save unlocks once every rule passes, including the match."
        >
          <Reset2 />
        </BlockDemo>
        <BlockDemo
          id="reset-3"
          n={3}
          title="Code + new password"
          name="reset-3"
          frameClassName={AUTO}
          description="A texted six-digit code, then the new password, then confirmation. The bar along the top tracks progress."
        >
          <Reset3 signInHref="#login-1" />
        </BlockDemo>
      </BlockGroup>

      <BlockGroup
        id="two-factor"
        title="Two-factor"
        description="The sign-in challenge, first-time authenticator setup, and the settings where staff manage methods and backup codes."
        count={3}
      >
        <BlockDemo
          id="two-factor-1"
          n={1}
          title="Code challenge"
          name="two-factor-1"
          frameClassName={AUTO}
          description="Six-digit authenticator code with paste support, a trust-this-device option and a backup-code fallback."
        >
          <TwoFactor1 cancelHref="#login-1" />
        </BlockDemo>
        <BlockDemo
          id="two-factor-2"
          n={2}
          title="Authenticator setup"
          name="two-factor-2"
          frameClassName={AUTO}
          description="Scan the code or copy the setup key, confirm with six digits, then save backup codes."
        >
          <TwoFactor2 />
        </BlockDemo>
        <BlockDemo
          id="two-factor-3"
          n={3}
          title="Security settings"
          name="two-factor-3"
          frameClassName={AUTO}
          description="Method management after setup: status per method, an SMS fallback switch, and backup codes that reveal on demand."
        >
          <TwoFactor3 />
        </BlockDemo>
      </BlockGroup>

      <BlockGroup
        id="verify"
        title="Verify email"
        description="The holding screen after signup, code entry for links that open in the wrong browser, and a reminder inside the console."
        count={3}
      >
        <BlockDemo
          id="verify-1"
          n={1}
          title="Check your inbox"
          name="verify-1"
          frameClassName={AUTO}
          description="Resend is on a cooldown timer; mail-app shortcuts and a fix for a mistyped address sit underneath."
        >
          <Verify1 changeEmailHref="#signup-1" />
        </BlockDemo>
        <BlockDemo
          id="verify-2"
          n={2}
          title="Enter a code"
          name="verify-2"
          frameClassName={AUTO}
          description="A six-digit code from the email instead of a link. Completing it shows the verified state."
        >
          <Verify2 />
        </BlockDemo>
        <BlockDemo
          id="verify-3"
          n={3}
          title="In-app banner"
          name="verify-3"
          frameClassName={AUTO}
          description="For staff who skipped verification: a dismissible banner across the console and a locked publish action until the address is confirmed."
        >
          <Verify3 />
        </BlockDemo>
      </BlockGroup>
    </BlocksLayout>
  )
}
