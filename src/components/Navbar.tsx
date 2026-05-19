import { Link, useNavigate } from "@tanstack/react-router";
import { Package, Menu, LogOut } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { LangSwitcher } from "@/components/LangSwitcher";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();
  const { user, signOut } = useAuth();
  const nav = useNavigate();

  const links = [
    { to: "/", label: t("nav_home") },
    { to: "/features", label: t("nav_features") },
    { to: "/tracking", label: t("nav_tracking") },
    { to: "/dashboard", label: t("nav_dashboard") },
  ] as const;

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="px-4 sm:px-6 lg:px-10 mt-4">
        <nav className="glass rounded-2xl px-4 py-3 flex items-center justify-between shadow-card">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary blur-md opacity-60 group-hover:opacity-100 transition" />
              <div className="relative size-9 rounded-xl bg-gradient-primary grid place-items-center text-primary-foreground">
                <Package className="size-5" strokeWidth={2.4} />
              </div>
            </div>
            <div className="leading-tight">
              <div className="font-display font-bold tracking-tight">ParcelGrid</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Ethiopia · Nationwide</div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-white/5 transition"
                activeProps={{ className: "px-3 py-2 text-sm text-foreground rounded-lg bg-white/5" }}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <LangSwitcher />
            {user ? (
              <button
                onClick={async () => { await signOut(); nav({ to: "/" }); }}
                className="px-3 py-2 text-sm rounded-lg hover:bg-white/5 transition flex items-center gap-1.5"
              >
                <LogOut className="size-4" /> {t("nav_logout")}
              </button>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-sm rounded-lg hover:bg-white/5 transition">
                  {t("nav_signin")}
                </Link>
                <Link to="/login" search={{ mode: "signup" }} className="px-4 py-2 text-sm rounded-lg bg-gradient-primary text-primary-foreground font-medium shadow-glow hover:opacity-95 transition">
                  {t("nav_get_started")}
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden size-9 grid place-items-center rounded-lg hover:bg-white/5" onClick={() => setOpen(!open)}>
            <Menu className="size-5" />
          </button>
        </nav>

        {open && (
          <div className="md:hidden glass rounded-2xl mt-2 p-3 flex flex-col gap-1">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="px-3 py-2 rounded-lg hover:bg-white/5">
                {l.label}
              </Link>
            ))}
            <div className="px-3 py-2 flex items-center justify-between">
              <LangSwitcher />
              {user ? (
                <button onClick={signOut} className="text-sm">{t("nav_logout")}</button>
              ) : (
                <Link to="/login" onClick={() => setOpen(false)} className="text-sm">{t("nav_signin")}</Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
