import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jude Gao",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`dark-mode min-h-screen bg-gray-900  text-white ${inter.className}`}
      >
        <header className="mb-5 rounded-lg p-5">
          <h2 className="mb-3 text-center text-xl font-semibold">
            <Link href="/">Jude &gt; Bookmarks</Link>
          </h2>
        </header>
        <main>{children}</main>
        <footer className="mt-5 p-5 text-center">
          <p>&copy; 2024 Jude Gao. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
