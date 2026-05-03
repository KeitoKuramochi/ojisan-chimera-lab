import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "おじさんキメララボ",
  description: "禁断の融合実験で、最高のおじさんキメラを創造しよう！",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${inter.className} surreal-bg min-h-screen text-foreground antialiased`}>
        <main className="mx-auto max-w-2xl px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
