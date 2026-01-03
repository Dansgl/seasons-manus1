/**
 * About Us Page - Seasons Story and Mission
 */

import { Link } from "wouter";
import { Leaf, Heart, Recycle, Users } from "lucide-react";
import { Header, Footer, FAQSection, V6_COLORS as C } from "@/components/v6";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: C.beige }}>
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1
              className="text-3xl md:text-5xl tracking-tight mb-6"
              style={{ color: C.darkBrown }}
            >
              Rethinking Baby Fashion
            </h1>
            <p
              className="text-lg md:text-xl leading-relaxed"
              style={{ color: C.textBrown }}
            >
              We believe every baby deserves beautiful, high-quality clothing without
              the waste. Seasons is building a circular fashion future for families.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 md:py-20" style={{ backgroundColor: C.white }}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2
                  className="text-2xl md:text-3xl mb-6"
                  style={{ color: C.darkBrown }}
                >
                  Our Mission
                </h2>
                <div className="space-y-4" style={{ color: C.textBrown }}>
                  <p className="leading-relaxed">
                    Babies grow fast. In the first year alone, they typically go through
                    7 clothing sizes. That's a lot of clothes that get worn for just a
                    few weeks before being outgrown.
                  </p>
                  <p className="leading-relaxed">
                    At Seasons, we're on a mission to break the cycle of buy-use-discard.
                    We give premium baby clothing multiple lives, reducing waste while
                    giving families access to designer quality at a fraction of the cost.
                  </p>
                  <p className="leading-relaxed">
                    Our circular model means less production, less waste in landfills,
                    and more joy in every tiny outfit.
                  </p>
                </div>
              </div>
              <div
                className="aspect-square flex items-center justify-center"
                style={{ backgroundColor: C.beige }}
              >
                <Recycle className="w-32 h-32" style={{ color: C.lavender }} />
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-6">
            <h2
              className="text-2xl md:text-3xl text-center mb-12"
              style={{ color: C.darkBrown }}
            >
              Our Values
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Sustainability */}
              <div className="text-center">
                <div
                  className="w-16 h-16 mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: C.white }}
                >
                  <Leaf className="w-8 h-8" style={{ color: C.red }} />
                </div>
                <h3
                  className="font-semibold mb-2"
                  style={{ color: C.darkBrown }}
                >
                  Sustainability
                </h3>
                <p className="text-sm" style={{ color: C.textBrown }}>
                  Every rental extends a garment's life and reduces fashion waste.
                </p>
              </div>

              {/* Quality */}
              <div className="text-center">
                <div
                  className="w-16 h-16 mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: C.white }}
                >
                  <Heart className="w-8 h-8" style={{ color: C.red }} />
                </div>
                <h3
                  className="font-semibold mb-2"
                  style={{ color: C.darkBrown }}
                >
                  Quality
                </h3>
                <p className="text-sm" style={{ color: C.textBrown }}>
                  Only premium European brands that meet our strict standards.
                </p>
              </div>

              {/* Care */}
              <div className="text-center">
                <div
                  className="w-16 h-16 mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: C.white }}
                >
                  <Recycle className="w-8 h-8" style={{ color: C.red }} />
                </div>
                <h3
                  className="font-semibold mb-2"
                  style={{ color: C.darkBrown }}
                >
                  Care
                </h3>
                <p className="text-sm" style={{ color: C.textBrown }}>
                  Professional Ozone cleaning ensures hygiene between every use.
                </p>
              </div>

              {/* Community */}
              <div className="text-center">
                <div
                  className="w-16 h-16 mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: C.white }}
                >
                  <Users className="w-8 h-8" style={{ color: C.red }} />
                </div>
                <h3
                  className="font-semibold mb-2"
                  style={{ color: C.darkBrown }}
                >
                  Community
                </h3>
                <p className="text-sm" style={{ color: C.textBrown }}>
                  Building a network of families who share our vision.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 md:py-20" style={{ backgroundColor: C.white }}>
          <div className="max-w-3xl mx-auto px-6">
            <h2
              className="text-2xl md:text-3xl text-center mb-8"
              style={{ color: C.darkBrown }}
            >
              Our Story
            </h2>
            <div className="space-y-4" style={{ color: C.textBrown }}>
              <p className="leading-relaxed">
                Seasons was born from a simple observation: our closets were overflowing
                with beautiful baby clothes that were worn only a handful of times before
                being outgrown.
              </p>
              <p className="leading-relaxed">
                We saw friends passing bags of clothes between families, charity shops
                bursting with tiny garments, and landfills receiving millions of
                textile items each year. There had to be a better way.
              </p>
              <p className="leading-relaxed">
                So we created Seasons — a rental service that gives premium baby clothing
                the extended life it deserves. Each garment in our collection is carefully
                curated, professionally cleaned, and loved by multiple families before
                being responsibly recycled.
              </p>
              <p className="leading-relaxed">
                Based in Slovakia and serving families across Europe, we're proud to be
                part of the circular fashion movement. Every subscription is a step toward
                a more sustainable future for our children.
              </p>
            </div>
          </div>
        </section>

        {/* Impact Stats */}
        <section className="py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-6">
            <h2
              className="text-2xl md:text-3xl text-center mb-12"
              style={{ color: C.darkBrown }}
            >
              Our Impact
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div
                  className="text-4xl md:text-5xl font-light mb-2"
                  style={{ color: C.red }}
                >
                  5+
                </div>
                <p className="text-sm" style={{ color: C.textBrown }}>
                  Lives per garment
                </p>
              </div>
              <div>
                <div
                  className="text-4xl md:text-5xl font-light mb-2"
                  style={{ color: C.red }}
                >
                  80%
                </div>
                <p className="text-sm" style={{ color: C.textBrown }}>
                  Less waste vs buying
                </p>
              </div>
              <div>
                <div
                  className="text-4xl md:text-5xl font-light mb-2"
                  style={{ color: C.red }}
                >
                  50+
                </div>
                <p className="text-sm" style={{ color: C.textBrown }}>
                  Premium brands
                </p>
              </div>
              <div>
                <div
                  className="text-4xl md:text-5xl font-light mb-2"
                  style={{ color: C.red }}
                >
                  100%
                </div>
                <p className="text-sm" style={{ color: C.textBrown }}>
                  Ozone cleaned
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          className="py-16 md:py-20 text-center"
          style={{ backgroundColor: C.red }}
        >
          <div className="max-w-2xl mx-auto px-6">
            <h2 className="text-2xl md:text-3xl text-white mb-4">
              Join the Movement
            </h2>
            <p className="text-white/80 mb-8">
              Start your sustainable parenting journey with Seasons.
              €70 per quarter for 5 premium items.
            </p>
            <Link href="/catalog">
              <span
                className="inline-block px-8 py-3 text-base font-medium hover:opacity-90 transition-opacity"
                style={{ backgroundColor: C.white, color: C.red }}
              >
                Browse Collection
              </span>
            </Link>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQSection />
      </main>

      <Footer />
    </div>
  );
}
