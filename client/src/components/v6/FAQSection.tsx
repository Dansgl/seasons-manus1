import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "wouter";
import { V6_COLORS as C } from "./colors";

export interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs?: FAQ[];
  showViewAll?: boolean;
  title?: string;
}

// Default top 5 FAQs used across all pages
export const TOP_5_FAQS: FAQ[] = [
  {
    question: "Cum funcționează Seasons?",
    answer: "Selectezi 5 articole de designer pentru bebeluși, le primești acasă, le folosești 3 luni, apoi le returnezi pentru următorul pachet. Atât de simplu!"
  },
  {
    question: "Ce este inclus în prețul de 350 lei/sezon?",
    answer: "5 articole premium, asigurare pentru uzură normală și pete, și curățenie profesională între utilizări."
  },
  {
    question: "Ce se întâmplă dacă hainele se deteriorează?",
    answer: "Uzura normală este inclusă în abonament. Știm că bebelușii se murdăresc! Doar deteriorarea excesivă poate implica costuri suplimentare."
  },
  {
    question: "Pot să anulez oricând?",
    answer: "Da! Poți anula din contul tău oricând, fără penalități. Doar returnează articolele curente și gata."
  },
  {
    question: "Ce branduri aveți?",
    answer: "Avem branduri premium europene precum Happymess, Studio Koter, Maru+Bo și multe alte etichete de designer."
  }
];

export function FAQSection({
  faqs = TOP_5_FAQS,
  showViewAll = true,
  title = "Întrebări frecvente"
}: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16 md:py-20" style={{ backgroundColor: C.white }}>
      <div className="max-w-3xl mx-auto px-6">
        <h2
          className="text-2xl md:text-3xl text-center mb-10"
          style={{ color: C.darkBrown }}
        >
          {title}
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b"
              style={{ borderColor: C.lavender }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full py-5 flex items-center justify-between text-left"
              >
                <span
                  className="font-medium pr-4"
                  style={{ color: C.darkBrown }}
                >
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  style={{ color: C.textBrown }}
                />
              </button>

              {openIndex === index && (
                <div
                  className="pb-5 text-sm leading-relaxed"
                  style={{ color: C.textBrown }}
                >
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {showViewAll && (
          <div className="text-center mt-8">
            <Link href="/faq">
              <span
                className="inline-block px-6 py-3 border-2 text-sm font-medium hover:opacity-70 transition-opacity"
                style={{ borderColor: C.darkBrown, color: C.darkBrown }}
              >
                Vezi toate întrebările
              </span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
