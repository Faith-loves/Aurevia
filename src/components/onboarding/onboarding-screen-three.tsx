import { OnboardingScreen } from "@/components/onboarding/onboarding-screen"

function OnboardingScreenThree() {
  return (
    <OnboardingScreen
      step={3}
      imageSrc="/images/aurevia-onboarding-three.png"
      imageAlt="Two Aurévia perfume bottles arranged with deep-plum flowers and silk"
      imagePosition="object-[34%_center] md:object-[37%_center] lg:object-[39%_center]"
      eyebrow="Your journey begins"
      title={
        <>
          Let&apos;s Find
          <br />
          Your <span className="text-aurevia-gold">Signature Scent</span>
        </>
      }
      description="Tell us what you love, and we'll guide you toward fragrances that match your preferences, personality, and moments that matter."
      supportingLine="Your signature scent is closer than you think."
      previousHref="/onboarding/2"
      nextHref="/welcome"
      nextLabel="Get Started"
      completeOnNext
      entranceFrom="right"
    />
  )
}

export { OnboardingScreenThree }
