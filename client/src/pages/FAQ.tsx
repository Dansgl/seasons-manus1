/**
 * FAQ Page - Complete frequently asked questions
 */

import { useState } from "react";
import { Link } from "wouter";
import { ChevronDown, Search } from "lucide-react";
import { Header, Footer, V6_COLORS as C } from "@/components/v6";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const ALL_FAQS: FAQItem[] = [
  // Primii pași
  {
    category: "Primii pași",
    question: "Cum funcționează Seasons?",
    answer: "Seasons este un serviciu de închiriere haine pentru bebeluși prin abonament. Pentru 350 lei pe sezon, selectezi 5 articole premium de designer. Ți le trimitem acasă, le folosești 3 luni, apoi le returnezi pentru o nouă selecție în mărimea următoare. Atât de simplu!"
  },
  {
    category: "Primii pași",
    question: "Pentru cine este Seasons?",
    answer: "Seasons este perfect pentru părinții care vor haine de designer de înaltă calitate fără risipă. Fie că îți pasă de sustenabilitate, iubești brandurile premium, sau pur și simplu vrei să economisești pe haine pe care bebelușul le va depăși rapid, Seasons este pentru tine."
  },
  {
    category: "Primii pași",
    question: "Ce mărimi aveți?",
    answer: "Avem mărimi de la nou-născut (0-3 luni) până la copii mici (până la 3 ani). Colecția noastră crește odată cu copilul tău, făcând ușor trecerea la mărimea următoare în fiecare sezon."
  },
  {
    category: "Primii pași",
    question: "Ce branduri aveți?",
    answer: "Colaborăm cu branduri premium europene precum Happymess, Studio Koter, Maru+Bo și multe altele. Fiecare articol din colecția noastră respectă standardele noastre stricte de calitate."
  },

  // Abonament și prețuri
  {
    category: "Abonament și prețuri",
    question: "Cât costă Seasons?",
    answer: "Seasons costă 350 lei pe sezon (3 luni). Aceasta include 5 articole premium, asigurare pentru uzură normală și pete, și curățenie profesională între utilizări."
  },
  {
    category: "Abonament și prețuri",
    question: "Pot să anulez abonamentul?",
    answer: "Da! Poți anula oricând din contul tău, fără penalități. Pur și simplu returnează articolele curente folosind eticheta de retur, și abonamentul se va încheia."
  },
  {
    category: "Abonament și prețuri",
    question: "Când sunt taxat?",
    answer: "Ești taxat 350 lei când începi abonamentul și apoi la fiecare 3 luni la începutul fiecărui nou ciclu. Îți vom trimite un reminder înainte de fiecare dată de facturare."
  },
  {
    category: "Abonament și prețuri",
    question: "Ce metode de plată acceptați?",
    answer: "Acceptăm toate cardurile de credit majore (Visa, Mastercard, American Express) și PayPal. Toate plățile sunt procesate în siguranță."
  },

  // Livrare și retururi
  {
    category: "Livrare și retururi",
    question: "Unde livrați?",
    answer: "În prezent livrăm în România. Ne extindem în curând și în alte țări europene!"
  },
  {
    category: "Livrare și retururi",
    question: "Cât durează livrarea?",
    answer: "Livrarea standard durează 3-5 zile lucrătoare. Vei primi un număr de tracking odată ce pachetul tău este expediat."
  },
  {
    category: "Livrare și retururi",
    question: "Cum returnez articolele?",
    answer: "Simplu! Fiecare pachet include o etichetă de retur. Pur și simplu împachetează articolele în ambalajul original, atașează eticheta și predă-l la orice punct poștal. Noi ne ocupăm de restul."
  },
  {
    category: "Livrare și retururi",
    question: "Când trebuie să returnez articolele?",
    answer: "Articolele trebuie returnate până la sfârșitul ciclului de 3 luni. Îți vom trimite remindere când se deschide și se apropie fereastra de retur. Retururile întârziate pot afecta următorul pachet."
  },

  // Calitate și îngrijire
  {
    category: "Calitate și îngrijire",
    question: "Sunt articolele curate și sigure?",
    answer: "Absolut. Fiecare articol trece prin curățenie profesională între utilizări la o spălătorie ecologică. Aceasta elimină 99.9% din bacterii și alergeni, fiind totodată blândă cu țesăturile."
  },
  {
    category: "Calitate și îngrijire",
    question: "În ce stare sunt articolele?",
    answer: "Toate articolele sunt în stare excelentă. Inspectăm cu atenție fiecare piesă înainte și după fiecare închiriere. Articolele care prezintă uzură semnificativă sunt retrase din circulație."
  },
  {
    category: "Calitate și îngrijire",
    question: "Ce se întâmplă dacă un articol ajunge deteriorat?",
    answer: "Te rugăm să ne contactezi în 48 de ore de la primirea pachetului. Vom aranja un înlocuitor și vom furniza o etichetă de retur pentru articolul deteriorat."
  },
  {
    category: "Calitate și îngrijire",
    question: "Cum să îngrijesc articolele închiriate?",
    answer: "Îngrijește-le așa cum ai face cu propriile haine! Urmează etichetele de îngrijire, spală cu culori similare și evită înălbitorul. Uzura normală este așteptată și acoperită de asigurarea noastră."
  },

  // Deteriorare și asigurare
  {
    category: "Deteriorare și asigurare",
    question: "Ce se întâmplă dacă bebelușul deteriorează un articol?",
    answer: "Uzura normală este inclusă — știm că bebelușii se murdăresc! Pete mici, zgârieturi minore și semne de utilizare generală sunt toate acoperite. Doar deteriorarea excesivă (rupturi mari, pete permanente din neglijență, articole lipsă) poate implica costuri suplimentare."
  },
  {
    category: "Deteriorare și asigurare",
    question: "Ce se consideră uzură normală?",
    answer: "Pete mici de mâncare (putem îndepărta majoritatea!), scămoșare minoră, decolorare ușoară de la spălare, zgârieturi mici și înmuierea generală a țesăturii. Practic, dacă bebelușul tău a purtat și a iubit, ești acoperit."
  },
  {
    category: "Deteriorare și asigurare",
    question: "Există o franciză sau deductibilă?",
    answer: "Nu. Asigurarea noastră este inclusă în abonament fără costuri suplimentare pentru deteriorarea acoperită. Taxăm doar pentru deteriorare excesivă sau articole pierdute."
  },

  // Selectarea articolelor
  {
    category: "Selectarea articolelor",
    question: "Pot să aleg articole specifice?",
    answer: "Da! Răsfoiești catalogul nostru complet și selectezi exact care 5 articole vrei. Nicio surpriză aici — tu alegi ce îți place."
  },
  {
    category: "Selectarea articolelor",
    question: "Ce se întâmplă dacă ceva ce vreau nu este disponibil?",
    answer: "Unele articole populare pot fi în curs de închiriere. Adaugă-le la lista de dorințe și te vom notifica când sunt din nou disponibile. Între timp, explorează stiluri similare!"
  },
  {
    category: "Selectarea articolelor",
    question: "Pot să schimb articole în timpul ciclului?",
    answer: "Cele 5 articole sunt ale tale pentru întregul ciclu de 3 luni. La sfârșitul fiecărui ciclu, vei avea o fereastră de schimb pentru a selecta următoarele 5 articole. Aceasta asigură că ai mereu piese perfect dimensionate pentru bebelușul tău în creștere."
  },
  {
    category: "Selectarea articolelor",
    question: "Pot să păstrez un articol care îmi place?",
    answer: "În prezent, toate articolele trebuie returnate. Lucrăm la o opțiune de 'cumpără pentru a păstra' pentru viitor. Rămâi pe fază!"
  }
];

// Get unique categories
const CATEGORIES = [...new Set(ALL_FAQS.map(faq => faq.category))];

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Filter FAQs based on search and category
  const filteredFAQs = ALL_FAQS.filter(faq => {
    const matchesSearch = searchTerm === "" ||
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === null || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Group by category for display
  const groupedFAQs = CATEGORIES.reduce((acc, category) => {
    const categoryFAQs = filteredFAQs.filter(faq => faq.category === category);
    if (categoryFAQs.length > 0) {
      acc[category] = categoryFAQs;
    }
    return acc;
  }, {} as Record<string, FAQItem[]>);

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
              Întrebări frecvente
            </h1>
            <p
              className="text-lg md:text-xl leading-relaxed mb-8"
              style={{ color: C.textBrown }}
            >
              Tot ce trebuie să știi despre Seasons.
              Nu găsești ce cauți? Contactează-ne oricând.
            </p>

            {/* Search */}
            <div className="max-w-md mx-auto relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                style={{ color: C.lavender }}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Caută întrebări..."
                className="w-full pl-12 pr-4 py-3 border-2 text-sm focus:outline-none transition-colors"
                style={{ borderColor: C.lavender, color: C.darkBrown, backgroundColor: C.white }}
              />
            </div>
          </div>
        </section>

        {/* Category Filters */}
        <section className="pb-8">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setSelectedCategory(null)}
                className="px-4 py-2 text-sm transition-opacity"
                style={{
                  backgroundColor: selectedCategory === null ? C.red : C.white,
                  color: selectedCategory === null ? C.white : C.textBrown
                }}
              >
                Toate
              </button>
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className="px-4 py-2 text-sm transition-opacity"
                  style={{
                    backgroundColor: selectedCategory === category ? C.red : C.white,
                    color: selectedCategory === category ? C.white : C.textBrown
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ List */}
        <section className="pb-16 md:pb-24">
          <div className="max-w-3xl mx-auto px-6">
            {Object.keys(groupedFAQs).length === 0 ? (
              <div className="text-center py-12" style={{ backgroundColor: C.white }}>
                <p style={{ color: C.textBrown }}>
                  Nu am găsit întrebări pentru "{searchTerm}".
                  Încearcă un alt termen sau răsfoiește toate categoriile.
                </p>
              </div>
            ) : (
              Object.entries(groupedFAQs).map(([category, faqs]) => (
                <div key={category} className="mb-10">
                  <h2
                    className="text-xl font-semibold mb-4"
                    style={{ color: C.darkBrown }}
                  >
                    {category}
                  </h2>

                  <div style={{ backgroundColor: C.white }}>
                    {faqs.map((faq, index) => {
                      const globalIndex = ALL_FAQS.findIndex(
                        f => f.question === faq.question
                      );

                      return (
                        <div
                          key={faq.question}
                          className="border-b last:border-b-0"
                          style={{ borderColor: C.lavender }}
                        >
                          <button
                            onClick={() => setOpenIndex(openIndex === globalIndex ? null : globalIndex)}
                            className="w-full py-5 px-6 flex items-center justify-between text-left"
                          >
                            <span
                              className="font-medium pr-4"
                              style={{ color: C.darkBrown }}
                            >
                              {faq.question}
                            </span>
                            <ChevronDown
                              className={`w-5 h-5 flex-shrink-0 transition-transform ${
                                openIndex === globalIndex ? 'rotate-180' : ''
                              }`}
                              style={{ color: C.textBrown }}
                            />
                          </button>

                          {openIndex === globalIndex && (
                            <div
                              className="pb-5 px-6 text-sm leading-relaxed"
                              style={{ color: C.textBrown }}
                            >
                              {faq.answer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Still Have Questions */}
        <section
          className="py-16 md:py-20 text-center"
          style={{ backgroundColor: C.white }}
        >
          <div className="max-w-2xl mx-auto px-6">
            <h2
              className="text-2xl md:text-3xl mb-4"
              style={{ color: C.darkBrown }}
            >
              Ai alte întrebări?
            </h2>
            <p
              className="mb-8"
              style={{ color: C.textBrown }}
            >
              Suntem aici să te ajutăm! Contactează-ne și echipa noastră îți va răspunde în 24 de ore.
            </p>
            <Link href="/contact">
              <span
                className="inline-block px-8 py-3 text-base font-medium text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: C.red }}
              >
                Contactează-ne
              </span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
