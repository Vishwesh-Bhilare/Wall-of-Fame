import React from "react";

type ButtonVariant = "primary" | "secondary" | "success" | "danger" | "ghost";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
  variant?: ButtonVariant;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-gradient-to-r from-red-700 to-red-600 text-white hover:brightness-95",
  secondary: "bg-white text-red-700 border border-red-200 hover:bg-red-50",
  success: "bg-emerald-600 text-white hover:bg-emerald-700",
  danger: "bg-rose-600 text-white hover:bg-rose-700",
  ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
};

export default function Button({
  children,
  onClick,
  type = "button",
  className = "",
  disabled = false,
  variant = "primary",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${variantStyles[variant]} ${
        disabled ? "cursor-not-allowed opacity-60" : ""
      } ${className}`}
    >
      {children}
    </button>
  );
}