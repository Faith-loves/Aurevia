import { OnboardingScreen } from "@/components/onboarding/onboarding-screen"

function OnboardingScreenTwo() {
  return (
    <OnboardingScreen
      step={2}
      imageSrc="/images/aurevia-onboarding-two.png"
      imageAlt="Aurévia perfume bottles surrounded by deep-plum flowers and silk"
      imagePosition="object-[35%_center] md:object-[38%_center] lg:object-[40%_center]"
      eyebrow="Crafted for you"
      title={
        <>
          Curated Scents,
          <br />
          Made <span className="text-aurevia-gold">Personal</span>
        </>
      }
      description="We carefully curate fragrances around your preferences, helping you discover scents that complement your mood, your style, and your story."
      supportingLine="Because fragrance should feel personal."
      previousHref="/onboarding"
      nextHref="/onboarding/3"
      entranceFrom="right"
    />
  )
}

export { OnboardingScreenTwo }
