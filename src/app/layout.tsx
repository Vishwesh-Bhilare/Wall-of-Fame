import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MMCOE Wall of Fame",
  description:
    "A production-grade student achievement portal for MMCOE to showcase verified academic, technical, and extracurricular excellence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <main className="min-h-screen">{children}</main>
        </div>
      </body>
    </html>
  );
}
