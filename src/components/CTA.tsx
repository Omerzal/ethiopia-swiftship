import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl p-10 md:p-16 glass shadow-glow">
          <div className="absolute -top-32 -right-32 size-96 rounded-full bg-gradient-primary opacity-30 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 size-96 rounded-full bg-accent/30 blur-3xl" />
          <div className="relative max-w-3xl">
            <h2 className="text-4xl md:text-6xl font-bold">
              Move Ethiopia's parcels at the speed of <span className="text-gradient">trust</span>.
            </h2>
            <p className="mt-5 text-muted-foreground text-lg">
              Onboard your branch network in days. Issue QR + secret codes, run smart pricing,
              detect fraud and deliver — all on one platform.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-medium shadow-glow hover:translate-y-[-1px] transition">
                Request demo <ArrowRight className="size-4" />
              </button>
              <button className="px-6 py-3 rounded-xl glass hover:bg-white/10 transition">
                Talk to sales
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
