import { Search, User, ShoppingCart } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 bg-white z-50">
      {/* Announcement Bar */}
      <div className="bg-[#FF3C1F] text-white text-center py-2 px-4 text-sm">
        Join berrished bestselling artisans bundles
      </div>

      {/* Main Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Left Navigation */}
          <div className="flex items-center gap-8">
            <a href="#" className="text-[#B85C4A] hover:text-[#5C1A11] transition-colors">
              Shop
            </a>
            <a href="#" className="text-[#B85C4A] hover:text-[#5C1A11] transition-colors">
              Bundles
            </a>
            <a href="#" className="text-[#B85C4A] hover:text-[#5C1A11] transition-colors">
              Bestsellers
            </a>
          </div>

          {/* Center Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <span className="text-[#FF3C1F] text-4xl tracking-tighter" style={{ fontFamily: 'Arial Black, sans-serif', fontWeight: 900 }}>
              PITCH
            </span>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            <button className="text-[#B85C4A] hover:text-[#5C1A11] transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="text-[#B85C4A] hover:text-[#5C1A11] transition-colors">
              <User className="w-5 h-5" />
            </button>
            <button className="text-[#B85C4A] hover:text-[#5C1A11] transition-colors">
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
