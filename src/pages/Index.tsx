
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowRight, LineChart, ShieldCheck, Zap } from "lucide-react";

export default function Index() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <header className="py-4 px-6 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">Auto Trailing Stop-Loss</h1>
        </div>
        <div>
          <Button onClick={() => navigate("/auth")}>
            Get Started
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-6 max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Automate Your Trading Strategy
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
            Take control of your trading with our intelligent automated trailing
            stop-loss system. Protect your investments with precision and ease.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" onClick={() => navigate("/auth")}>
              Sign Up Free
              <ArrowRight size={18} className="ml-2" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>
              Login
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-6 bg-background/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Powerful Trading Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg border border-muted">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <LineChart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Smart Trailing Stop-Loss
                </h3>
                <p className="text-muted-foreground">
                  Configure trailing stops based on percentage or price difference
                  to maximize your profits and minimize losses.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg border border-muted">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Real-time Execution
                </h3>
                <p className="text-muted-foreground">
                  Our system monitors the market in real-time and executes your
                  trailing stop-loss orders instantly when triggered.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg border border-muted">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Trade Protection
                </h3>
                <p className="text-muted-foreground">
                  Protect your investments with advanced risk management tools
                  designed to help you trade with confidence.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Transform Your Trading?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of traders who are already using our platform to
              automate their trading strategies and protect their investments.
            </p>
            <Button size="lg" onClick={() => navigate("/auth")}>
              Get Started Today
              <ArrowRight size={18} className="ml-2" />
            </Button>
          </div>
        </section>
      </main>

      <footer className="py-8 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-muted-foreground">
              © {new Date().getFullYear()} Auto Trailing Stop-Loss. All rights reserved.
            </p>
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-muted-foreground hover:text-foreground">
              Terms
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground">
              Privacy
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
