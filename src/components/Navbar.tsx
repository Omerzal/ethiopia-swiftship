import { Link } from "@tanstack/react-router";
import { Package, Menu } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const links = [
    { to: "/", label: "Home" },
    { to: "/features", label: "Features" },
    { to: "/tracking", label: "Tracking" },
    { to: "/dashboard", label: "Dashboard" },
  ] as const;

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 mt-4">
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
            <button className="px-4 py-2 text-sm rounded-lg hover:bg-white/5 transition">Sign in</button>
            <button className="px-4 py-2 text-sm rounded-lg bg-gradient-primary text-primary-foreground font-medium shadow-glow hover:opacity-95 transition">
              Get started
            </button>
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
          </div>
        )}
      </div>
    </header>
  );
}
