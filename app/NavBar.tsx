"use client";

import React from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

const NavBar = () => {
  const currentPath = "/" + (useSelectedLayoutSegment() || "");
  return (
    <nav className="flex justify-center space-x-6 mt-4 p-4 rounded-lg shadow-md">
      <Link
        className={`text-white px-3 py-2 rounded-md text-sm font-medium ${currentPath === "/" ? "bg-gray-700" : ""} hover:bg-gray-600 transition-colors duration-150`}
        href="/"
      >
        Home
      </Link>
      <Link
        className={`text-white px-3 py-2 rounded-md text-sm font-medium ${currentPath === "/about" ? "bg-gray-700" : ""} hover:bg-gray-600 transition-colors duration-150`}
        href="/about"
      >
        About
      </Link>
    </nav>
  );
};

export default NavBar;
