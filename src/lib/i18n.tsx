import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "am";

const dict = {
  en: {
    nav_home: "Home",
    nav_features: "Features",
    nav_tracking: "Track",
    nav_dashboard: "Dashboard",
    nav_signin: "Sign in",
    nav_get_started: "Get started",
    nav_logout: "Sign out",
    hero_tag: "Nationwide · Ethiopia",
    hero_title: "Store, ship & deliver anything — anywhere in Ethiopia.",
    hero_sub: "QR + secret-code verified. Real-time tracking. AI-priced. Built for every region from Addis Ababa to Mekelle.",
    hero_cta_primary: "Send a parcel",
    hero_cta_secondary: "Track now",
    track_title: "Track your parcel",
    track_placeholder: "Tracking code, QR or FAN number",
    track_btn: "Track",
    track_not_found: "No parcel found with that code.",
    verify_title: "QR + secret-code verification",
    verify_sub: "Agents scan the parcel QR and the receiver enters the 6-digit secret to release.",
    verify_qr_ph: "Paste or scan QR token",
    verify_secret_ph: "6-digit secret",
    verify_lookup: "Lookup",
    verify_release: "Verify & release",
    verify_ok: "Released to receiver",
    verify_fail: "Verification failed",
    language: "Language",
    feature_lang_title: "Built bilingual — English & አማርኛ",
    feature_lang_sub: "Every page, dashboard, and SMS notification works in both languages. Receivers choose their language on signup.",
    dash_super: "Super Admin",
    dash_manager: "Branch Manager",
    dash_agent: "Branch Agent",
    dash_driver: "Driver",
    dash_customer: "Customer",
    status_registered: "Registered",
    status_stored: "Stored",
    status_in_transit: "In transit",
    status_arrived_hub: "Arrived at hub",
    status_ready_for_pickup: "Ready for pickup",
    status_out_for_delivery: "Out for delivery",
    status_delivered: "Delivered",
    status_returned: "Returned",
    status_lost: "Lost",
  },
  am: {
    nav_home: "መነሻ",
    nav_features: "ባህሪያት",
    nav_tracking: "መከታተያ",
    nav_dashboard: "ዳሽቦርድ",
    nav_signin: "ግባ",
    nav_get_started: "ጀምር",
    nav_logout: "ውጣ",
    hero_tag: "በመላው ኢትዮጵያ",
    hero_title: "ማንኛውንም ነገር ያስቀምጡ፣ ይላኩ እና ያድርሱ — በመላው ኢትዮጵያ።",
    hero_sub: "በQR እና ሚስጥራዊ ኮድ የተረጋገጠ። የቅጽበት ክትትል። በAI የተወሰነ ዋጋ።",
    hero_cta_primary: "ጥቅል ይላኩ",
    hero_cta_secondary: "አሁን ይከታተሉ",
    track_title: "ጥቅልዎን ይከታተሉ",
    track_placeholder: "የመከታተያ ኮድ፣ QR ወይም FAN ቁጥር",
    track_btn: "ይከታተሉ",
    track_not_found: "በዚህ ኮድ ጥቅል አልተገኘም።",
    verify_title: "የQR እና ሚስጥራዊ ኮድ ማረጋገጫ",
    verify_sub: "ወኪሎች QRን ይቃኛሉ፣ ተቀባዩ 6-አሃዝ ሚስጥር ያስገባል።",
    verify_qr_ph: "QR ቶከን ያስገቡ",
    verify_secret_ph: "6 አሃዝ ሚስጥር",
    verify_lookup: "ፈልግ",
    verify_release: "አረጋግጥ እና ልቀቅ",
    verify_ok: "ለተቀባዩ ተለቋል",
    verify_fail: "ማረጋገጥ አልተሳካም",
    language: "ቋንቋ",
    feature_lang_title: "በሁለት ቋንቋ የተገነባ — English እና አማርኛ",
    feature_lang_sub: "ሁሉም ገጽ፣ ዳሽቦርድ እና SMS በሁለቱም ቋንቋዎች ይሰራል።",
    dash_super: "ዋና አስተዳዳሪ",
    dash_manager: "የቅርንጫፍ ኃላፊ",
    dash_agent: "የቅርንጫፍ ወኪል",
    dash_driver: "አሽከርካሪ",
    dash_customer: "ደንበኛ",
    status_registered: "ተመዝግቧል",
    status_stored: "ተቀምጧል",
    status_in_transit: "በመጓጓዣ ላይ",
    status_arrived_hub: "ሐብ ደርሷል",
    status_ready_for_pickup: "ለመውሰድ ዝግጁ",
    status_out_for_delivery: "ለማድረስ ወጥቷል",
    status_delivered: "ተደርሷል",
    status_returned: "ተመልሷል",
    status_lost: "ጠፍቷል",
  },
} as const;

export type TKey = keyof typeof dict.en;

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: TKey) => string }>({
  lang: "en",
  setLang: () => {},
  t: (k) => k,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  useEffect(() => {
    const saved = (typeof window !== "undefined" && (localStorage.getItem("pg_lang") as Lang)) || "en";
    setLangState(saved);
  }, []);
  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("pg_lang", l);
  }, []);
  const t = useCallback((k: TKey) => dict[lang][k] ?? dict.en[k] ?? k, [lang]);
  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export const useI18n = () => useContext(Ctx);

export function translateStatus(t: (k: TKey) => string, s: string): string {
  const key = `status_${s}` as TKey;
  return t(key);
}
