"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GradientButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const variants = {
  primary: {
    base: "bg-gradient-to-r from-blue-600 to-emerald-500 text-white",
    hover: "hover:from-blue-700 hover:to-emerald-600",
    focus: "focus:ring-blue-500/50",
  },
  secondary: {
    base: "bg-gradient-to-r from-amber-500 to-amber-600 text-white",
    hover: "hover:from-amber-600 hover:to-amber-700",
    focus: "focus:ring-amber-500/50",
  },
  success: {
    base: "bg-gradient-to-r from-emerald-500 to-green-600 text-white",
    hover: "hover:from-emerald-600 hover:to-green-700",
    focus: "focus:ring-emerald-500/50",
  },
  warning: {
    base: "bg-gradient-to-r from-orange-500 to-amber-500 text-white",
    hover: "hover:from-orange-600 hover:to-amber-600",
    focus: "focus:ring-orange-500/50",
  },
  danger: {
    base: "bg-gradient-to-r from-red-500 to-pink-600 text-white",
    hover: "hover:from-red-600 hover:to-pink-700",
    focus: "focus:ring-red-500/50",
  },
  info: {
    base: "bg-gradient-to-r from-cyan-500 to-blue-500 text-white",
    hover: "hover:from-cyan-600 hover:to-blue-600",
    focus: "focus:ring-cyan-500/50",
  },
};

const sizes = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-4 py-2 text-sm rounded-lg",
  lg: "px-6 py-3 text-base rounded-xl",
  xl: "px-8 py-4 text-lg rounded-xl",
};

export default function GradientButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  type = "button",
}: GradientButtonProps) {
  const variantStyles = variants[variant];
  const sizeStyles = sizes[size];

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variantStyles.base}
        ${variantStyles.hover}
        ${variantStyles.focus}
        ${sizeStyles}
        font-semibold
        transition-all duration-300
        shadow-lg hover:shadow-xl
        focus:outline-none focus:ring-4
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg
        ${className}
      `}
      whileHover={disabled ? {} : { scale: 1.02, y: -1 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.button>
  );
}
