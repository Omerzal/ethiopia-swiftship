import { Crown, Building2, UserCog, Truck, User } from "lucide-react";
import { Tilt3D } from "./Tilt3D";

const roles = [
  { icon: Crown, name: "Super Admin", color: "from-yellow-300 to-orange-400", desc: "Nationwide controller. Branches, policies, fraud, audit logs." },
  { icon: Building2, name: "Branch Manager", color: "from-primary to-accent", desc: "Regional operations, agents, disputes, financial reports." },
  { icon: UserCog, name: "Agent", color: "from-cyan-300 to-emerald-300", desc: "Registers customers & parcels, generates QR, releases parcels." },
  { icon: Truck, name: "Driver", color: "from-blue-300 to-cyan-300", desc: "Transit updates, GPS, handovers, damage & delay reports." },
  { icon: User, name: "Customer", color: "from-emerald-300 to-teal-300", desc: "Track, pay, receive notifications, retrieve stored materials." },
];

export function Roles() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs">
            <span className="size-1.5 rounded-full bg-primary" /> Role-based access
          </div>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold">
            Five roles. <span className="text-gradient">One source of truth.</span>
          </h2>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {roles.map((r) => (
            <Tilt3D key={r.name} max={18} className="h-full">
              <div className="glass rounded-2xl p-5 h-full shadow-card transition-shadow hover:shadow-glow">
                <div
                  className={`size-12 rounded-xl bg-gradient-to-br ${r.color} grid place-items-center text-background shadow-glow`}
                  style={{ transform: "translateZ(50px)" }}
                >
                  <r.icon className="size-5" strokeWidth={2.4} />
                </div>
                <h3 className="mt-4 font-semibold" style={{ transform: "translateZ(30px)" }}>{r.name}</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{r.desc}</p>
              </div>
            </Tilt3D>
          ))}
        </div>
      </div>
    </section>
  );
}
