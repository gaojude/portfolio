"use client";

import React from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

interface INavBarItem {
  path: string;
  name: string;
}

const NAVBAR_DATA: Record<string, INavBarItem> = {
  home: {
    path: "/",
    name: "Home",
  },

  about: {
    path: "/about",
    name: "About",
  },

  roadmap: {
    path: "/roadmap",
    name: "Roadmap",
  },

  admin: {
    path: "/admin",
    name: "Admin",
  },
};

const NavBar = () => {
  const currentPath = "/" + (useSelectedLayoutSegment() || "");
  return (
    <nav className="flex justify-center space-x-6 mt-4 p-4 rounded-lg shadow-md">
      {Object.keys(NAVBAR_DATA).map((key) => {
        const { path, name } = NAVBAR_DATA[key];
        return (
          <Link
            key={key}
            className={`text-white px-3 py-2 rounded-md text-sm font-medium ${currentPath === path ? "bg-gray-700" : ""} hover:bg-gray-600 transition-colors duration-150`}
            href={path}
          >
            {name}
          </Link>
        );
      })}
    </nav>
  );
};

export default NavBar;
