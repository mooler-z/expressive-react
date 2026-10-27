import { BlocksCarousel, FinalCta, Stats } from "@/docs/site/landing/blocks-and-cta"
import { Pillars, YourCode } from "@/docs/site/landing/code-and-pillars"
import { Hero } from "@/docs/site/landing/hero"
import { DynamicColor, Motion } from "@/docs/site/landing/motion-and-color"
import { Showcase } from "@/docs/site/landing/showcase"

/**
 * The Expressive React homepage (design-reference/site/Landing.dc.html).
 * Every specimen is a real library component; `data-spec` attributes feed the Specs overlay.
 */
export function LandingPage() {
  return (
    <main>
      <Hero />
      <YourCode />
      <Pillars />
      <Motion />
      <DynamicColor />
      <Showcase />
      <BlocksCarousel />
      <Stats />
      <FinalCta />
    </main>
  )
}
