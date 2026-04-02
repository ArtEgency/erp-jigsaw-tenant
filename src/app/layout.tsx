import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";
import MuiThemeProvider from "@/lib/MuiThemeProvider";

export const metadata: Metadata = {
  title: "Jigsaw ERP — Tenant",
  description: "Jigsaw ERP Tenant System — jigsawx.com",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className="antialiased">
        <MuiThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </MuiThemeProvider>
      </body>
    </html>
  );
}
