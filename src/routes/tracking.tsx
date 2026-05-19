import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Parcel3D } from "@/components/Parcel3D";
import { Check, Circle, Search, Truck, Warehouse, MapPin, QrCode } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { lookupParcel } from "@/lib/parcels.functions";
import { supabase } from "@/integrations/supabase/client";
import { useI18n, translateStatus } from "@/lib/i18n";

export const Route = createFileRoute("/tracking")({
  component: TrackingPage,
  head: () => ({ meta: [{ title: "Track a parcel — ParcelGrid" }] }),
});

const STATUS_ICON: Record<string, typeof Truck> = {
  registered: QrCode, stored: Warehouse, in_transit: Truck, arrived_hub: Warehouse,
  ready_for_pickup: MapPin, out_for_delivery: Truck, delivered: Check,
};

function TrackingPage() {
  const { t } = useI18n();
  const lookup = useServerFn(lookupParcel);
  const [code, setCode] = useState("PG-7F4K-9X2");
  const [parcel, setParcel] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  async function run(c = code) {
    if (!c) return;
    setLoading(true); setNotFound(false);
    const r = await lookup({ data: { code: c } });
    setLoading(false);
    if (!r.parcel) { setNotFound(true); setParcel(null); setEvents([]); return; }
    setParcel(r.parcel); setEvents(r.events); setBranches(r.branches);
  }

  useEffect(() => { run("PG-7F4K-9X2"); /* eslint-disable-next-line */ }, []);

  // Realtime: subscribe to events for current parcel
  useEffect(() => {
    if (!parcel?.id) return;
    const ch = supabase.channel(`parcel-${parcel.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "tracking_events", filter: `parcel_id=eq.${parcel.id}` },
        (p) => { if (p.eventType === "INSERT") setEvents((prev) => [...prev, p.new]); })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "parcels", filter: `id=eq.${parcel.id}` },
        (p) => setParcel((prev: any) => ({ ...prev, ...p.new })))
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [parcel?.id]);

  const branchName = (id?: string) => branches.find((b) => b.id === id)?.city ?? "—";

  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <main className="pt-32 pb-24 bg-hero w-full">
        <div className="px-4 sm:px-6 lg:px-10">
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs">
                <span className="size-1.5 rounded-full bg-accent animate-pulse-glow" /> Live tracking
              </div>
              <h1 className="mt-4 text-4xl md:text-6xl font-bold">{t("track_title")}</h1>

              <div className="mt-6 glass rounded-2xl p-2 flex items-center gap-2 shadow-card">
                <Search className="size-5 ml-3 text-muted-foreground" />
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && run()}
                  className="flex-1 bg-transparent outline-none py-3 px-2 text-sm font-mono"
                  placeholder={t("track_placeholder")}
                />
                <button onClick={() => run()} disabled={loading}
                  className="px-4 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-medium shadow-glow disabled:opacity-50">
                  {loading ? "…" : t("track_btn")}
                </button>
              </div>

              {notFound && (
                <div className="mt-6 glass rounded-xl p-4 text-sm text-destructive">{t("track_not_found")}</div>
              )}

              {parcel && (
                <div className="mt-10 relative">
                  <div className="absolute left-5 top-2 bottom-2 w-px bg-white/10" />
                  <ul className="space-y-5">
                    {events.map((e, idx) => {
                      const I = STATUS_ICON[e.status] ?? Circle;
                      const active = idx === events.length - 1 && parcel.status !== "delivered";
                      return (
                        <li key={e.id} className="relative pl-14">
                          <div className="absolute left-0 top-0 size-11 rounded-xl grid place-items-center bg-gradient-primary text-primary-foreground shadow-glow">
                            <I className="size-5" />
                          </div>
                          <div className="glass rounded-xl px-4 py-3 flex items-center justify-between">
                            <div>
                              <div className="font-medium flex items-center gap-2">
                                {translateStatus(t, e.status)}
                                {active && <span className="text-[10px] font-mono uppercase tracking-widest text-accent">live</span>}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {branchName(e.branch_id)}{e.note ? ` · ${e.note}` : ""}
                              </div>
                            </div>
                            <div className="text-xs font-mono text-muted-foreground">
                              {new Date(e.created_at).toLocaleString()}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>

            {parcel && (
              <aside className="lg:col-span-5 lg:sticky lg:top-32">
                <div className="glass rounded-3xl p-6 shadow-glow">
                  <div className="flex justify-center perspective-1000 py-4">
                    <div className="animate-float preserve-3d"><Parcel3D size={200} /></div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <Field k="Tracking" v={parcel.tracking_code} />
                    <Field k="Status" v={translateStatus(t, parcel.status)} />
                    <Field k="Sender" v={parcel.sender_name} />
                    <Field k="Receiver" v={parcel.receiver_name} />
                    <Field k="From" v={branchName(parcel.origin_branch_id)} />
                    <Field k="To" v={branchName(parcel.destination_branch_id)} />
                    <Field k="Weight" v={`${parcel.weight_kg} kg`} />
                    <Field k="Category" v={parcel.category} />
                    <Field k="Fragile" v={parcel.fragile ? "Yes" : "No"} />
                    <Field k="Price" v={`ETB ${parcel.price_etb}`} />
                  </div>
                  <div className="mt-4 rounded-xl bg-white/[0.03] border border-white/5 p-4">
                    <div className="text-xs text-muted-foreground uppercase tracking-widest">QR token</div>
                    <div className="mt-2 font-mono text-sm break-all">{parcel.qr_token}</div>
                    <div className="mt-3 text-[11px] text-muted-foreground">
                      Receiver presents this QR + a 6-digit secret code at the destination branch for secure release.
                    </div>
                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Field({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-lg bg-white/[0.03] border border-white/5 p-3">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{k}</div>
      <div className="mt-1 font-medium capitalize">{v}</div>
    </div>
  );
}
