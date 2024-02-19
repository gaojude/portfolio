import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import NavBar from "@/app/NavBar";
import Search from "@/app/Search";

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
        className={`dark-mode min-h-screen bg-gray-800 text-white ${inter.className}`}
      >
        <header className="text-center p-5 bg-gray-900">
          <h1 className="text-3xl font-bold">
            <Link href="/">Jude Gao&apos;s Tech Blog (WIP)</Link>
          </h1>
          <p className="text-gray-400">Explorations in Frontend Technology</p>

          <NavBar />
          <Search />
        </header>

        <main className="max-w-6xl px-8 mx-auto mt-5">{children}</main>

        <footer className="text-center bg-gray-900 mt-5 p-5">
          <p>&copy; 2024 Jude Gao. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
