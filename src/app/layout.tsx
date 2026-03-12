import "./globals.css";

export const metadata = {
  title: "Student Achievement Portal",
  description: "Wall of Fame for College Achievements",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}