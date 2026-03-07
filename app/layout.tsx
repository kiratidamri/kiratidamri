import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "SafeTraX — Travel Safety & Risk Advisory",
  description: "Context-aware travel risk and health advisory for travelers.",
  manifest: "/manifest.json",
  icons: { apple: "/icons/icon-192.png" },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SafeTraX",
  },
  formatDetection: { telephone: false, email: false },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#0d9488",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen font-body safe-area-padding">
        <Nav />
        <main className="min-h-screen pb-nav">{children}</main>
      </body>
    </html>
  );
}
