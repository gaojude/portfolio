"use client";

import { unstable_ViewTransition as ViewTransition } from "react";
import { useSelectedPage } from "./use-selected-page";

export const Header = () => {
  const selectedPage = useSelectedPage();
  return (
    <div className="absolute top-8 left-8 z-10">
      <ViewTransition key={`header-${selectedPage}`} name={selectedPage}>
        <h1 className="text-6xl font-bold tracking-tight uppercase">
          {selectedPage}
        </h1>
      </ViewTransition>
    </div>
  );
};
