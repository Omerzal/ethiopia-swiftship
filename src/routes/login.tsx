import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Navbar } from "@/components/Navbar";
import { Package, Crown, Building2, UserCog, Truck, User, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth";

const DEMO_ROLES = [
  { key: "super_admin",   label: "Super Admin",     email: "superadmin@parcelgrid.demo", icon: Crown,     tint: "from-yellow-300 to-orange-400" },
  { key: "branch_manager",label: "Branch Manager",  email: "manager@parcelgrid.demo",    icon: Building2, tint: "from-primary to-accent" },
  { key: "agent",         label: "Agent",           email: "agent@parcelgrid.demo",      icon: UserCog,   tint: "from-cyan-300 to-emerald-300" },
  { key: "driver",        label: "Driver",          email: "driver@parcelgrid.demo",     icon: Truck,     tint: "from-blue-300 to-cyan-300" },
  { key: "customer",      label: "Customer",        email: "customer@parcelgrid.demo",   icon: User,      tint: "from-emerald-300 to-teal-300" },
] as const;
const DEMO_PASSWORD = "demo123456";

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>) => ({ mode: (s.mode as string) === "signup" ? "signup" : "signin" }),
  component: LoginPage,
});

function LoginPage() {
  const { mode } = Route.useSearch();
  const nav = useNavigate();
  const { user } = useAuth();
  const [isSignup, setIsSignup] = useState(mode === "signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (user) nav({ to: "/dashboard" }); }, [user, nav]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(""); setLoading(true);
    try {
      if (isSignup) {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin + "/dashboard", data: { full_name: name } },
        });
        if (error) throw error;
        nav({ to: "/dashboard" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        nav({ to: "/dashboard" });
      }
    } catch (e) { setErr(e instanceof Error ? e.message : "Failed"); } finally { setLoading(false); }
  }

  async function google() {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/dashboard" });
    if (r.error) setErr(r.error.message);
  }

  async function demoLogin(demoEmail: string) {
    setErr(""); setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: demoEmail, password: DEMO_PASSWORD });
      if (error) throw error;
      nav({ to: "/dashboard" });
    } catch (e) { setErr(e instanceof Error ? e.message : "Failed"); } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen w-full bg-hero">
      <Navbar />
      <main className="pt-32 pb-20 px-4 sm:px-6">
        <div className="mx-auto max-w-5xl grid lg:grid-cols-[1.1fr_1fr] gap-6">
          {/* Demo role panel */}
          <div className="glass rounded-3xl p-7 shadow-glow relative overflow-hidden">
            <div className="absolute -top-24 -right-24 size-72 rounded-full bg-gradient-primary opacity-25 blur-3xl pointer-events-none" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1 text-xs">
                <Sparkles className="size-3.5 text-accent" /> Instant demo access
              </div>
              <h2 className="mt-3 text-2xl font-bold">Explore every dashboard <span className="text-gradient">in one click</span></h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Pick a role to sign in with a pre-seeded demo account. Full data, full permissions, no setup.
              </p>

              <div className="mt-6 space-y-2.5">
                {DEMO_ROLES.map((r) => (
                  <button
                    key={r.key}
                    onClick={() => demoLogin(r.email)}
                    disabled={loading}
                    className="group w-full flex items-center gap-3 p-3 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:border-primary/40 transition disabled:opacity-50 text-left"
                  >
                    <div className={`size-10 rounded-xl bg-gradient-to-br ${r.tint} grid place-items-center text-background shadow-glow shrink-0 group-hover:scale-110 transition`}>
                      <r.icon className="size-5" strokeWidth={2.4} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold">Sign in as {r.label}</div>
                      <div className="text-[11px] text-muted-foreground font-mono truncate">{r.email}</div>
                    </div>
                    <div className="text-xs text-primary opacity-0 group-hover:opacity-100 transition">Enter →</div>
                  </button>
                ))}
              </div>

              <div className="mt-5 text-[11px] text-muted-foreground border-t border-white/5 pt-4">
                Shared password: <span className="font-mono text-foreground/80">demo123456</span> · You can also use the form to create your own account.
              </div>
            </div>
          </div>

          {/* Real auth form */}
          <div className="glass rounded-3xl p-7 shadow-card">
            <div className="flex items-center gap-2 mb-6">
              <div className="size-9 rounded-xl bg-gradient-primary grid place-items-center text-primary-foreground">
                <Package className="size-5" />
              </div>
              <div className="font-display font-bold text-lg">ParcelGrid</div>
            </div>
            <h1 className="text-xl font-bold">{isSignup ? "Create account" : "Welcome back"}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isSignup ? "Send & track parcels across Ethiopia." : "Sign in to your account."}
            </p>

            <button onClick={google} disabled={loading} className="mt-5 w-full py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-sm disabled:opacity-50">
              Continue with Google
            </button>
            <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
              <div className="h-px flex-1 bg-white/10" /> or <div className="h-px flex-1 bg-white/10" />
            </div>

            <form onSubmit={submit} className="space-y-3">
              {isSignup && (
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name"
                  className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm outline-none focus:border-primary/50" />
              )}
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
                className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm outline-none focus:border-primary/50" />
              <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"
                className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm outline-none focus:border-primary/50" />
              {err && <div className="text-xs text-destructive">{err}</div>}
              <button disabled={loading} className="w-full py-2.5 rounded-xl bg-gradient-primary text-primary-foreground font-medium shadow-glow disabled:opacity-50">
                {loading ? "..." : isSignup ? "Create account" : "Sign in"}
              </button>
            </form>

            <div className="mt-4 text-center text-sm text-muted-foreground">
              {isSignup ? "Already have an account?" : "New here?"}{" "}
              <button onClick={() => setIsSignup(!isSignup)} className="text-primary hover:underline">
                {isSignup ? "Sign in" : "Create account"}
              </button>
            </div>
            <div className="mt-2 text-center text-xs text-muted-foreground">
              <Link to="/" className="hover:underline">← Back to home</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
