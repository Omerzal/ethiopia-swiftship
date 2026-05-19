import { useI18n } from "@/lib/i18n";
import { Languages } from "lucide-react";

export function LanguageSection() {
  const { t } = useI18n();
  return (
    <section className="relative py-24 w-full">
      <div className="px-4 sm:px-6 lg:px-10">
        <div className="glass rounded-3xl p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs">
              <Languages className="size-3.5" /> Bilingual by design
            </div>
            <h2 className="mt-4 text-3xl md:text-5xl font-bold">{t("feature_lang_title")}</h2>
            <p className="mt-4 text-muted-foreground max-w-xl">{t("feature_lang_sub")}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">English</div>
              <div className="mt-2 text-xl font-display font-semibold">Track your parcel</div>
              <div className="mt-1 text-sm text-muted-foreground">Real-time updates</div>
            </div>
            <div className="rounded-2xl border border-primary/30 bg-gradient-primary/10 p-5">
              <div className="text-xs uppercase tracking-widest text-primary">አማርኛ</div>
              <div className="mt-2 text-xl font-display font-semibold">ጥቅልዎን ይከታተሉ</div>
              <div className="mt-1 text-sm text-muted-foreground">የቅጽበት ዝመናዎች</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
