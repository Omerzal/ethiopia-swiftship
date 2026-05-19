import { Languages } from "lucide-react";
import { useI18n, type Lang } from "@/lib/i18n";

export function LangSwitcher() {
  const { lang, setLang } = useI18n();
  return (
    <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-0.5">
      <Languages className="size-3.5 ml-1.5 text-muted-foreground" />
      {(["en", "am"] as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-2 py-1 text-xs rounded-md transition ${
            lang === l ? "bg-gradient-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {l === "en" ? "EN" : "አማ"}
        </button>
      ))}
    </div>
  );
}
