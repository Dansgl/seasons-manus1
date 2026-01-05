/**
 * About Us Page - Seasons Story and Mission
 */

import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Leaf, Heart, Recycle, Users, type LucideIcon } from "lucide-react";
import { Header, Footer, FAQSection, V6_COLORS as C } from "@/components/v6";
import { fetchAboutPage, type SanityAboutPage } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";

// Map icon names to components
const iconMap: Record<string, LucideIcon> = {
  Leaf,
  Heart,
  Recycle,
  Users,
};

export default function About() {
  const { data: aboutPage } = useQuery<SanityAboutPage>({
    queryKey: ["sanity", "aboutPage"],
    queryFn: fetchAboutPage,
  });

  // Default values for when Sanity data isn't set
  const heroTitle = aboutPage?.heroTitle || "Rethinking Baby Fashion";
  const heroSubtitle = aboutPage?.heroSubtitle || "We believe every baby deserves beautiful, high-quality clothing without the waste. Seasons is building a circular fashion future for families.";

  const missionTitle = aboutPage?.missionSection?.title || "Our Mission";
  const valuesTitle = aboutPage?.valuesSection?.title || "Our Values";
  const storyTitle = aboutPage?.storySection?.title || "Our Story";
  const impactTitle = aboutPage?.impactSection?.title || "Our Impact";
  const ctaTitle = aboutPage?.ctaSection?.title || "Join the Movement";
  const ctaContent = aboutPage?.ctaSection?.content || "Start your sustainable parenting journey with Seasons. €70 per quarter for 5 premium items.";
  const ctaButtonText = aboutPage?.ctaSection?.buttonText || "Browse Collection";
  const ctaButtonLink = aboutPage?.ctaSection?.buttonLink || "/catalog";

  // Default values
  const defaultValues = [
    { title: "Sustainability", description: "Every rental extends a garment's life and reduces fashion waste.", icon: "Leaf" },
    { title: "Quality", description: "Only premium European brands that meet our strict standards.", icon: "Heart" },
    { title: "Care", description: "Professional Ozone cleaning ensures hygiene between every use.", icon: "Recycle" },
    { title: "Community", description: "Building a network of families who share our vision.", icon: "Users" },
  ];

  const defaultStats = [
    { value: "5+", label: "Lives per garment" },
    { value: "80%", label: "Less waste vs buying" },
    { value: "50+", label: "Premium brands" },
    { value: "100%", label: "Ozone cleaned" },
  ];

  const values = aboutPage?.valuesSection?.values?.length ? aboutPage.valuesSection.values : defaultValues;
  const stats = aboutPage?.impactSection?.stats?.length ? aboutPage.impactSection.stats : defaultStats;

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
              {heroTitle}
            </h1>
            <p
              className="text-lg md:text-xl leading-relaxed"
              style={{ color: C.textBrown }}
            >
              {heroSubtitle}
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
                  {missionTitle}
                </h2>
                <div className="space-y-4" style={{ color: C.textBrown }}>
                  {aboutPage?.missionSection?.content ? (
                    <PortableText value={aboutPage.missionSection.content} />
                  ) : (
                    <>
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
                    </>
                  )}
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
              {valuesTitle}
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const IconComponent = iconMap[value.icon] || Leaf;
                return (
                  <div key={index} className="text-center">
                    <div
                      className="w-16 h-16 mx-auto mb-4 flex items-center justify-center"
                      style={{ backgroundColor: C.white }}
                    >
                      <IconComponent className="w-8 h-8" style={{ color: C.red }} />
                    </div>
                    <h3
                      className="font-semibold mb-2"
                      style={{ color: C.darkBrown }}
                    >
                      {value.title}
                    </h3>
                    <p className="text-sm" style={{ color: C.textBrown }}>
                      {value.description}
                    </p>
                  </div>
                );
              })}
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
              {storyTitle}
            </h2>
            <div className="space-y-4" style={{ color: C.textBrown }}>
              {aboutPage?.storySection?.content ? (
                <PortableText value={aboutPage.storySection.content} />
              ) : (
                <>
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
                </>
              )}
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
              {impactTitle}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={index}>
                  <div
                    className="text-4xl md:text-5xl font-light mb-2"
                    style={{ color: C.red }}
                  >
                    {stat.value}
                  </div>
                  <p className="text-sm" style={{ color: C.textBrown }}>
                    {stat.label}
                  </p>
                </div>
              ))}
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
              {ctaTitle}
            </h2>
            <p className="text-white/80 mb-8">
              {ctaContent}
            </p>
            <Link href={ctaButtonLink}>
              <span
                className="inline-block px-8 py-3 text-base font-medium hover:opacity-90 transition-opacity"
                style={{ backgroundColor: C.white, color: C.red }}
              >
                {ctaButtonText}
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
