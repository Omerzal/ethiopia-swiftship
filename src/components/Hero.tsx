import { ArrowRight, ShieldCheck, QrCode, Radar, Zap } from "lucide-react";
import { Parcel3D } from "./Parcel3D";
import { Tilt3D } from "./Tilt3D";

export function Hero() {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden bg-hero">
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <div className="absolute inset-0 noise opacity-60 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-12 gap-10 items-center">
        {/* Left content */}
        <div className="lg:col-span-6 animate-fade-up">
          <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs">
            <span className="size-2 rounded-full bg-accent animate-pulse-glow" />
            Live across <span className="text-foreground font-medium">12 regions</span> of Ethiopia
          </div>

          <h1 className="mt-6 text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.02]">
            Nationwide parcels,
            <br />
            secured by <span className="text-gradient">QR + Secret Code</span>.
          </h1>

          <p className="mt-6 text-lg text-muted-foreground max-w-xl">
            ParcelGrid is the enterprise logistics platform powering inter-city delivery,
            temporary storage, and fraud-proof parcel release for agents, branches and
            customers across Ethiopia.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-medium shadow-glow hover:translate-y-[-1px] transition">
              Launch dashboard
              <ArrowRight className="size-4 group-hover:translate-x-0.5 transition" />
            </button>
            <button className="inline-flex items-center gap-2 px-5 py-3 rounded-xl glass hover:bg-white/10 transition">
              <QrCode className="size-4 text-primary" /> Track a parcel
            </button>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 max-w-lg">
            {[
              { k: "1.2M+", v: "Parcels routed" },
              { k: "99.8%", v: "QR verify rate" },
              { k: "320+", v: "Agent branches" },
            ].map((s) => (
              <div key={s.v} className="glass rounded-xl p-4">
                <div className="text-2xl font-display font-bold text-gradient">{s.k}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 3D scene */}
        <div className="lg:col-span-6 relative h-[520px] perspective-1000">
          {/* Glow */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[420px] rounded-full bg-gradient-primary opacity-30 blur-3xl" />

          {/* Orbits */}
          <div className="absolute inset-0 grid place-items-center">
            <div className="relative size-[420px] rounded-full border border-white/10 animate-spin-slow">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 size-3 rounded-full bg-primary shadow-glow" />
              <div className="absolute top-1/2 -right-2 -translate-y-1/2 size-2.5 rounded-full bg-accent" />
            </div>
          </div>
          <div className="absolute inset-0 grid place-items-center">
            <div
              className="relative size-[300px] rounded-full border border-white/10"
              style={{ animation: "spin 14s linear infinite reverse" }}
            >
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 size-2.5 rounded-full bg-accent" />
            </div>
          </div>

          {/* Center floating parcel */}
          <div className="absolute inset-0 grid place-items-center">
            <Tilt3D max={22} glare={false} className="">
              <div className="animate-float preserve-3d">
                <Parcel3D size={240} />
              </div>
            </Tilt3D>
          </div>

          {/* Floating cards */}
          <FloatingCard
            className="top-6 left-2"
            icon={<ShieldCheck className="size-4 text-accent" />}
            title="Secret code verified"
            sub="Receiver authenticated · Addis Ababa"
          />
          <FloatingCard
            className="bottom-10 left-0"
            icon={<Radar className="size-4 text-primary" />}
            title="In transit · 247 km"
            sub="ETA 2h 14m → Hawassa hub"
          />
          <FloatingCard
            className="top-16 right-0"
            icon={<Zap className="size-4 text-accent" />}
            title="Smart price calculated"
            sub="ETB 412 · insured · fragile"
          />
          <FloatingCard
            className="bottom-4 right-4"
            icon={<QrCode className="size-4 text-primary" />}
            title="QR scanned at branch"
            sub="Dire Dawa · Agent #A-2049"
          />
        </div>
      </div>
    </section>
  );
}

function FloatingCard({
  className = "",
  icon,
  title,
  sub,
}: {
  className?: string;
  icon: React.ReactNode;
  title: string;
  sub: string;
}) {
  return (
    <div className={`absolute ${className}`}>
      <Tilt3D max={20} glare={false}>
        <div className="glass rounded-xl p-3 pr-4 shadow-card animate-float-slow">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-white/5 grid place-items-center" style={{ transform: "translateZ(20px)" }}>{icon}</div>
            <div style={{ transform: "translateZ(15px)" }}>
              <div className="text-xs font-medium">{title}</div>
              <div className="text-[10px] text-muted-foreground">{sub}</div>
            </div>
          </div>
        </div>
      </Tilt3D>
    </div>
  );
}
