import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { CitiesMarquee } from "@/components/CitiesMarquee";
import { Features } from "@/components/Features";
import { Workflow } from "@/components/Workflow";
import { Roles } from "@/components/Roles";
import { LanguageSection } from "@/components/LanguageSection";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "ParcelGrid — Smart Nationwide Parcel Storage & QR Delivery · Ethiopia" },
      { name: "description", content: "QR + secret-code verified parcel delivery, smart warehouses, AI pricing and nationwide logistics for every region of Ethiopia." },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <main className="w-full">
        <Hero />
        <CitiesMarquee />
        <Features />
        <Workflow />
        <Roles />
        <LanguageSection />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
