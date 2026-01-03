import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/_core/hooks/useAuth";
import { getCartCount } from "@/lib/supabase-db";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, ShoppingBag, LogOut, User, Search } from "lucide-react";

interface NavigationProps {
  showCartCount?: boolean;
}

export default function Navigation({ showCartCount = false }: NavigationProps) {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: cartCount } = useQuery({
    queryKey: ["cartCount"],
    queryFn: getCartCount,
    enabled: isAuthenticated && showCartCount,
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const isActive = (path: string) => location === path;

  const navLinks = [
    { href: "/catalog", label: "Shop", show: true },
    { href: "/brands", label: "Brands", show: true },
    { href: "/blog", label: "Blog", show: true },
    { href: "/dashboard", label: "Dashboard", show: isAuthenticated },
    { href: "/admin", label: "Admin", show: user?.role === "admin" },
  ];

  return (
    <nav className="bg-[#F9F5F0] sticky top-0 z-50 border-b border-[#E8D7E8]">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Left - Nav Links (Desktop) */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks
              .filter((link) => link.show)
              .slice(0, 3) // Only show first 3 links on left
              .map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm transition-colors ${
                    isActive(link.href)
                      ? "text-[#6B2D2D] font-medium"
                      : "text-[#4A2C2C] hover:text-[#E94E1B]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
          </div>

          {/* Mobile - Menu Button */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="p-2 text-[#4A2C2C] hover:text-[#6B2D2D]">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] p-0 bg-[#F9F5F0]">
                <SheetHeader className="p-6 border-b border-[#E8D7E8]">
                  <SheetTitle
                    className="text-left text-2xl text-[#6B2D2D]"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Seasons
                  </SheetTitle>
                </SheetHeader>

                <div className="py-4">
                  {/* User Info */}
                  {isAuthenticated && user && (
                    <div className="px-6 py-4 border-b border-[#E8D7E8] mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#E8D7E8] flex items-center justify-center">
                          <User className="w-5 h-5 text-[#6B2D2D]" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-[#6B2D2D]">{user.name || "User"}</div>
                          <div className="text-xs text-[#4A2C2C] opacity-60">{user.email}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Links */}
                  <div className="space-y-1 px-4">
                    <Link
                      href="/"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block py-3 px-4 text-sm transition-colors ${
                        isActive("/")
                          ? "text-[#6B2D2D] font-medium bg-[#E8D7E8]"
                          : "text-[#4A2C2C] hover:bg-[#E8D7E8]"
                      }`}
                    >
                      Home
                    </Link>
                    {navLinks
                      .filter((link) => link.show)
                      .map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`block py-3 px-4 text-sm transition-colors ${
                            isActive(link.href)
                              ? "text-[#6B2D2D] font-medium bg-[#E8D7E8]"
                              : "text-[#4A2C2C] hover:bg-[#E8D7E8]"
                          }`}
                        >
                          {link.label}
                        </Link>
                      ))}
                  </div>

                  {/* Auth Actions */}
                  <div className="border-t border-[#E8D7E8] mt-4 pt-4 px-4">
                    {isAuthenticated ? (
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleLogout();
                        }}
                        className="flex items-center gap-2 py-3 px-4 text-sm text-[#4A2C2C] hover:text-[#E94E1B] w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    ) : (
                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-3 px-4 text-sm text-[#E94E1B] font-medium"
                      >
                        Sign In
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Center - Logo */}
          <Link
            href="/"
            className="text-2xl md:text-3xl text-[#6B2D2D] tracking-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Seasons
          </Link>

          {/* Right - Icons */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Dashboard/Admin links (Desktop) */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks
                .filter((link) => link.show)
                .slice(3) // Dashboard and Admin links
                .map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm transition-colors ${
                      isActive(link.href)
                        ? "text-[#6B2D2D] font-medium"
                        : "text-[#4A2C2C] hover:text-[#E94E1B]"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
            </div>

            {/* Account Icon */}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="hidden md:flex p-2 text-[#4A2C2C] hover:text-[#E94E1B] transition-colors"
                title="Sign Out"
              >
                <User className="w-5 h-5" />
              </button>
            ) : (
              <Link
                href="/login"
                className="hidden md:flex p-2 text-[#4A2C2C] hover:text-[#E94E1B] transition-colors"
              >
                <User className="w-5 h-5" />
              </Link>
            )}

            {/* Cart Icon */}
            <Link href="/checkout" className="relative p-2 text-[#4A2C2C] hover:text-[#E94E1B] transition-colors">
              <ShoppingBag className="w-5 h-5" />
              {showCartCount && isAuthenticated && cartCount !== undefined && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#E94E1B] text-white text-xs flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
