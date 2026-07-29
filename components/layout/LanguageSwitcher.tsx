"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function LanguageSwitcher() {
  const router = useRouter();
  const [locale, setLocale] = useState("fi");

  useEffect(() => {
    const saved = document.cookie
      .split("; ")
      .find((row) => row.startsWith("locale="))
      ?.split("=")[1];
    if (saved) setLocale(saved);
  }, []);

  const toggle = () => {
    const next = locale === "fi" ? "en" : "fi";
    document.cookie = `locale=${next};path=/;max-age=31536000`;
    setLocale(next);
    router.refresh();
  };

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1.5 text-xs font-semibold tracking-widest text-[#888888] hover:text-[#D4A853] transition-colors"
    >
      <span className={locale === "fi" ? "text-[#D4A853]" : ""}>FI</span>
      <span className="opacity-30">|</span>
      <span className={locale === "en" ? "text-[#D4A853]" : ""}>EN</span>
    </button>
  );
}
