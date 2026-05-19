import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Parcel3D } from "@/components/Parcel3D";
import { Check, Circle, MapPin, QrCode, Search, Truck, Warehouse } from "lucide-react";

export const Route = createFileRoute("/tracking")({
  component: TrackingPage,
  head: () => ({
    meta: [
      { title: "Track a parcel — ParcelGrid" },
      { name: "description", content: "Real-time parcel tracking by QR, parcel ID, phone or FAN number across Ethiopia." },
    ],
  }),
});

const timeline = [
  { icon: QrCode, title: "Registered", place: "Addis Ababa · Bole branch", time: "Mon · 09:14", done: true },
  { icon: Warehouse, title: "Stored in warehouse", place: "Bole · Zone B-12", time: "Mon · 10:42", done: true },
  { icon: Truck, title: "Loaded for transport", place: "Truck #ET-A-2049", time: "Mon · 14:05", done: true },
  { icon: MapPin, title: "In transit", place: "247 km · ETA 2h 14m", time: "Mon · 16:30", done: true, active: true },
  { icon: Warehouse, title: "Arrived at transit hub", place: "Adama hub", time: "Pending", done: false },
  { icon: Check, title: "Ready for pickup", place: "Hawassa branch", time: "Pending", done: false },
];

function TrackingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-32 pb-24 bg-hero">
        <section className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs">
                <span className="size-1.5 rounded-full bg-accent animate-pulse-glow" /> Live tracking
              </div>
              <h1 className="mt-4 text-4xl md:text-6xl font-bold">
                Where is parcel <span className="text-gradient">PG-7F4K-9X2</span>?
              </h1>

              {/* Search */}
              <div className="mt-6 glass rounded-2xl p-2 flex items-center gap-2 shadow-card">
                <Search className="size-5 ml-3 text-muted-foreground" />
                <input
                  defaultValue="PG-7F4K-9X2"
                  className="flex-1 bg-transparent outline-none py-3 px-2 text-sm font-mono"
                  placeholder="QR code, parcel ID, phone or FAN number"
                />
                <button className="px-4 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-medium shadow-glow">
                  Track
                </button>
              </div>

              {/* Timeline */}
              <div className="mt-10 relative">
                <div className="absolute left-5 top-2 bottom-2 w-px bg-white/10" />
                <ul className="space-y-5">
                  {timeline.map((t) => (
                    <li key={t.title} className="relative pl-14">
                      <div
                        className={`absolute left-0 top-0 size-11 rounded-xl grid place-items-center border ${
                          t.done
                            ? "bg-gradient-primary border-transparent text-primary-foreground shadow-glow"
                            : "bg-white/5 border-white/10 text-muted-foreground"
                        }`}
                      >
                        {t.done ? <t.icon className="size-5" /> : <Circle className="size-4" />}
                      </div>
                      <div className="glass rounded-xl px-4 py-3 flex items-center justify-between">
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {t.title}
                            {t.active && (
                              <span className="text-[10px] font-mono uppercase tracking-widest text-accent">live</span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">{t.place}</div>
                        </div>
                        <div className="text-xs font-mono text-muted-foreground">{t.time}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Parcel card */}
            <aside className="lg:col-span-5 lg:sticky lg:top-32">
              <div className="glass rounded-3xl p-6 shadow-glow">
                <div className="flex justify-center perspective-1000 py-4">
                  <div className="animate-float preserve-3d">
                    <Parcel3D size={200} />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <Field k="Sender" v="Abebe K." />
                  <Field k="Receiver" v="Sara T." />
                  <Field k="From" v="Addis Ababa" />
                  <Field k="To" v="Hawassa" />
                  <Field k="Weight" v="4.2 kg" />
                  <Field k="Category" v="Electronics" />
                  <Field k="Fragility" v="High" />
                  <Field k="Price" v="ETB 412" />
                </div>

                <div className="mt-4 rounded-xl bg-white/[0.03] border border-white/5 p-4">
                  <div className="text-xs text-muted-foreground uppercase tracking-widest">Secret code</div>
                  <div className="mt-2 flex gap-2 justify-between font-mono">
                    {["4", "7", "2", "9", "1", "0"].map((d, i) => (
                      <div key={i} className="size-10 grid place-items-center rounded-lg bg-gradient-primary/20 border border-primary/30 text-lg font-bold">
                        {d}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-[11px] text-muted-foreground">
                    Receiver must present this code with the QR at the destination branch.
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Field({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-lg bg-white/[0.03] border border-white/5 p-3">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{k}</div>
      <div className="mt-1 font-medium">{v}</div>
    </div>
  );
}
