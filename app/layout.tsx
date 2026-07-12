import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { BottomNav } from "@/components/BottomNav";
import { InstallPWA } from "@/components/InstallPWA";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Nós Dois",
  description: "Nosso cantinho especial",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Nós Dois",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#FAF7FF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/public/apple-touch-icon.png" />
      </head>
      <body>
        <Providers>
          <main className="pb-24 min-h-screen">
            {children}
          </main>
          <BottomNav />
          <InstallPWA />
        </Providers>
      </body>
    </html>
  );
}
