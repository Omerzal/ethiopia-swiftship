import { Package } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-12 mt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-gradient-primary grid place-items-center text-primary-foreground">
              <Package className="size-4" />
            </div>
            <span className="font-display font-bold">ParcelGrid</span>
          </div>
          <p className="mt-3 text-xs text-muted-foreground max-w-xs">
            Nationwide parcel storage, logistics & secure QR delivery for Ethiopia.
          </p>
        </div>
        {[
          { h: "Platform", l: ["Features", "Dashboard", "Tracking", "Warehouse"] },
          { h: "Company", l: ["About", "Branches", "Careers", "Contact"] },
          { h: "Legal", l: ["Privacy", "Terms", "Security", "DPA"] },
        ].map((c) => (
          <div key={c.h}>
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{c.h}</div>
            <ul className="mt-3 space-y-2 text-sm">
              {c.l.map((i) => (
                <li key={i}><a className="hover:text-primary transition" href="#">{i}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-10 mx-auto max-w-7xl px-4 sm:px-6 text-xs text-muted-foreground flex justify-between flex-wrap gap-2">
        <span>© 2026 ParcelGrid Ethiopia. All rights reserved.</span>
        <span className="font-mono">v1.0 · region-et-central</span>
      </div>
    </footer>
  );
}
