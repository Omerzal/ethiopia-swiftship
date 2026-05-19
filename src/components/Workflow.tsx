import { PackagePlus, QrCode, KeyRound, PackageCheck } from "lucide-react";

const steps = [
  { icon: PackagePlus, title: "Register parcel", desc: "Agent captures photos, weight, route & fragility. QR + secret code auto-generated.", tag: "Step 01" },
  { icon: QrCode, title: "Scan at destination", desc: "Receiver presents QR. System fetches full history, images and route timeline.", tag: "Step 02" },
  { icon: KeyRound, title: "Verify secret code", desc: "Receiver enters 6-digit secret. System validates ownership before release.", tag: "Step 03" },
  { icon: PackageCheck, title: "Secure release", desc: "Digital signature, GPS timestamp captured. QR expires after handover.", tag: "Step 04" },
];

export function Workflow() {
  return (
    <section className="relative py-24">
      <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs">
            <span className="size-1.5 rounded-full bg-accent" /> Verification flow
          </div>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold">
            Four steps. <span className="text-gradient">Zero fraud.</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Every parcel is bound to a sender, receiver, QR identity and a secret code —
            making unauthorized pickup mathematically improbable.
          </p>
        </div>

        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s, i) => (
            <div key={s.title} className="relative">
              <div className="glass rounded-2xl p-6 h-full shadow-card relative overflow-hidden">
                <div className="absolute -top-10 -right-10 size-32 rounded-full bg-gradient-primary opacity-15 blur-2xl" />
                <div className="text-[10px] font-mono tracking-[0.3em] text-primary uppercase">
                  {s.tag}
                </div>
                <div className="mt-4 size-12 rounded-xl bg-gradient-primary grid place-items-center text-primary-foreground shadow-glow">
                  <s.icon className="size-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 size-6 grid place-items-center text-primary/60">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
