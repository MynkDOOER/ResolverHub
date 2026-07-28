import { Link } from "react-router-dom";
import { Bug, Shield, Zap, ArrowRight, CheckCircle2, Lock } from "lucide-react";

const Home = () => {
  return (
    <div 
      className="relative w-full bg-white selection:bg-red-100 selection:text-red-900"
      style={{ fontFamily: "'Fira Code', monospace" }}
    >
      {/* HERO SECTION - The Bright Surface */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white px-6 pt-16">
        {/* Floating Background Elements */}
        <div className="absolute -left-20 top-20 h-72 w-72 animate-pulse rounded-full bg-red-100/50 blur-3xl filter"></div>
        <div className="absolute -right-20 top-1/3 h-96 w-96 animate-pulse rounded-full bg-orange-100/40 blur-3xl filter" style={{ animationDelay: "2s" }}></div>

        {/* Floating Icons (Simulating chaotic bugs/code) */}
        <Bug className="absolute left-[15%] top-[25%] h-8 w-8 animate-bounce text-red-200" style={{ animationDuration: "3s" }} />
        <Zap className="absolute right-[20%] top-[30%] h-6 w-6 animate-bounce text-orange-200" style={{ animationDuration: "4s", animationDelay: "1s" }} />
        <div className="absolute bottom-[20%] left-[25%] text-2xl font-bold text-gray-200 opacity-50 animate-pulse">{"{ }"}</div>
        <div className="absolute bottom-[30%] right-[15%] text-2xl font-bold text-gray-200 opacity-50 animate-pulse" style={{ animationDelay: "1.5s" }}>{"</>"}</div>

        <div className="relative z-10 flex max-w-4xl flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 shadow-sm">
            <Lock size={14} />
            <span>Secure Bug Tracking for Modern Teams</span>
          </div>
          
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-7xl">
            Don't let bugs run wild. <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
              Lock them in the Vault.
            </span>
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500 sm:text-xl">
            The developer-first workspace that brings order to the chaos. Capture, assign, and squash bugs before they reach production.
          </p>

          <p className="mt-12 animate-bounce text-sm font-medium text-gray-400">
            Scroll to descend into the vault ↓
          </p>
        </div>
      </section>

      {/* PARALLAX SECTION - The Descent */}
      {/* bg-fixed creates the parallax illusion where the background stays still while content scrolls */}
      <section className="relative bg-slate-950 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black bg-fixed py-32 text-white">
        
        {/* Decorative glowing orb in the dark */}
        <div className="absolute left-1/2 top-1/2 -z-0 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-red-600/20 to-orange-500/20 blur-[100px]"></div>

        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <div className="space-y-32">
            
            {/* Feature 1 */}
            <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
              <div className="md:w-1/2 space-y-4">
                <span className="text-5xl font-black text-slate-800">01.</span>
                <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Assign.</h2>
                <p className="text-lg text-slate-400">
                  Stop asking "who is working on this?" Every bug gets assigned an owner instantly. Total accountability, zero confusion.
                </p>
              </div>
              <div className="flex h-64 w-full items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-md md:w-5/12 shadow-2xl shadow-red-900/20">
                <Shield className="h-24 w-24 text-red-500 opacity-80" strokeWidth={1} />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col-reverse items-center gap-8 md:flex-row md:justify-between">
              <div className="flex h-64 w-full items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-md md:w-5/12 shadow-2xl shadow-orange-900/20">
                <Bug className="h-24 w-24 text-orange-500 opacity-80" strokeWidth={1} />
              </div>
              <div className="md:w-1/2 space-y-4">
                <span className="text-5xl font-black text-slate-800">02.</span>
                <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Track.</h2>
                <p className="text-lg text-slate-400">
                  Watch the resolution unfold in real-time. Detailed descriptions, environment specs, and status updates all in one clean view.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
              <div className="md:w-1/2 space-y-4">
                <span className="text-5xl font-black text-slate-800">03.</span>
                <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Squash.</h2>
                <p className="text-lg text-slate-400">
                  Deploy with confidence. Once a bug is locked in the vault and marked resolved, it stays resolved.
                </p>
              </div>
              <div className="flex h-64 w-full items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-md md:w-5/12 shadow-2xl shadow-green-900/20">
                <CheckCircle2 className="h-24 w-24 text-green-500 opacity-80" strokeWidth={1} />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA SECTION - The Bottom of the Vault */}
      <section className="relative overflow-hidden bg-slate-950 py-32 text-center">
        <div className="relative z-10 mx-auto max-w-3xl px-6">
          <h2 className="text-4xl font-bold text-white sm:text-5xl">
            Ready to bring order to the chaos?
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Join developers who are squashing bugs faster and building better software with BugVault.
          </p>
          
          <div className="mt-10 flex justify-center">
            <Link
              to="/signup"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-red-600 to-orange-500 p-[2px] transition-transform hover:scale-105 active:scale-95"
            >
              <span className="flex items-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-8 py-4 text-lg font-bold text-white">
                Get Started Now
                <ArrowRight className="transition-transform group-hover:translate-x-1" size={20} />
              </span>
              {/* Outer glow effect */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-red-600 to-orange-500 opacity-50 blur-xl transition-opacity group-hover:opacity-75"></div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;