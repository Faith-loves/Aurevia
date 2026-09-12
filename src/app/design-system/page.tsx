import { Heart, PackageOpen } from "lucide-react"
import type { ReactNode } from "react"

import { EmptyState } from "@/components/common/empty-state"
import { Loader } from "@/components/common/loader"
import { Logo } from "@/components/common/logo"
import { Price } from "@/components/common/price"
import { Rating } from "@/components/common/rating"
import { SectionHeading } from "@/components/common/section-heading"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { IconButton } from "@/components/ui/icon-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

const colors = [
  { name: "Deep Plum", hex: "#4B2E3F", className: "bg-aurevia-plum" },
  { name: "Dusty Rose", hex: "#D9A7B0", className: "bg-aurevia-rose" },
  { name: "Champagne Gold", hex: "#C8A96B", className: "bg-aurevia-gold" },
  { name: "Warm Ivory", hex: "#FAF7F2", className: "bg-aurevia-ivory" },
  { name: "Soft Cream", hex: "#F2EAE4", className: "bg-aurevia-cream" },
  { name: "Charcoal", hex: "#231F20", className: "bg-aurevia-charcoal" },
  { name: "Muted Taupe", hex: "#7A6F72", className: "bg-aurevia-taupe" },
]

function PreviewSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="py-14 md:py-20">
      <div className="mb-8 flex items-center gap-4">
        <h2 className="text-eyebrow shrink-0 text-primary">{title}</h2>
        <Separator className="bg-aurevia-gold/50" />
      </div>
      {children}
    </section>
  )
}

export default function DesignSystemPage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <header className="border-b border-aurevia-gold/30 bg-secondary">
        <div className="aurevia-container relative py-16 md:py-24">
          <div
            aria-hidden="true"
            className="absolute -right-20 -top-24 size-72 rounded-full border border-aurevia-rose/50 md:size-96"
          />
          <Logo size="lg" />
          <div className="relative mt-16 max-w-3xl md:mt-24">
            <p className="text-eyebrow text-aurevia-gold">Visual foundation · 01</p>
            <h1 className="text-display-xl mt-4 text-primary">
              Aurévia Design System
            </h1>
            <p className="text-body-lg mt-6 max-w-xl text-muted-foreground">
              A warm, refined foundation for fragrance discovery—designed with
              quiet confidence and generous space.
            </p>
            <p className="mt-8 font-display text-2xl italic text-primary">
              Find a fragrance that feels like you.
            </p>
          </div>
        </div>
      </header>

      <div className="aurevia-container divide-y divide-border">
        <PreviewSection title="Brand colors">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {colors.map((color) => (
              <div key={color.name} className="overflow-hidden rounded-lg border bg-card">
                <div className={`h-28 ${color.className}`} />
                <div className="flex items-center justify-between gap-3 p-4">
                  <span className="text-sm font-medium">{color.name}</span>
                  <span className="text-caption font-mono text-muted-foreground">
                    {color.hex}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </PreviewSection>

        <PreviewSection title="Typography">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_0.6fr]">
            <div className="space-y-8">
              <p className="text-display text-primary">Scent, remembered.</p>
              <h1 className="text-heading-1">The art of discovery</h1>
              <h2 className="text-heading-2">An intimate signature</h2>
              <h3 className="text-heading-3">Notes that linger</h3>
            </div>
            <div className="space-y-6 border-l-0 border-aurevia-gold/40 lg:border-l lg:pl-10">
              <p className="text-eyebrow text-aurevia-gold">Editorial eyebrow</p>
              <p className="text-body-lg">
                Fragrance is personal—a quiet expression that arrives before
                words and remains after them.
              </p>
              <p className="text-body text-muted-foreground">
                Our body type balances clarity with a relaxed reading rhythm
                across every screen.
              </p>
              <p className="text-caption text-muted-foreground">
                Caption · Inter Regular · 12px
              </p>
            </div>
          </div>
        </PreviewSection>

        <PreviewSection title="Actions">
          <div className="flex flex-wrap items-center gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="luxury">Accent</Button>
            <Button disabled>Disabled</Button>
            <IconButton aria-label="Add to wishlist">
              <Heart />
            </IconButton>
          </div>
        </PreviewSection>

        <PreviewSection title="Forms">
          <div className="grid max-w-4xl gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input id="email" type="email" placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="disabled">Preferred fragrance family</Label>
              <Input id="disabled" value="Floral amber" disabled readOnly />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="memory">A scent memory</Label>
              <Textarea
                id="memory"
                placeholder="Tell us about a fragrance you remember…"
              />
            </div>
          </div>
        </PreviewSection>

        <PreviewSection title="Foundation components">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card variant="plain" className="bg-secondary">
              <CardHeader>
                <CardTitle className="text-heading-4 text-primary">
                  Plain card
                </CardTitle>
                <CardDescription>For calm, editorial content blocks.</CardDescription>
              </CardHeader>
              <CardContent>
                <Rating rating={4.8} reviewCount={128} />
                <div className="mt-4">
                  <Price amount={72500} originalAmount={85000} />
                </div>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="text-heading-4 text-primary">
                  Elevated card
                </CardTitle>
                <CardDescription>A soft lift for important content.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Badge variant="plum">New</Badge>
                <Badge variant="rose">Bestseller</Badge>
                <Badge variant="gold">Limited edition</Badge>
                <Badge variant="neutral">Unisex</Badge>
                <Badge variant="success">94% match</Badge>
              </CardContent>
            </Card>

            <Card variant="interactive">
              <CardHeader>
                <CardTitle className="text-heading-4 text-primary">
                  Interactive card
                </CardTitle>
                <CardDescription>Subtle feedback for selectable content.</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-4">
                <Loader label="Discovering fragrances" />
                <span className="text-sm text-muted-foreground">
                  Discovering your notes
                </span>
              </CardContent>
            </Card>
          </div>
        </PreviewSection>

        <PreviewSection title="Reusable compositions">
          <div className="grid gap-12 lg:grid-cols-2">
            <SectionHeading
              eyebrow="The Aurévia edit"
              title="Made for your senses"
              description="A flexible section introduction that keeps editorial hierarchy consistent across future screens."
            />
            <EmptyState
              icon={<PackageOpen className="size-5" />}
              title="Nothing here—yet"
              description="Empty states stay useful, warm and visually quiet."
              action={<Button variant="secondary">Explore options</Button>}
            />
          </div>
        </PreviewSection>
      </div>
    </main>
  )
}
