import { Link } from "wouter";
import { Facebook, Instagram } from "lucide-react";
import { V6_COLORS as C } from "./colors";

export function Footer() {
  return (
    <footer className="text-white" style={{ backgroundColor: C.red }}>
      {/* Navigation Links */}
      <div className="border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Rent Column */}
            <div>
              <h3 className="mb-4 font-semibold">Închiriază</h3>
              <ul className="space-y-2 text-white/80 text-sm">
                <li>
                  <Link href="/catalog" className="hover:text-white transition-colors">
                    Toate produsele
                  </Link>
                </li>
                <li>
                  <Link href="/brands" className="hover:text-white transition-colors">
                    Branduri
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="hover:text-white transition-colors">
                    Cum funcționează
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h3 className="mb-4 font-semibold">Despre noi</h3>
              <ul className="space-y-2 text-white/80 text-sm">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    Povestea Seasons
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support Column */}
            <div>
              <h3 className="mb-4 font-semibold">Asistență</h3>
              <ul className="space-y-2 text-white/80 text-sm">
                <li>
                  <Link href="/faq" className="hover:text-white transition-colors">
                    Întrebări frecvente
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="hover:text-white transition-colors">
                    Retururi
                  </Link>
                </li>
                <li>
                  <Link href="/sizing" className="hover:text-white transition-colors">
                    Ghid mărimi
                  </Link>
                </li>
              </ul>
            </div>

            {/* Empty Column for spacing */}
            <div></div>
          </div>
        </div>
      </div>

      {/* Logo and Social */}
      <div className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            {/* Logo */}
            <div>
              <h2
                className="text-white text-5xl md:text-7xl tracking-tighter"
                style={{ fontFamily: "Arial Black, sans-serif", fontWeight: 900 }}
              >
                SEASONS
              </h2>
              <p className="text-white/60 text-xs mt-2">© 2025 Seasons. Închiriere haine premium pentru bebeluși.</p>
            </div>

            {/* Social Icons */}
            <div className="flex gap-4">
              <a href="#" className="text-white hover:text-white/80 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-white hover:text-white/80 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
