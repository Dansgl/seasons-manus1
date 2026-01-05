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
  // Getting Started
  {
    category: "Getting Started",
    question: "How does Seasons work?",
    answer: "Seasons is a baby clothing rental subscription. For 350 RON per quarter, you select 5 premium designer items. We ship them to you, you enjoy them for 3 months, then return them for a fresh selection in the next size. It's that simple!"
  },
  {
    category: "Getting Started",
    question: "Who is Seasons for?",
    answer: "Seasons is perfect for parents who want high-quality, designer baby clothing without the waste. Whether you care about sustainability, love premium brands, or simply want to save money on clothes your baby will quickly outgrow, Seasons is for you."
  },
  {
    category: "Getting Started",
    question: "What sizes do you offer?",
    answer: "We carry sizes from newborn (0-3 months) through toddler (up to 3 years). Our collection grows with your child, making it easy to size up each quarter."
  },
  {
    category: "Getting Started",
    question: "Which brands do you carry?",
    answer: "We partner with premium European brands including Petit Bateau, Bonpoint, Tartine et Chocolat, Jacadi, Stella McCartney Kids, and many more. Every item in our collection meets our strict quality standards."
  },

  // Subscription & Pricing
  {
    category: "Subscription & Pricing",
    question: "How much does Seasons cost?",
    answer: "Seasons is 350 RON per quarter (3 months). This includes 5 premium items, free shipping both ways, insurance for normal wear and tear, and professional Ozone cleaning between uses."
  },
  {
    category: "Subscription & Pricing",
    question: "Can I cancel my subscription?",
    answer: "Yes! You can cancel anytime from your dashboard with no penalties. Simply return your current items using the pre-paid label, and your subscription will end."
  },
  {
    category: "Subscription & Pricing",
    question: "When am I charged?",
    answer: "You're charged 350 RON when you start your subscription and then every 3 months at the beginning of each new cycle. We'll send you a reminder before each billing date."
  },
  {
    category: "Subscription & Pricing",
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, American Express) and PayPal. All payments are processed securely."
  },

  // Shipping & Returns
  {
    category: "Shipping & Returns",
    question: "Where do you ship?",
    answer: "We currently ship to Slovakia, Romania, Czech Republic, Hungary, Austria, and Germany. We're expanding to more European countries soon!"
  },
  {
    category: "Shipping & Returns",
    question: "How long does shipping take?",
    answer: "Standard delivery takes 3-5 business days within our service area. You'll receive a tracking number once your box ships."
  },
  {
    category: "Shipping & Returns",
    question: "How do I return items?",
    answer: "Easy! Each box includes a pre-paid return label. Simply pack your items in the original packaging, attach the label, and drop it at any postal point. We'll handle the rest."
  },
  {
    category: "Shipping & Returns",
    question: "When do I need to return items?",
    answer: "Items should be returned by the end of your 3-month cycle. We'll send you reminders when your return window opens and approaches. Late returns may affect your next box."
  },

  // Quality & Care
  {
    category: "Quality & Care",
    question: "Are items clean and safe?",
    answer: "Absolutely. Every item undergoes professional Ozone cleaning between uses — the same technology used in hospitals. This eliminates 99.9% of bacteria and allergens while being gentle on fabrics."
  },
  {
    category: "Quality & Care",
    question: "What condition are the items in?",
    answer: "All items are in excellent condition. We carefully inspect every piece before and after each rental. Items showing significant wear are retired from circulation."
  },
  {
    category: "Quality & Care",
    question: "What if an item arrives damaged?",
    answer: "Please contact us within 48 hours of receiving your box. We'll arrange a replacement and provide a return label for the damaged item."
  },
  {
    category: "Quality & Care",
    question: "How should I care for rented items?",
    answer: "Care for them as you would your own clothes! Follow the care labels, wash with similar colors, and avoid bleach. Normal wear is expected and covered by our insurance."
  },

  // Damage & Insurance
  {
    category: "Damage & Insurance",
    question: "What if my baby damages an item?",
    answer: "Normal wear and tear is included — we know babies are messy! Small stains, minor snags, and general use marks are all covered. Only excessive damage (large tears, permanent stains from negligence, missing items) may incur additional costs."
  },
  {
    category: "Damage & Insurance",
    question: "What counts as normal wear and tear?",
    answer: "Small food stains (we can remove most!), minor pilling, slight fading from washing, small snags, and general softening of fabric. Basically, if your baby wore it and loved it, you're covered."
  },
  {
    category: "Damage & Insurance",
    question: "Is there an excess or deductible?",
    answer: "No. Our insurance is included in your subscription with no additional costs for covered damage. We only charge for excessive damage or lost items."
  },

  // Selecting Items
  {
    category: "Selecting Items",
    question: "Can I choose specific items?",
    answer: "Yes! You browse our full catalog and select exactly which 5 items you want. No surprise boxes here — you get to pick what you love."
  },
  {
    category: "Selecting Items",
    question: "What if something I want is unavailable?",
    answer: "Some popular items may be out on rental. Add them to your wishlist, and we'll notify you when they're back. In the meantime, explore similar styles!"
  },
  {
    category: "Selecting Items",
    question: "Can I swap items mid-cycle?",
    answer: "Your 5 items are yours for the full 3-month cycle. At the end of each cycle, you'll have a swap window to select your next 5 items. This ensures you always have pieces perfectly sized for your growing baby."
  },
  {
    category: "Selecting Items",
    question: "Can I keep an item I love?",
    answer: "Currently, all items must be returned. We're working on a 'buy to keep' option for future. Stay tuned!"
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
              Frequently Asked Questions
            </h1>
            <p
              className="text-lg md:text-xl leading-relaxed mb-8"
              style={{ color: C.textBrown }}
            >
              Everything you need to know about Seasons.
              Can't find what you're looking for? Contact us anytime.
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
                placeholder="Search questions..."
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
                All
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
                  No questions found matching "{searchTerm}".
                  Try a different search term or browse all categories.
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
              Still Have Questions?
            </h2>
            <p
              className="mb-8"
              style={{ color: C.textBrown }}
            >
              We're here to help! Reach out and our team will get back to you within 24 hours.
            </p>
            <Link href="/contact">
              <span
                className="inline-block px-8 py-3 text-base font-medium text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: C.red }}
              >
                Contact Us
              </span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
