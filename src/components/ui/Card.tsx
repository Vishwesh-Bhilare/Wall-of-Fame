import React from "react";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-white/60 bg-white/95 p-6 shadow-[0_18px_45px_rgba(177,18,38,0.12)] backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );
}import React from "react";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`bg-white rounded shadow p-6 ${className}`}>
      {children}
    </div>
  );
}
