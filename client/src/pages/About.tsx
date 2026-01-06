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
  const heroTitle = aboutPage?.heroTitle || "Seasons";
  const heroSubtitle = aboutPage?.heroSubtitle || "Hainele pot avea viață lungă dacă circulă între familii. Tu poți avea viață mai ușoară dacă scapi de grija lor. Cei mici pot fi și mai cuceritori în albumul de familie.";

  const missionTitle = aboutPage?.missionSection?.title || "Misiunea noastră";
  const valuesTitle = aboutPage?.valuesSection?.title || "Valorile noastre";
  const storyTitle = aboutPage?.storySection?.title || "Povestea noastră";
  const impactTitle = aboutPage?.impactSection?.title || "Impact";
  const ctaTitle = aboutPage?.ctaSection?.title || "Alătură-te comunității noastre";
  const ctaContent = aboutPage?.ctaSection?.content || "Încearcă o alternativă sustenabilă închiriind haine pentru cel mic începând de la 350 lei pe sezon. Primul tău pachet poate ajunge în 3-5 zile. 5 articole premium. Curățare inclusă. Fără obligații pe termen lung.";
  const ctaButtonText = aboutPage?.ctaSection?.buttonText || "Explorează selecția";
  const ctaButtonLink = aboutPage?.ctaSection?.buttonLink || "/catalog";

  // Default values
  const defaultValues = [
    { title: "Sustenabilitate", description: "Fiecare ciclu de închiriere extinde viața unui articol și reduce risipa.", icon: "Leaf" },
    { title: "Calitate", description: "Numai branduri premium care produc cu materiale de calitate, durabile și atenție la detalii.", icon: "Heart" },
    { title: "Grijă", description: "Curățare profesională și mici reparații între ciclurile de închiriere.", icon: "Recycle" },
    { title: "Comunitate", description: "Întâlnirea cu un grup de familii care îți împărtășesc viziunea.", icon: "Users" },
  ];

  const defaultStats = [
    { value: "5+", label: "Cicluri pe articol" },
    { value: "80%", label: "Mai puțină risipă vs cumpărat" },
    { value: "100%", label: "Curățare profesională" },
    { value: "3-5", label: "Zile livrare" },
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
                        Copiii cresc repede. 7 mărimi în primii 2 ani. Haine purtate câteva
                        săptămâni, apoi lăsate deoparte. Peste 183 de milioane de articole
                        ajung anual în gropile de gunoi.
                      </p>
                      <p className="leading-relaxed">
                        La Seasons ne-am propus să oprim ciclul ăsta de cumpărat-purtat-aruncat.
                        Dăm hainelor mai multe vieți, reducem risipa și oferim familiilor acces
                        la calitate premium la o fracțiune din preț.
                      </p>
                      <p className="leading-relaxed">
                        Lucrăm cu branduri care produc etic, local, cu materiale de calitate.
                        Modelul nostru circular înseamnă mai puțină producție, mai puțină risipă
                        și mai multă bucurie în fiecare ținută mică.
                      </p>
                    </>
                  )}
                </div>
              </div>
              <div className="aspect-square overflow-hidden">
                <img
                  src="/about-story.jpg"
                  alt="Mama și copilul jucându-se împreună"
                  className="w-full h-full object-cover"
                />
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
                    Seasons a pornit de la o pasiune pentru haine și design - combinații inedite
                    și piese de calitate pe care le ții 10 ani în garderobă.
                  </p>
                  <p className="leading-relaxed">
                    Apoi a apărut un bebeluș în ecuație. Bineînțeles că m-a luat valul - la 2 noaptea
                    scrollam prin body-uri, tricouașe și salopete simpatice. După câteva sesiuni de
                    shopping online în miez de noapte, mi-am dat seama că nu ai cum să investești în
                    haine de calitate pentru el. N-are sens. Crește prea repede.
                  </p>
                  <p className="leading-relaxed">
                    Alternativele? Fast fashion cu ofertă accesibilă, dar poate nu aceeași calitate.
                    Grupuri de Facebook unde vânezi măsura potrivită. OLX și Vinted pe care dai scroll
                    cu orele. Pachetul de la prietena care îți dă hainele rămase mici.
                  </p>
                  <p className="leading-relaxed">
                    Ne-am imaginat o garderobă comună. Haine în care investești pe termen lung, pe care
                    le alegi cu atenție și de care ai grijă. Pentru că cei mici le poartă atât de puțin,
                    are mult mai mult sens să le închiriezi pe o perioadă limitată și să le returnezi.
                    Alte familii se bucură de ele fără bătăi de cap.
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
