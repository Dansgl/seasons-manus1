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
    question: "How does Seasons work?",
    answer: "Select 5 designer baby items, receive them at home, use for 3 months, then return for your next box. It's that simple!"
  },
  {
    question: "What's included in the 350 RON/quarter price?",
    answer: "5 premium items, free shipping both ways, insurance for normal wear and tear, and professional Ozone cleaning between uses."
  },
  {
    question: "What if items get damaged?",
    answer: "Normal wear and tear is included in your subscription. We understand babies are messy! Only excessive damage may incur additional costs."
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes! Cancel from your dashboard anytime with no penalties. Just return your current items and you're all set."
  },
  {
    question: "Which brands do you carry?",
    answer: "We carry premium European brands like Petit Bateau, Bonpoint, Tartine et Chocolat, Jacadi, and many more designer labels."
  }
];

export function FAQSection({
  faqs = TOP_5_FAQS,
  showViewAll = true,
  title = "Common Questions"
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
                View All FAQs
              </span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
