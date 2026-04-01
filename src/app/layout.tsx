import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jigsaw ERP - Prototype",
  description: "ERP Jigsaw Prototype Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className="antialiased">{children}</body>
    </html>
  );
}
