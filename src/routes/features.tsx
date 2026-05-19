import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Features } from "@/components/Features";
import { Workflow } from "@/components/Workflow";
import { CTA } from "@/components/CTA";

export const Route = createFileRoute("/features")({
  component: FeaturesPage,
  head: () => ({
    meta: [
      { title: "Features — ParcelGrid" },
      { name: "description", content: "QR + secret-code verification, smart warehouses, AI pricing, fraud detection, multi-language and Ethiopian payment integrations." },
    ],
  }),
});

function FeaturesPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-32">
        <section className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs">
            <span className="size-1.5 rounded-full bg-primary" /> Platform
          </div>
          <h1 className="mt-4 text-4xl md:text-6xl font-bold max-w-3xl">
            Every capability your <span className="text-gradient">nationwide network</span> needs.
          </h1>
        </section>
        <Features />
        <Workflow />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
