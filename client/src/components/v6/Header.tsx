import { Link } from "wouter";
import { User, ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { V6_COLORS as C } from "./colors";
import { getCartCount } from "@/lib/supabase-db";
import { useWaitlistMode } from "@/hooks/useWaitlistMode";
import { WaitlistModal, type WaitlistSource } from "./WaitlistModal";

interface HeaderProps {
  announcement?: string;
}

export function Header({ announcement }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [waitlistModalOpen, setWaitlistModalOpen] = useState(false);
  const [waitlistSource, setWaitlistSource] = useState<WaitlistSource>("header");
  const { isWaitlistMode } = useWaitlistMode();

  // Get cart count (only when not in waitlist mode)
  const { data: cartCount } = useQuery({
    queryKey: ["cartCount"],
    queryFn: getCartCount,
    enabled: !isWaitlistMode,
  });

  const openWaitlistModal = (source: WaitlistSource) => {
    setWaitlistSource(source);
    setWaitlistModalOpen(true);
  };

  return (
    <header className="sticky top-0 bg-white z-50">
      {/* Announcement Bar */}
      {announcement !== "" && (
        <div
          className="text-white text-center py-2 px-4 text-sm"
          style={{ backgroundColor: C.red }}
        >
          {announcement || "Premium baby clothing rental — €70/quarter for 5 designer pieces"}
        </div>
      )}

      {/* Main Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              className="md:hidden flex-shrink-0"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ color: C.textBrown }}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Left Navigation - Desktop */}
            <div className="hidden md:flex items-center gap-6 flex-shrink-0">
              <Link
                href="/catalog"
                className="hover:opacity-70 transition-colors text-sm"
                style={{ color: C.textBrown }}
              >
                All Products
              </Link>
              <Link
                href="/brands"
                className="hover:opacity-70 transition-colors text-sm"
                style={{ color: C.textBrown }}
              >
                Brands
              </Link>
              <Link
                href="/blog"
                className="hover:opacity-70 transition-colors text-sm"
                style={{ color: C.textBrown }}
              >
                Blog
              </Link>
            </div>

            {/* Center Logo */}
            <div className="flex-shrink-0 mx-4">
              <Link href="/">
                <span
                  className="text-2xl md:text-3xl tracking-tighter whitespace-nowrap"
                  style={{ fontFamily: "Arial Black, sans-serif", fontWeight: 900, color: C.red }}
                >
                  SEASONS
                </span>
              </Link>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-4 flex-shrink-0">
              {isWaitlistMode ? (
                <>
                  <button
                    onClick={() => openWaitlistModal("header")}
                    className="px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: C.red }}
                  >
                    Join Waitlist
                  </button>
                </>
              ) : (
                <>
                  <Link href="/dashboard" className="hover:opacity-70 transition-colors" style={{ color: C.textBrown }}>
                    <User className="w-5 h-5" />
                  </Link>
                  <Link href="/catalog" className="relative hover:opacity-70 transition-colors" style={{ color: C.textBrown }}>
                    <ShoppingBag className="w-5 h-5" />
                    {cartCount !== undefined && cartCount > 0 && (
                      <span
                        className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center text-xs font-bold text-white"
                        style={{ backgroundColor: C.red }}
                      >
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-6 py-4 space-y-4">
              <Link
                href="/catalog"
                className="block hover:opacity-70 transition-colors"
                style={{ color: C.textBrown }}
                onClick={() => setMobileMenuOpen(false)}
              >
                All Products
              </Link>
              <Link
                href="/brands"
                className="block hover:opacity-70 transition-colors"
                style={{ color: C.textBrown }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Brands
              </Link>
              <Link
                href="/blog"
                className="block hover:opacity-70 transition-colors"
                style={{ color: C.textBrown }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>
              {isWaitlistMode ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openWaitlistModal("header");
                  }}
                  className="block w-full text-left hover:opacity-70 transition-colors font-medium"
                  style={{ color: C.red }}
                >
                  Join Waitlist
                </button>
              ) : (
                <Link
                  href="/dashboard"
                  className="block hover:opacity-70 transition-colors"
                  style={{ color: C.textBrown }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Account
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Waitlist Modal */}
      <WaitlistModal
        open={waitlistModalOpen}
        onOpenChange={setWaitlistModalOpen}
        source={waitlistSource}
      />
    </header>
  );
}
