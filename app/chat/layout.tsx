import { type Metadata } from "next";
import { ClerkProvider, SignedIn, UserButton } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Suspense } from "react";
import { FontSizeControl } from "./conversation/[id]/font-size-control";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fast Chat",
  description: "AI Chat Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        />
      </head>
      <body className="antialiased bg-grey-50">
        <Suspense>
          <ClerkProvider afterSignOutUrl="/chat">
            <TopNav />
            {children}
          </ClerkProvider>
        </Suspense>
      </body>
    </html>
  );
}

const TopNav = () => {
  return (
    <nav className="nav-modern h-[60px]">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link
            href="/chat"
            className="flex items-center gap-3 text-gray-700 hover:text-indigo-600 transition-colors group"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <span className="font-medium">Home</span>
          </Link>
          {/* AGENT ICON (WIP) */}
          {/* <Link
            href="/chat/agent"
            className="flex items-center gap-3 text-gray-700 hover:text-indigo-600 transition-colors group"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <path d="M12 2a8 8 0 0 0-8 8c0 1.892.402 3.13 1.5 4.5L12 22l6.5-7.5c1.098-1.37 1.5-2.608 1.5-4.5a8 8 0 0 0-8-8Z" />
                <path d="M12 6v4" />
                <path d="M12 14h.01" />
              </svg>
            </div>
            <span className="font-medium">Agent</span>
          </Link> */}
        </div>
        <div className="flex items-center gap-4">
          <div className="text-gray-700">
            <FontSizeControl />
          </div>
          <div className="w-[32px] h-[32px] rounded-lg border border-gray-200 bg-white/80 backdrop-blur-sm hover:bg-white transition-colors">
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
};
