import { Facebook, Instagram, Youtube, Music2, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#FF3C1F] text-white">
      {/* Navigation Links */}
      <div className="border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Skincare Column */}
            <div>
              <h3 className="mb-4">Skincare</h3>
              <ul className="space-y-2 text-white/80 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Cleansers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Moisturizers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Bundles</a></li>
              </ul>
            </div>

            {/* Makeup Column */}
            <div>
              <h3 className="mb-4">Makeup</h3>
              <ul className="space-y-2 text-white/80 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Eyes primers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Lip stains</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Accessories</a></li>
              </ul>
            </div>

            {/* About Column */}
            <div>
              <h3 className="mb-4">About</h3>
              <ul className="space-y-2 text-white/80 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Get to know us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
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
              <h2 className="text-white text-6xl md:text-8xl tracking-tighter" style={{ fontFamily: 'Arial Black, sans-serif', fontWeight: 900 }}>
                PITCH
              </h2>
              <p className="text-white/60 text-xs mt-2">© 2026 Pitch, Powered by Shopify</p>
            </div>

            {/* Social Icons */}
            <div className="flex gap-4">
              <a href="#" className="text-white hover:text-white/80 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-white hover:text-white/80 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-white hover:text-white/80 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" className="text-white hover:text-white/80 transition-colors">
                <Music2 className="w-5 h-5" />
              </a>
              <a href="#" className="text-white hover:text-white/80 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
