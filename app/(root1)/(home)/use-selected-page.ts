"use client";

import { useSelectedLayoutSegment } from "next/navigation";

export const useSelectedPage = () => useSelectedLayoutSegment() ?? "home";
