import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { DashboardPreview } from "@/components/DashboardPreview";
import { Roles } from "@/components/Roles";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  head: () => ({
    meta: [
      { title: "Dashboard — ParcelGrid" },
      { name: "description", content: "Nationwide control plane: KPIs, warehouse load, branch performance and a real-time parcel feed." },
    ],
  }),
});

function DashboardPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-32">
        <section className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs">
            <span className="size-1.5 rounded-full bg-primary" /> Nationwide control plane
          </div>
          <h1 className="mt-4 text-4xl md:text-6xl font-bold">
            The <span className="text-gradient">ParcelGrid</span> command center.
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Every region, every branch, every parcel — one live operational view for
            super admins and managers.
          </p>
        </section>
        <DashboardPreview />
        <Roles />
      </main>
      <Footer />
    </div>
  );
}
