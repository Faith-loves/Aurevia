import { OnboardingScreen } from "@/components/onboarding/onboarding-screen"

function OnboardingScreenOne() {
  return (
    <OnboardingScreen
      step={1}
      imageSrc="/images/aurevia-onboarding-one.png"
      imageAlt="Two deep-plum perfume bottles arranged with dark flowers and silk"
      imagePosition="object-[34%_center] md:object-[38%_center] lg:object-[40%_center]"
      eyebrow="Welcome"
      title={
        <>
          Welcome to <span className="text-aurevia-gold">Aurévia</span>
        </>
      }
      description="A world of exquisite fragrances, curated around your unique taste. Discover scents that feel personal, memorable, and entirely your own."
      supportingLine="Your signature scent starts here."
      nextHref="/onboarding/2"
      entranceFrom="left"
    />
  )
}

export { OnboardingScreenOne }
