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
    title: "Selecție",
    description: "Explorează colecția noastră curatoriată de haine premium pentru bebeluși și copii de la branduri alese cu atenție. Selectezi 5 articole în mărimea și stilul dorit pe care le adaugi în coș.",
    icon: ShoppingBag
  },
  {
    number: "02",
    title: "Primești pachetul",
    description: "După ce plătești vei primi pachetul în 3-5 zile lucrătoare, pachet care vine cu o etichetă pentru retur și un ghid de îngrijire. Tot ce primești este curățat profesional, potrivit pentru tenul bebelușului tău.",
    icon: Package
  },
  {
    number: "03",
    title: "Purtați hainele fără griji",
    description: "Îl îmbraci pe cel mic în haine una și una! Deteriorarea normală este inclusă în asigurare, la fel și mici pete.",
    icon: Sparkles
  },
  {
    number: "04",
    title: "Returnezi și comanzi altele",
    description: "La finalul celor 3 luni de abonament returnezi produsele folosind eticheta inclusă în pachetul inițial și vezi ce îți mai surâde din colecție. Actualizăm constant garderoba.",
    icon: Repeat
  }
];

const FEATURES = [
  {
    icon: Shield,
    title: "Asigurare pentru pete și deteriorare",
    description: "Uzura normală e acoperită de abonament. Nu trebuie să îți faci griji pentru pete mici sau rupturi."
  },
  {
    icon: Sparkles,
    title: "Curățenie profesională",
    description: "Fiecare articol este curățat la spălătorie ecologică între ciclurile de închiriere."
  },
  {
    icon: Timer,
    title: "1 ciclu de 3 luni",
    description: "Închiriere sezonieră pentru a veni în întâmpinarea măsurilor și a anotimpurilor."
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
              Cum funcționează
            </h1>
            <p
              className="text-lg md:text-xl leading-relaxed mb-8"
              style={{ color: C.textBrown }}
            >
              Primești ce ți-ai ales din selecția noastră direct la tine acasă. Cel mic le poartă
              3 luni sau până când îi rămân mici, după care le returnezi și alegi alte haine în
              abonamentul sezonier.
            </p>
            <Link href="/catalog">
              <span
                className="inline-flex items-center gap-2 px-8 py-3 text-base font-medium text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: C.red }}
              >
                Explorează selecția
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
              4 pași simpli
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
              Ce e inclus
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
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
              Preț unic
            </h2>

            <div
              className="p-8 md:p-12"
              style={{ backgroundColor: C.beige }}
            >
              <div
                className="text-5xl md:text-6xl font-light mb-2"
                style={{ color: C.red }}
              >
                350 lei
              </div>
              <p
                className="text-lg mb-6"
                style={{ color: C.darkBrown }}
              >
                pe sezon (3 luni)
              </p>

              <ul className="space-y-3 text-left max-w-sm mx-auto mb-8">
                {[
                  "5 produse la alegere din colecția premium",
                  "Asigurare pentru uzură și pete",
                  "Curățare profesională între folosiri",
                  "Etichetă de retur inclusă",
                  "Fără obligații pe termen lung"
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
                  Începe acum
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
              De ce să închiriezi vs să cumperi?
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
                  Cumpărare
                </h3>
                <ul className="space-y-3 text-sm" style={{ color: C.textBrown }}>
                  <li className="flex items-start gap-3">
                    <span>✗</span>
                    <span>3000 lei+ pe an pe haine care rămân mici în câteva luni</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span>✗</span>
                    <span>Dulapuri pline de haine pe care nu le mai folosești</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span>✗</span>
                    <span>Impactul lanțurilor de fast fashion asupra modei</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span>✗</span>
                    <span>Timp și energie pentru sortare și revânzare</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span>✗</span>
                    <span>Spațiu de depozitare</span>
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
                    <span>1400 lei pe an pentru haine de la branduri premium</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span style={{ color: C.red }}>✓</span>
                    <span>Reîmprospătarea garderobei în fiecare sezon</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span style={{ color: C.red }}>✓</span>
                    <span>Modă circulară, sustenabilă</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span style={{ color: C.red }}>✓</span>
                    <span>Retururi simple cu etichete pregătite</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span style={{ color: C.red }}>✓</span>
                    <span>Fără depozitare și timp pierdut</span>
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
              Ești gata să începi?
            </h2>
            <p className="text-white/80 mb-8">
              Uită-te în colecția noastră și alege primele 5 articole din abonament.
              Și fii parte din schimbare.
            </p>
            <Link href="/catalog">
              <span
                className="inline-flex items-center gap-2 px-8 py-3 text-base font-medium hover:opacity-90 transition-opacity"
                style={{ backgroundColor: C.white, color: C.red }}
              >
                Explorează selecția
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
