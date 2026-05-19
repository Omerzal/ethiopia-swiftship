import {
  QrCode,
  Warehouse,
  Truck,
  ShieldAlert,
  BrainCircuit,
  Languages,
  CreditCard,
  Bell,
  MapPin,
} from "lucide-react";

const features = [
  { icon: QrCode, title: "QR + Secret Code Release", desc: "Two-factor parcel release combining QR scan and secret verification code — preventing theft and fake screenshots." },
  { icon: Warehouse, title: "Smart Warehouse Grid", desc: "Zone-based storage with shelf mapping, occupancy heatmaps, expiry tracking and overdue alerts." },
  { icon: Truck, title: "Nationwide Logistics", desc: "Inter-city dispatch, transit hub handoffs, vehicle assignment and live route optimization." },
  { icon: MapPin, title: "Real-Time Tracking", desc: "13 status states with live GPS, ETA, delay reasons and road condition reports for every parcel." },
  { icon: ShieldAlert, title: "Fraud Detection AI", desc: "Detects duplicate IDs, suspicious scans, multiple failed codes and abnormal branch operations." },
  { icon: BrainCircuit, title: "AI Pricing & Forecasting", desc: "Dynamic pricing on weight, distance, fragility — plus demand and warehouse occupancy prediction." },
  { icon: CreditCard, title: "Ethiopian Payments", desc: "Telebirr, CBE Birr, mobile money, bank transfer and cash — with digital invoices & refunds." },
  { icon: Bell, title: "Multi-Channel Alerts", desc: "SMS, email and push for dispatch, arrival, pickup readiness, payment and storage expiry." },
  { icon: Languages, title: "5 Languages", desc: "English, Amharic, Afaan Oromo, Somali and Tigrinya — nationwide accessibility for every customer." },
];

export function Features() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs">
            <span className="size-1.5 rounded-full bg-primary" /> Platform capabilities
          </div>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold">
            Everything a nationwide <span className="text-gradient">parcel network</span> needs.
          </h2>
          <p className="mt-4 text-muted-foreground">
            One control plane for super admins, branch managers, agents, drivers and customers —
            with security, AI and real-time visibility built in.
          </p>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group relative glass rounded-2xl p-6 hover:translate-y-[-2px] transition shadow-card overflow-hidden"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="absolute -top-16 -right-16 size-40 rounded-full bg-gradient-primary opacity-0 group-hover:opacity-20 blur-2xl transition" />
              <div className="relative">
                <div className="size-11 rounded-xl bg-gradient-primary/20 border border-white/10 grid place-items-center">
                  <f.icon className="size-5 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
