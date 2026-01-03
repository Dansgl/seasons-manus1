/**
 * LoginV6 - Login/Signup page with V6 design system
 */

import { useAuth } from "@/_core/hooks/useAuth";
import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { toast } from "sonner";
import { V6_COLORS as C } from "@/components/v6";
import { Loader2 } from "lucide-react";

export default function LoginV6() {
  const [, setLocation] = useLocation();
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, isAuthenticated, loading } = useAuth();

  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !loading) {
      setLocation("/");
    }
  }, [isAuthenticated, loading, setLocation]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await signInWithEmail(email, password);
      toast.success("Signed in successfully!");
      setLocation("/");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await signUpWithEmail(email, password, name);
      toast.success("Account created! Please check your email to verify your account.");
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in with Google");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: C.beige }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: C.textBrown }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: C.beige }}>
      {/* Simple Header */}
      <header className="py-6 px-6">
        <div className="max-w-7xl mx-auto">
          <Link href="/">
            <span
              className="text-3xl tracking-tighter"
              style={{ fontFamily: "Arial Black, sans-serif", fontWeight: 900, color: C.red }}
            >
              SEASONS
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className=" p-8" style={{ backgroundColor: C.white }}>
            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-2xl mb-2" style={{ color: C.darkBrown }}>
                Welcome to Seasons
              </h1>
              <p className="text-sm" style={{ color: C.textBrown }}>
                Premium baby clothing rental
              </p>
            </div>

            {/* Tabs */}
            <div className="flex  p-1 mb-6" style={{ backgroundColor: C.beige }}>
              <button
                onClick={() => setActiveTab("signin")}
                className="flex-1 py-2  text-sm font-medium transition-colors"
                style={{
                  backgroundColor: activeTab === "signin" ? C.white : "transparent",
                  color: activeTab === "signin" ? C.darkBrown : C.textBrown,
                }}
              >
                Sign In
              </button>
              <button
                onClick={() => setActiveTab("signup")}
                className="flex-1 py-2  text-sm font-medium transition-colors"
                style={{
                  backgroundColor: activeTab === "signup" ? C.white : "transparent",
                  color: activeTab === "signup" ? C.darkBrown : C.textBrown,
                }}
              >
                Sign Up
              </button>
            </div>

            {/* Sign In Form */}
            {activeTab === "signin" && (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: C.darkBrown }}>
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3  border-2 text-sm focus:outline-none transition-colors"
                    style={{ borderColor: C.lavender, color: C.darkBrown }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: C.darkBrown }}>
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3  border-2 text-sm focus:outline-none transition-colors"
                    style={{ borderColor: C.lavender, color: C.darkBrown }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3  text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: C.red }}
                >
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </button>
              </form>
            )}

            {/* Sign Up Form */}
            {activeTab === "signup" && (
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: C.darkBrown }}>
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3  border-2 text-sm focus:outline-none transition-colors"
                    style={{ borderColor: C.lavender, color: C.darkBrown }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: C.darkBrown }}>
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3  border-2 text-sm focus:outline-none transition-colors"
                    style={{ borderColor: C.lavender, color: C.darkBrown }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: C.darkBrown }}>
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Choose a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-3  border-2 text-sm focus:outline-none transition-colors"
                    style={{ borderColor: C.lavender, color: C.darkBrown }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3  text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: C.red }}
                >
                  {isSubmitting ? "Creating account..." : "Create Account"}
                </button>
              </form>
            )}

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: C.lavender }} />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-2" style={{ backgroundColor: C.white, color: C.textBrown }}>
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Button */}
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-2 py-3  border-2 text-sm font-medium transition-opacity hover:opacity-70"
              style={{ borderColor: C.lavender, color: C.darkBrown }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>

            {/* Terms */}
            <p className="mt-6 text-center text-xs" style={{ color: C.textBrown }}>
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
