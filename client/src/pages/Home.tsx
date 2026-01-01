import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { Sparkles, Leaf, Shield, RotateCcw } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      {/* Navigation */}
      <nav className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-light tracking-wide text-neutral-900">
            Seasons
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/catalog" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
              Browse
            </Link>
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
                  Dashboard
                </Link>
                {user?.role === 'admin' && (
                  <Link href="/admin" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
                    Admin
                  </Link>
                )}
              </>
            ) : (
              <a href={getLoginUrl()} className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
                Sign In
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container mx-auto px-6 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-light tracking-tight text-neutral-900 mb-6">
              Luxury Baby Clothing,
              <br />
              <span className="italic">Sustainably Yours</span>
            </h1>
            <p className="text-lg text-neutral-600 mb-12 leading-relaxed">
              A quarterly subscription service delivering curated boxes of premium baby clothing. 
              Wear for 3 months, return, and refresh. Zero stress, maximum style.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/catalog">
                <span className="inline-block">
                  <Button size="lg" className="rounded-full px-8 bg-neutral-900 hover:bg-neutral-800">
                    Browse Collection
                  </Button>
                </span>
              </Link>
              <Button size="lg" variant="outline" className="rounded-full px-8 border-neutral-300">
                How It Works
              </Button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="bg-white py-20">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-12">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-neutral-700" />
                </div>
                <h3 className="font-medium text-neutral-900 mb-2">Luxury Brands</h3>
                <p className="text-sm text-neutral-600">
                  MORI, Mini Rodini, Bonpoint, and more premium labels
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-neutral-700" />
                </div>
                <h3 className="font-medium text-neutral-900 mb-2">Ozone Cleaned</h3>
                <p className="text-sm text-neutral-600">
                  Medical-grade cleaning between every rental
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-6 h-6 text-neutral-700" />
                </div>
                <h3 className="font-medium text-neutral-900 mb-2">Circular Economy</h3>
                <p className="text-sm text-neutral-600">
                  Sustainable fashion for your growing baby
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                  <RotateCcw className="w-6 h-6 text-neutral-700" />
                </div>
                <h3 className="font-medium text-neutral-900 mb-2">Quarterly Refresh</h3>
                <p className="text-sm text-neutral-600">
                  New styles every 3 months as your baby grows
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-light text-center text-neutral-900 mb-16">How It Works</h2>
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="flex gap-6 items-start">
                <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center flex-shrink-0 font-medium">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-medium text-neutral-900 mb-2">Select Your 5 Items</h3>
                  <p className="text-neutral-600">
                    Browse our curated collection and choose exactly 5 pieces for your quarterly box.
                  </p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center flex-shrink-0 font-medium">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-medium text-neutral-900 mb-2">Subscribe for €70/Quarter</h3>
                  <p className="text-neutral-600">
                    One simple price covers everything: luxury items, insurance, and Ozone cleaning.
                  </p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center flex-shrink-0 font-medium">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-medium text-neutral-900 mb-2">Enjoy for 3 Months</h3>
                  <p className="text-neutral-600">
                    Wear without worry. All wear and tear is included in your subscription.
                  </p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center flex-shrink-0 font-medium">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-medium text-neutral-900 mb-2">Swap & Refresh</h3>
                  <p className="text-neutral-600">
                    10 days before your cycle ends, select your next 5 items. Return the old box and receive your new one.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-neutral-900 text-white py-20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-light mb-6">Ready to Start Your Journey?</h2>
            <p className="text-neutral-300 mb-8 max-w-2xl mx-auto">
              Join the circular fashion movement and give your baby the luxury they deserve.
            </p>
            <Link href="/catalog">
              <span className="inline-block">
                <Button size="lg" variant="outline" className="rounded-full px-8 border-white text-white hover:bg-white hover:text-neutral-900">
                  Start Browsing
                </Button>
              </span>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white py-8">
        <div className="container mx-auto px-6 text-center text-sm text-neutral-600">
          <p>© 2026 Seasons. Luxury baby clothing rental with care.</p>
        </div>
      </footer>
    </div>
  );
}
