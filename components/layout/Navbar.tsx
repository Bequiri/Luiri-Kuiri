"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ROUTES } from "@/lib/constants";

export function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 80], [0, 1]);
  const borderOpacity = useTransform(scrollY, [0, 80], [0, 1]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const navItems = ROUTES.filter((r) => r.key !== "home");

  return (
    <>
      <motion.header
        style={{ backgroundColor: `rgba(10,10,10,${bgOpacity})`, borderBottomColor: `rgba(212,168,83,${borderOpacity})` }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-transparent backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex flex-col leading-none">
            <span className="text-[#D4A853] font-bold text-lg tracking-[0.15em] font-serif">NORTHSTAR</span>
            <span className="text-[#F5F5F5] text-[9px] tracking-[0.3em] opacity-60">EXECUTIVE</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((route) => (
              <Link
                key={route.key}
                href={route.href}
                className={`text-xs tracking-widest uppercase transition-colors ${
                  pathname === route.href
                    ? "text-[#D4A853]"
                    : "text-[#888888] hover:text-[#F5F5F5]"
                }`}
              >
                {t(route.key as "services" | "vehicle" | "story" | "pricing" | "business" | "contact")}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link
              href="/varaa"
              className="hidden sm:inline-flex items-center px-4 py-2 bg-[#D4A853] text-[#0A0A0A] text-xs font-bold tracking-widest uppercase hover:bg-[#e8c47a] transition-colors rounded-sm"
            >
              {t("book")}
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden flex flex-col gap-1.5 p-1"
              aria-label="Menu"
            >
              <motion.span
                animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                className="block w-6 h-0.5 bg-[#F5F5F5] origin-center transition-all"
              />
              <motion.span
                animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="block w-6 h-0.5 bg-[#F5F5F5]"
              />
              <motion.span
                animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                className="block w-6 h-0.5 bg-[#F5F5F5] origin-center transition-all"
              />
            </button>
          </div>
        </div>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={menuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        className={`fixed inset-0 z-40 bg-[#0A0A0A] flex flex-col pt-24 px-8 ${menuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        <nav className="flex flex-col gap-6">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className={`text-2xl font-serif ${pathname === "/" ? "text-[#D4A853]" : "text-[#F5F5F5]"}`}
          >
            {t("home")}
          </Link>
          {navItems.map((route) => (
            <Link
              key={route.key}
              href={route.href}
              onClick={() => setMenuOpen(false)}
              className={`text-2xl font-serif ${pathname === route.href ? "text-[#D4A853]" : "text-[#F5F5F5]"}`}
            >
              {t(route.key as "services" | "vehicle" | "story" | "pricing" | "business" | "contact")}
            </Link>
          ))}
        </nav>
        <div className="mt-12">
          <Link
            href="/varaa"
            onClick={() => setMenuOpen(false)}
            className="block text-center px-6 py-4 bg-[#D4A853] text-[#0A0A0A] font-bold tracking-widest uppercase text-sm rounded-sm"
          >
            {t("book")}
          </Link>
        </div>
      </motion.div>
    </>
  );
}
