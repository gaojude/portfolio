import { ReactNode } from "react";
import "./globals.css";
import { MountainIcon, PlusIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <title>Jude&apos;s Bookmarks</title>
      </head>
      <body>
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 md:px-6">
          <nav className="z-10 flex items-center gap-6 text-lg font-medium md:text-sm lg:gap-8 ">
            <Link
              className="flex items-center gap-2 text-lg font-semibold md:text-base"
              href="/"
            >
              <MountainIcon className="h-6 w-6" />
              <span>Bookmarks</span>
            </Link>

            <Link href="/create">
              <PlusIcon className="h-6 w-6" />
            </Link>
            <Link href="/?delete=true">
              <Trash2Icon className="h-6 w-6" />
            </Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
};

export default Layout;
