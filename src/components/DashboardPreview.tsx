import { Activity, Package, Truck, Users } from "lucide-react";

const kpis = [
  { label: "Parcels today", value: "8,412", delta: "+12.4%", icon: Package },
  { label: "In transit", value: "1,973", delta: "+3.1%", icon: Truck },
  { label: "Active customers", value: "42.6K", delta: "+8.0%", icon: Users },
  { label: "QR verifications", value: "11,204", delta: "+18.2%", icon: Activity },
];

const cities = [
  { name: "Addis Ababa", load: 92 },
  { name: "Hawassa", load: 74 },
  { name: "Bahir Dar", load: 68 },
  { name: "Mekelle", load: 55 },
  { name: "Dire Dawa", load: 49 },
  { name: "Adama", load: 81 },
];

const live = [
  { id: "PG-7F4K-9X2", from: "Addis Ababa", to: "Hawassa", status: "In transit", color: "text-primary" },
  { id: "PG-2C8M-1L4", from: "Adama", to: "Dire Dawa", status: "Ready for pickup", color: "text-accent" },
  { id: "PG-9R3Q-7T0", from: "Bahir Dar", to: "Gondar", status: "Stored", color: "text-muted-foreground" },
  { id: "PG-5N6V-3K8", from: "Mekelle", to: "Addis Ababa", status: "Out for delivery", color: "text-primary" },
];

export function DashboardPreview() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-4">
            <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs">
              <span className="size-1.5 rounded-full bg-primary" /> Control plane
            </div>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold">
              The <span className="text-gradient">nationwide</span> dashboard.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Super admins see every region. Managers see every agent. Agents see every parcel.
              Everyone sees the truth — in real time.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Super Admin", "Branch Manager", "Agent", "Driver", "Customer"].map((r) => (
                <span key={r} className="text-xs glass rounded-full px-3 py-1.5">
                  {r}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8 perspective-1000">
            <div
              className="glass rounded-3xl p-5 shadow-glow"
              style={{ transform: "rotateX(6deg) rotateY(-6deg)" }}
            >
              {/* window chrome */}
              <div className="flex items-center gap-2 pb-4 border-b border-white/10">
                <span className="size-2.5 rounded-full bg-destructive/70" />
                <span className="size-2.5 rounded-full bg-yellow-400/80" />
                <span className="size-2.5 rounded-full bg-accent" />
                <span className="ml-3 text-xs text-muted-foreground font-mono">parcelgrid.et/admin</span>
              </div>

              {/* KPIs */}
              <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
                {kpis.map((k) => (
                  <div key={k.label} className="rounded-xl p-3 bg-white/[0.03] border border-white/5">
                    <div className="flex items-center justify-between text-muted-foreground text-xs">
                      <span>{k.label}</span>
                      <k.icon className="size-3.5 text-primary" />
                    </div>
                    <div className="mt-2 text-xl font-display font-bold">{k.value}</div>
                    <div className="text-[10px] text-accent mt-1">{k.delta} vs yesterday</div>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid md:grid-cols-2 gap-4">
                {/* Chart */}
                <div className="rounded-xl p-4 bg-white/[0.03] border border-white/5">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Nationwide flow · last 24h</div>
                    <div className="text-[10px] text-muted-foreground font-mono">UTC+3</div>
                  </div>
                  <svg viewBox="0 0 320 120" className="mt-3 w-full h-32">
                    <defs>
                      <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="oklch(0.78 0.16 195)" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="oklch(0.78 0.16 195)" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,90 C30,70 50,80 80,55 C110,30 140,65 170,50 C200,35 230,70 260,40 C290,15 310,30 320,25 L320,120 L0,120 Z"
                      fill="url(#g1)"
                    />
                    <path
                      d="M0,90 C30,70 50,80 80,55 C110,30 140,65 170,50 C200,35 230,70 260,40 C290,15 310,30 320,25"
                      fill="none"
                      stroke="oklch(0.78 0.16 195)"
                      strokeWidth="2"
                    />
                    <path
                      d="M0,100 C40,95 70,80 110,85 C150,90 180,70 220,75 C260,80 290,60 320,65"
                      fill="none"
                      stroke="oklch(0.78 0.18 155)"
                      strokeWidth="2"
                      strokeDasharray="3 3"
                    />
                  </svg>
                  <div className="flex gap-4 text-[10px] text-muted-foreground mt-2">
                    <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-primary" /> Dispatched</span>
                    <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-accent" /> Delivered</span>
                  </div>
                </div>

                {/* Branch load */}
                <div className="rounded-xl p-4 bg-white/[0.03] border border-white/5">
                  <div className="text-sm font-medium">Branch warehouse load</div>
                  <div className="mt-3 space-y-2.5">
                    {cities.map((c) => (
                      <div key={c.name}>
                        <div className="flex justify-between text-[11px] text-muted-foreground">
                          <span>{c.name}</span>
                          <span className="font-mono">{c.load}%</span>
                        </div>
                        <div className="mt-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-primary"
                            style={{ width: `${c.load}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live feed */}
              <div className="mt-4 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                  <div className="text-sm font-medium">Live parcel feed</div>
                  <span className="text-[10px] font-mono text-accent flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-accent animate-pulse-glow" /> realtime
                  </span>
                </div>
                <div className="divide-y divide-white/5">
                  {live.map((l) => (
                    <div key={l.id} className="px-4 py-2.5 grid grid-cols-4 items-center text-xs">
                      <div className="font-mono text-foreground">{l.id}</div>
                      <div className="text-muted-foreground">{l.from}</div>
                      <div className="text-muted-foreground">→ {l.to}</div>
                      <div className={`${l.color} font-medium text-right`}>{l.status}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
