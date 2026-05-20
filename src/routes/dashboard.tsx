import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth, type Role } from "@/lib/auth";
import { useI18n, translateStatus } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { verifyAndRelease, advanceStatus } from "@/lib/parcels.functions";
import { useServerFn } from "@tanstack/react-start";
import { Activity, Package, Truck, Users, ShieldCheck, QrCode, Building2, MapPin, CheckCircle2, XCircle } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  head: () => ({ meta: [{ title: "Dashboard — ParcelGrid" }] }),
});

const ROLE_LABEL: Record<Role, string> = {
  super_admin: "dash_super", branch_manager: "dash_manager", agent: "dash_agent",
  driver: "dash_driver", customer: "dash_customer",
} as never;

function DashboardPage() {
  const { user, primaryRole, roles, loading } = useAuth();
  const { t } = useI18n();
  const nav = useNavigate();
  const [activeRole, setActiveRole] = useState<Role | null>(null);

  useEffect(() => { if (!loading && !user) nav({ to: "/login" }); }, [loading, user, nav]);
  useEffect(() => { if (primaryRole && !activeRole) setActiveRole(primaryRole); }, [primaryRole, activeRole]);

  if (loading || !user) return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading…</div>;

  // Protected routes: only roles assigned to this user can be selected/rendered.
  const availableRoles: Role[] = roles.length ? roles : ["customer"];
  const requested = activeRole ?? availableRoles[0];
  const role: Role = availableRoles.includes(requested) ? requested : availableRoles[0];
  const canView = (r: Role) => availableRoles.includes(r);

  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-widest">Signed in as</div>
            <h1 className="text-3xl md:text-4xl font-bold">{user.email}</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            {availableRoles.map((r) => (
              <button key={r} onClick={() => setActiveRole(r)}
                className={`px-3 py-1.5 text-xs rounded-full border ${role === r ? "bg-gradient-primary text-primary-foreground border-transparent shadow-glow" : "border-white/10 text-muted-foreground hover:text-foreground"}`}>
                {t(ROLE_LABEL[r] as never)}
              </button>
            ))}
          </div>
        </div>

        {role === "super_admin" && canView("super_admin") && <SuperAdminView />}
        {role === "branch_manager" && canView("branch_manager") && <BranchManagerView />}
        {role === "agent" && canView("agent") && <AgentView />}
        {role === "driver" && canView("driver") && <DriverView />}
        {role === "customer" && canView("customer") && <CustomerView />}

        {role !== "customer" && canView(role) && <VerifyPanel />}
      </main>
      <Footer />

      {primaryRole === "customer" && (
        <div className="fixed bottom-6 right-6 glass rounded-xl px-4 py-3 text-xs text-muted-foreground max-w-xs">
          You're signed in as a customer. To preview staff dashboards, an admin can assign a role in the Backend.
        </div>
      )}
    </div>
  );
}

function Stat({ icon: I, label, value, delta }: { icon: typeof Activity; label: string; value: string | number; delta?: string }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between text-muted-foreground text-xs">
        <span>{label}</span><I className="size-4 text-primary" />
      </div>
      <div className="mt-2 text-2xl font-display font-bold">{value}</div>
      {delta && <div className="text-[10px] text-accent mt-1">{delta}</div>}
    </div>
  );
}

function useParcels(filter?: { status?: string }) {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => {
    let q = supabase.from("parcels").select("*").order("created_at", { ascending: false }).limit(50);
    if (filter?.status) q = q.eq("status", filter.status as never);
    q.then(({ data }) => setRows(data ?? []));
    const ch = supabase.channel("parcels-dash").on("postgres_changes", { event: "*", schema: "public", table: "parcels" }, (p) => {
      setRows((prev) => {
        const next = [...prev];
        const i = next.findIndex((r) => r.id === (p.new as any)?.id);
        if (p.eventType === "DELETE") return next.filter((r) => r.id !== (p.old as any).id);
        if (i >= 0) next[i] = p.new as any; else if (p.new) next.unshift(p.new as any);
        return next;
      });
    }).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [filter?.status]);
  return rows;
}

function ParcelTable({ rows }: { rows: any[] }) {
  const { t } = useI18n();
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="grid grid-cols-5 px-4 py-2.5 text-[11px] uppercase tracking-widest text-muted-foreground border-b border-white/10">
        <div>Tracking</div><div>Sender</div><div>Receiver</div><div>Status</div><div className="text-right">Created</div>
      </div>
      <div className="divide-y divide-white/5 max-h-[420px] overflow-y-auto">
        {rows.length === 0 && <div className="px-4 py-6 text-sm text-muted-foreground">No parcels.</div>}
        {rows.map((p) => (
          <div key={p.id} className="grid grid-cols-5 px-4 py-2.5 text-xs items-center">
            <div className="font-mono">{p.tracking_code}</div>
            <div className="text-muted-foreground truncate">{p.sender_name}</div>
            <div className="text-muted-foreground truncate">{p.receiver_name}</div>
            <div><span className="text-primary">{translateStatus(t, p.status)}</span></div>
            <div className="text-right text-muted-foreground font-mono">{new Date(p.created_at).toLocaleDateString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SuperAdminView() {
  const rows = useParcels();
  const [branches, setBranches] = useState<any[]>([]);
  useEffect(() => { supabase.from("branches").select("*").then(({ data }) => setBranches(data ?? [])); }, []);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat icon={Package} label="Parcels (recent)" value={rows.length} delta="live" />
        <Stat icon={Truck} label="In transit" value={rows.filter(r => r.status === "in_transit").length} />
        <Stat icon={ShieldCheck} label="Delivered" value={rows.filter(r => r.status === "delivered").length} />
        <Stat icon={Building2} label="Branches" value={branches.length} />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <ParcelTable rows={rows} />
        <div className="glass rounded-2xl p-5">
          <div className="text-sm font-medium mb-3">Branch warehouse load</div>
          <div className="space-y-2.5">
            {branches.map((b) => {
              const pct = Math.min(100, Math.round((b.current_load / Math.max(b.capacity, 1)) * 100));
              return (
                <div key={b.id}>
                  <div className="flex justify-between text-[11px] text-muted-foreground"><span>{b.city} · {b.code}</span><span className="font-mono">{pct}%</span></div>
                  <div className="mt-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full bg-gradient-primary" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function BranchManagerView() {
  const rows = useParcels();
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat icon={Package} label="Branch parcels" value={rows.length} />
        <Stat icon={Users} label="Active agents" value={6} />
        <Stat icon={Truck} label="Outbound today" value={rows.filter(r => r.status === "in_transit").length} />
        <Stat icon={ShieldCheck} label="Released" value={rows.filter(r => r.status === "delivered").length} />
      </div>
      <ParcelTable rows={rows} />
    </div>
  );
}

function AgentView() {
  const rows = useParcels({ status: "ready_for_pickup" });
  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-1"><QrCode className="size-4 text-primary" /><div className="text-sm font-medium">Parcels ready for QR + secret release</div></div>
        <div className="text-xs text-muted-foreground">Use the verification panel below to scan the QR and enter the receiver's secret code.</div>
      </div>
      <ParcelTable rows={rows} />
    </div>
  );
}

function DriverView() {
  const rows = useParcels({ status: "in_transit" });
  const advance = useServerFn(advanceStatus);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Stat icon={Truck} label="My active loads" value={rows.length} />
        <Stat icon={MapPin} label="Nationwide trips" value={"—"} />
        <Stat icon={Activity} label="ETA accuracy" value={"94%"} />
      </div>
      <div className="glass rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-white/10 text-sm font-medium">In transit — mark arrival</div>
        <div className="divide-y divide-white/5">
          {rows.map((p) => (
            <div key={p.id} className="px-4 py-3 flex items-center justify-between text-xs">
              <div className="flex flex-col"><span className="font-mono">{p.tracking_code}</span><span className="text-muted-foreground">{p.sender_name} → {p.receiver_name}</span></div>
              <button onClick={() => advance({ data: { parcelId: p.id, status: "ready_for_pickup", note: "Driver marked arrival at destination" } })}
                className="px-3 py-1.5 rounded-lg bg-gradient-primary text-primary-foreground text-xs shadow-glow">Mark arrived</button>
            </div>
          ))}
          {rows.length === 0 && <div className="px-4 py-6 text-sm text-muted-foreground">No active loads.</div>}
        </div>
      </div>
    </div>
  );
}

function CustomerView() {
  const { user } = useAuth();
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => {
    if (!user) return;
    supabase.from("parcels").select("*").eq("sender_id", user.id).order("created_at", { ascending: false }).then(({ data }) => setRows(data ?? []));
  }, [user]);
  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="text-sm text-muted-foreground">You haven't shipped anything yet?</div>
          <div className="text-lg font-display font-semibold">Track any parcel by code — no login needed.</div>
        </div>
        <Link to="/tracking" className="px-4 py-2 rounded-xl bg-gradient-primary text-primary-foreground text-sm shadow-glow">Open tracking</Link>
      </div>
      <ParcelTable rows={rows} />
    </div>
  );
}

function VerifyPanel() {
  const verify = useServerFn(verifyAndRelease);
  const [qr, setQr] = useState("");
  const [secret, setSecret] = useState("");
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const { t } = useI18n();

  async function run() {
    setLoading(true); setResult(null);
    try {
      const r = await verify({ data: { qr, secret } });
      if (r.released) setResult({ ok: true, msg: `${t("verify_ok")} — ${r.parcel?.receiver_name ?? ""}` });
      else if (!r.qrOk) setResult({ ok: false, msg: "QR token not found" });
      else if (!r.secretOk) setResult({ ok: false, msg: "Incorrect secret code" });
      else setResult({ ok: false, msg: t("verify_fail") });
    } catch (e) { setResult({ ok: false, msg: e instanceof Error ? e.message : "Error" }); }
    finally { setLoading(false); }
  }

  return (
    <div className="mt-8 glass rounded-3xl p-6 shadow-glow">
      <div className="flex items-center gap-2"><ShieldCheck className="size-5 text-primary" /><h2 className="text-xl font-semibold">{t("verify_title")}</h2></div>
      <p className="mt-1 text-sm text-muted-foreground">{t("verify_sub")}</p>
      <div className="mt-4 grid md:grid-cols-[1fr_180px_140px] gap-3">
        <input value={qr} onChange={(e) => setQr(e.target.value)} placeholder={t("verify_qr_ph")}
          className="px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm font-mono outline-none focus:border-primary/50" />
        <input value={secret} onChange={(e) => setSecret(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder={t("verify_secret_ph")} maxLength={6}
          className="px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm font-mono tracking-widest text-center outline-none focus:border-primary/50" />
        <button onClick={run} disabled={loading || !qr || secret.length !== 6}
          className="px-3 py-2.5 rounded-lg bg-gradient-primary text-primary-foreground text-sm shadow-glow disabled:opacity-50">
          {loading ? "…" : t("verify_release")}
        </button>
      </div>
      {result && (
        <div className={`mt-4 flex items-center gap-2 text-sm rounded-lg px-3 py-2 ${result.ok ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"}`}>
          {result.ok ? <CheckCircle2 className="size-4" /> : <XCircle className="size-4" />} {result.msg}
        </div>
      )}
      <div className="mt-4 text-[11px] text-muted-foreground">Demo QR tokens: <code className="font-mono">QR-2C8M1L4-DEMO</code> · secret <code className="font-mono">118203</code></div>
    </div>
  );
}
