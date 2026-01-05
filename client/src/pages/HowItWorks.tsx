/**
 * How It Works Page - Step by step guide to Seasons
 */

import { Link } from "wouter";
import {
  ShoppingBag,
  Package,
  Sparkles,
  Repeat,
  ArrowRight,
  Shield,
  Truck,
  Timer
} from "lucide-react";
import { Header, Footer, FAQSection, V6_COLORS as C } from "@/components/v6";

const STEPS = [
  {
    number: "01",
    title: "Browse & Select",
    description: "Explore our curated collection of premium baby clothing from top European brands. Pick 5 items that match your baby's current size and style.",
    icon: ShoppingBag
  },
  {
    number: "02",
    title: "Receive Your Box",
    description: "Your box arrives within 3-5 business days. Each item is professionally cleaned with Ozone technology, individually packaged, and ready to wear.",
    icon: Package
  },
  {
    number: "03",
    title: "Enjoy for 3 Months",
    description: "Dress your little one in designer pieces! Normal wear and tear is covered. Spills happen — we've got you covered with included insurance.",
    icon: Sparkles
  },
  {
    number: "04",
    title: "Swap & Repeat",
    description: "When your cycle ends, return your items using the pre-paid label and select 5 new pieces in the next size up. The fashion never stops!",
    icon: Repeat
  }
];

const FEATURES = [
  {
    icon: Shield,
    title: "Insurance Included",
    description: "Normal wear and tear is covered. No need to stress over small accidents."
  },
  {
    icon: Sparkles,
    title: "Ozone Cleaned",
    description: "Hospital-grade sanitization between every use for complete peace of mind."
  },
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Both ways! We send items to you and provide a pre-paid return label."
  },
  {
    icon: Timer,
    title: "3-Month Cycles",
    description: "Perfectly timed to match your baby's growth spurts and changing needs."
  }
];

export default function HowItWorks() {
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
              How Seasons Works
            </h1>
            <p
              className="text-lg md:text-xl leading-relaxed mb-8"
              style={{ color: C.textBrown }}
            >
              Premium baby clothing, delivered to your door. Keep what you love for 3 months,
              then swap for the next size. Simple, sustainable, stylish.
            </p>
            <Link href="/catalog">
              <span
                className="inline-flex items-center gap-2 px-8 py-3 text-base font-medium text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: C.red }}
              >
                Start Browsing
                <ArrowRight className="w-5 h-5" />
              </span>
            </Link>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-16 md:py-20" style={{ backgroundColor: C.white }}>
          <div className="max-w-6xl mx-auto px-6">
            <h2
              className="text-2xl md:text-3xl text-center mb-16"
              style={{ color: C.darkBrown }}
            >
              Four Simple Steps
            </h2>

            <div className="space-y-12 md:space-y-0 md:grid md:grid-cols-4 md:gap-8">
              {STEPS.map((step, index) => (
                <div key={step.number} className="relative">
                  {/* Connector line (desktop only) */}
                  {index < STEPS.length - 1 && (
                    <div
                      className="hidden md:block absolute top-12 left-1/2 w-full h-0.5"
                      style={{ backgroundColor: C.lavender }}
                    />
                  )}

                  <div className="relative text-center">
                    {/* Step Number */}
                    <div
                      className="w-24 h-24 mx-auto mb-4 flex items-center justify-center"
                      style={{ backgroundColor: C.beige }}
                    >
                      <step.icon className="w-10 h-10" style={{ color: C.red }} />
                    </div>

                    {/* Number Badge */}
                    <div
                      className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-8 h-8 flex items-center justify-center text-xs font-bold text-white"
                      style={{ backgroundColor: C.red }}
                    >
                      {step.number}
                    </div>

                    <h3
                      className="font-semibold mb-2"
                      style={{ color: C.darkBrown }}
                    >
                      {step.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: C.textBrown }}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-6">
            <h2
              className="text-2xl md:text-3xl text-center mb-12"
              style={{ color: C.darkBrown }}
            >
              What's Included
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className="p-6"
                  style={{ backgroundColor: C.white }}
                >
                  <div
                    className="w-12 h-12 mb-4 flex items-center justify-center"
                    style={{ backgroundColor: C.beige }}
                  >
                    <feature.icon className="w-6 h-6" style={{ color: C.red }} />
                  </div>
                  <h3
                    className="font-semibold mb-2"
                    style={{ color: C.darkBrown }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-sm"
                    style={{ color: C.textBrown }}
                  >
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 md:py-20" style={{ backgroundColor: C.white }}>
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2
              className="text-2xl md:text-3xl mb-8"
              style={{ color: C.darkBrown }}
            >
              Simple Pricing
            </h2>

            <div
              className="p-8 md:p-12"
              style={{ backgroundColor: C.beige }}
            >
              <div
                className="text-5xl md:text-6xl font-light mb-2"
                style={{ color: C.red }}
              >
                350 RON
              </div>
              <p
                className="text-lg mb-6"
                style={{ color: C.darkBrown }}
              >
                per quarter (3 months)
              </p>

              <ul className="space-y-3 text-left max-w-sm mx-auto mb-8">
                {[
                  "5 premium designer items",
                  "Free shipping both ways",
                  "Insurance for wear & tear",
                  "Professional Ozone cleaning",
                  "Pre-paid return label",
                  "Cancel anytime"
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-sm"
                    style={{ color: C.textBrown }}
                  >
                    <span style={{ color: C.red }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>

              <Link href="/catalog">
                <span
                  className="inline-block px-8 py-3 text-base font-medium text-white hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: C.red }}
                >
                  Get Started
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-6">
            <h2
              className="text-2xl md:text-3xl text-center mb-12"
              style={{ color: C.darkBrown }}
            >
              Why Rent vs Buy?
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Buying */}
              <div
                className="p-6"
                style={{ backgroundColor: C.white }}
              >
                <h3
                  className="font-semibold mb-4 pb-4 border-b"
                  style={{ color: C.textBrown, borderColor: C.lavender }}
                >
                  Buying
                </h3>
                <ul className="space-y-3 text-sm" style={{ color: C.textBrown }}>
                  <li className="flex items-start gap-3">
                    <span>✗</span>
                    <span>€500+ per year on clothes quickly outgrown</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span>✗</span>
                    <span>Closets full of unused items</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span>✗</span>
                    <span>Environmental impact of fast fashion</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span>✗</span>
                    <span>Hassle of reselling or donating</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span>✗</span>
                    <span>Storage space needed</span>
                  </li>
                </ul>
              </div>

              {/* Seasons */}
              <div
                className="p-6 border-2"
                style={{ backgroundColor: C.white, borderColor: C.red }}
              >
                <h3
                  className="font-semibold mb-4 pb-4 border-b"
                  style={{ color: C.red, borderColor: C.lavender }}
                >
                  Seasons
                </h3>
                <ul className="space-y-3 text-sm" style={{ color: C.textBrown }}>
                  <li className="flex items-start gap-3">
                    <span style={{ color: C.red }}>✓</span>
                    <span>€280 per year for premium designer clothes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span style={{ color: C.red }}>✓</span>
                    <span>Fresh rotation every quarter</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span style={{ color: C.red }}>✓</span>
                    <span>Circular, sustainable fashion</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span style={{ color: C.red }}>✓</span>
                    <span>Simple returns with pre-paid labels</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span style={{ color: C.red }}>✓</span>
                    <span>No storage, no clutter</span>
                  </li>
                </ul>
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
              Ready to Start?
            </h2>
            <p className="text-white/80 mb-8">
              Browse our collection and pick your first 5 items.
              Your baby's wardrobe refresh is just a few clicks away.
            </p>
            <Link href="/catalog">
              <span
                className="inline-flex items-center gap-2 px-8 py-3 text-base font-medium hover:opacity-90 transition-opacity"
                style={{ backgroundColor: C.white, color: C.red }}
              >
                Browse Collection
                <ArrowRight className="w-5 h-5" />
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
