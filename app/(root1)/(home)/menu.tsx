"use client";

import Link from "next/link";
import { useSelectedPage } from "./use-selected-page";
import { cn } from "@/lib/utils";

interface LinkProps extends React.ComponentProps<typeof Link> {
  label: string;
}

const links: LinkProps[] = [
  { href: "/", label: "home" },
  { href: "/work", label: "work" },
  { href: "/article", label: "article" },
  { href: "/app", label: "app" },
];

export function Menu() {
  const selectedPage = useSelectedPage();

  return (
    <div className="fixed bottom-8 right-8 text-center">
      {links.map(
        (props, index) =>
          selectedPage !== props.label && <HeroLink key={index} {...props} />,
      )}
    </div>
  );
}

const HeroLink = ({ label, className, ...rest }: LinkProps) => {
  return (
    <Link
      style={{ viewTransitionName: label }}
      {...rest}
      className={cn(
        "block relative overflow-hidden group py-1 uppercase font-bold tracking-tight w-[80px]",
        className,
      )}
    >
      <span className="relative z-10 transition-colors duration-200 group-hover:text-white dark:group-hover:text-black">
        {label}
      </span>
      <span className="absolute inset-0 w-0 bg-black dark:bg-white transition-all duration-200 ease-out group-hover:w-full" />
    </Link>
  );
};
