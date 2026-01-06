/**
 * CheckoutErrorBoundary - Error boundary specifically for checkout flow
 * Provides helpful messaging and recovery options for payment-related errors
 */

import { Component, ReactNode } from "react";
import { AlertCircle, RefreshCw, ArrowLeft, MessageSquare } from "lucide-react";
import { V6_COLORS as C } from "./colors";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class CheckoutErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error for debugging
    console.error("Checkout Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: C.beige }}>
          <Header />
          <main className="flex-1 flex items-center justify-center px-6 py-12">
            <div className="text-center max-w-md">
              <div
                className="w-20 h-20 mx-auto mb-6 flex items-center justify-center"
                style={{ backgroundColor: C.lavender }}
              >
                <AlertCircle className="w-10 h-10" style={{ color: C.red }} />
              </div>

              <h1 className="text-2xl md:text-3xl mb-4" style={{ color: C.darkBrown }}>
                Something went wrong
              </h1>

              <p className="mb-6" style={{ color: C.textBrown }}>
                We encountered an error during checkout. Don't worry - if you completed a payment,
                your order is safe. Our system will process it shortly.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    this.setState({ hasError: false, error: null });
                    window.location.reload();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-8 py-3 text-base font-medium text-white hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: C.red }}
                >
                  <RefreshCw className="w-5 h-5" />
                  Try Again
                </button>

                <a
                  href="/dashboard"
                  className="w-full flex items-center justify-center gap-2 px-8 py-3 text-base font-medium border-2 hover:opacity-70 transition-opacity"
                  style={{ borderColor: C.darkBrown, color: C.darkBrown }}
                >
                  <ArrowLeft className="w-5 h-5" />
                  Go to Dashboard
                </a>

                <a
                  href="mailto:support@babyseasons.ro"
                  className="w-full flex items-center justify-center gap-2 px-8 py-3 text-sm hover:opacity-70 transition-opacity"
                  style={{ color: C.textBrown }}
                >
                  <MessageSquare className="w-4 h-4" />
                  Contact Support
                </a>
              </div>

              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="mt-8 text-left">
                  <summary className="text-xs cursor-pointer" style={{ color: C.textBrown }}>
                    Technical Details
                  </summary>
                  <pre
                    className="mt-2 p-4 text-xs overflow-auto"
                    style={{ backgroundColor: C.white, color: C.darkBrown }}
                  >
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>
          </main>
          <Footer />
        </div>
      );
    }

    return this.props.children;
  }
}
