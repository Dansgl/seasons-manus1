/**
 * Contact Page - Get in touch with Seasons
 */

import { useState } from "react";
import { Mail, MapPin, Clock, Send, Loader2, Check } from "lucide-react";
import { Header, Footer, FAQSection, V6_COLORS as C } from "@/components/v6";
import { toast } from "sonner";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setSubmitted(true);
    toast.success("Message sent! We'll get back to you soon.");
  };

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
              Get in Touch
            </h1>
            <p
              className="text-lg md:text-xl leading-relaxed"
              style={{ color: C.textBrown }}
            >
              Have questions about Seasons? We're here to help.
              Reach out and our team will get back to you within 24 hours.
            </p>
          </div>
        </section>

        {/* Contact Content */}
        <section className="pb-16 md:pb-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="p-6 md:p-8" style={{ backgroundColor: C.white }}>
                <h2
                  className="text-xl font-semibold mb-6"
                  style={{ color: C.darkBrown }}
                >
                  Send Us a Message
                </h2>

                {submitted ? (
                  <div className="text-center py-12">
                    <div
                      className="w-16 h-16 mx-auto mb-4 flex items-center justify-center"
                      style={{ backgroundColor: C.beige }}
                    >
                      <Check className="w-8 h-8" style={{ color: C.red }} />
                    </div>
                    <h3
                      className="text-lg font-medium mb-2"
                      style={{ color: C.darkBrown }}
                    >
                      Message Sent!
                    </h3>
                    <p className="text-sm" style={{ color: C.textBrown }}>
                      Thank you for reaching out. We'll respond within 24 hours.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ name: "", email: "", subject: "", message: "" });
                      }}
                      className="mt-6 px-6 py-2 text-sm font-medium border-2 hover:opacity-70 transition-opacity"
                      style={{ borderColor: C.darkBrown, color: C.darkBrown }}
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: C.darkBrown }}
                      >
                        Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your name"
                        className="w-full px-4 py-3 border-2 text-sm focus:outline-none transition-colors"
                        style={{ borderColor: C.lavender, color: C.darkBrown }}
                        required
                      />
                    </div>

                    <div>
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: C.darkBrown }}
                      >
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 border-2 text-sm focus:outline-none transition-colors"
                        style={{ borderColor: C.lavender, color: C.darkBrown }}
                        required
                      />
                    </div>

                    <div>
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: C.darkBrown }}
                      >
                        Subject
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="What's this about?"
                        className="w-full px-4 py-3 border-2 text-sm focus:outline-none transition-colors"
                        style={{ borderColor: C.lavender, color: C.darkBrown }}
                      />
                    </div>

                    <div>
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: C.darkBrown }}
                      >
                        Message *
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us how we can help..."
                        rows={5}
                        className="w-full px-4 py-3 border-2 text-sm focus:outline-none transition-colors resize-none"
                        style={{ borderColor: C.lavender, color: C.darkBrown }}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 py-3 text-base font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                      style={{ backgroundColor: C.red }}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* Contact Info */}
              <div className="space-y-8">
                {/* Email */}
                <div className="p-6" style={{ backgroundColor: C.white }}>
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 flex-shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: C.beige }}
                    >
                      <Mail className="w-6 h-6" style={{ color: C.red }} />
                    </div>
                    <div>
                      <h3
                        className="font-semibold mb-1"
                        style={{ color: C.darkBrown }}
                      >
                        Email Us
                      </h3>
                      <p className="text-sm" style={{ color: C.textBrown }}>
                        For general inquiries and support
                      </p>
                      <a
                        href="mailto:hello@babyseasons.ro"
                        className="text-sm font-medium mt-2 inline-block hover:opacity-70 transition-opacity"
                        style={{ color: C.red }}
                      >
                        hello@babyseasons.ro
                      </a>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="p-6" style={{ backgroundColor: C.white }}>
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 flex-shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: C.beige }}
                    >
                      <MapPin className="w-6 h-6" style={{ color: C.red }} />
                    </div>
                    <div>
                      <h3
                        className="font-semibold mb-1"
                        style={{ color: C.darkBrown }}
                      >
                        Location
                      </h3>
                      <p className="text-sm" style={{ color: C.textBrown }}>
                        Serving families across Europe
                      </p>
                      <p
                        className="text-sm font-medium mt-2"
                        style={{ color: C.darkBrown }}
                      >
                        Bratislava, Slovakia
                      </p>
                    </div>
                  </div>
                </div>

                {/* Response Time */}
                <div className="p-6" style={{ backgroundColor: C.white }}>
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 flex-shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: C.beige }}
                    >
                      <Clock className="w-6 h-6" style={{ color: C.red }} />
                    </div>
                    <div>
                      <h3
                        className="font-semibold mb-1"
                        style={{ color: C.darkBrown }}
                      >
                        Response Time
                      </h3>
                      <p className="text-sm" style={{ color: C.textBrown }}>
                        We typically respond within 24 hours during business days.
                        For urgent matters, please include "URGENT" in your subject line.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social */}
                <div className="p-6" style={{ backgroundColor: C.white }}>
                  <h3
                    className="font-semibold mb-4"
                    style={{ color: C.darkBrown }}
                  >
                    Follow Us
                  </h3>
                  <div className="flex gap-4">
                    <a
                      href="https://instagram.com/babyseasons"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 text-sm border-2 hover:opacity-70 transition-opacity"
                      style={{ borderColor: C.lavender, color: C.textBrown }}
                    >
                      Instagram
                    </a>
                    <a
                      href="https://facebook.com/babyseasons"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 text-sm border-2 hover:opacity-70 transition-opacity"
                      style={{ borderColor: C.lavender, color: C.textBrown }}
                    >
                      Facebook
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQSection />
      </main>

      <Footer />
    </div>
  );
}
