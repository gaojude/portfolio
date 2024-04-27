import { ReactNode } from "react";
import "./globals.css";
import { HomeIcon, PlusIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 md:px-6">
        <nav className="flex items-center gap-6 text-lg font-medium md:text-sm lg:gap-8">
          <Link
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
            href="/"
          >
            <HomeIcon className="h-6 w-6" />
            Home
          </Link>
          <Link
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
            href="/create"
          >
            <PlusIcon className="h-6 w-6" />
            Create
          </Link>
          <Link
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
            href="/?delete=true"
          >
            <Trash2Icon className="h-6 w-6" />
            Delete
          </Link>
        </nav>
      </header>
      {children}
    </>
  );
};

export default Layout;
