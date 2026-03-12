import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
};

export default function Button({
  children,
  onClick,
  type = "button",
  className = "",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 ${className}`}
    >
      {children}
    </button>
  );
}
