"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ReactNode } from "react";

type Variant = "gold" | "outline" | "ghost";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  fullWidth?: boolean;
}

const styles: Record<Variant, string> = {
  gold: "bg-[#D4A853] text-[#0A0A0A] hover:bg-[#e8c47a] font-semibold",
  outline: "border border-[#D4A853] text-[#D4A853] hover:bg-[#D4A853] hover:text-[#0A0A0A]",
  ghost: "text-[#F5F5F5] hover:text-[#D4A853]",
};

export function Button({
  children,
  href,
  onClick,
  variant = "gold",
  className = "",
  type = "button",
  disabled = false,
  fullWidth = false,
}: ButtonProps) {
  const base = `inline-flex items-center justify-center gap-2 px-6 py-3 rounded-sm text-sm tracking-wide transition-all duration-200 ${styles[variant]} ${fullWidth ? "w-full" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className}`;

  if (href) {
    return (
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Link href={href} className={base}>
          {children}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={base}
    >
      {children}
    </motion.button>
  );
}
