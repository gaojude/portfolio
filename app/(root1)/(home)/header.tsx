"use client";

import { useSelectedPage } from "./use-selected-page";

export const Header = () => {
  const selectedPage = useSelectedPage();
  return (
    <div className="absolute top-8 left-8 z-10">
      <h1
        className="text-6xl font-bold tracking-tight uppercase"
        style={{ viewTransitionName: selectedPage }}
      >
        {selectedPage}
      </h1>
    </div>
  );
};
