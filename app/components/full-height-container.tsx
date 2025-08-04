import { ReactNode } from "react";

interface FullHeightContainerProps {
  children: ReactNode;
  offset?: number;
  className?: string;
}

export default function FullHeightContainer({
  children,
  offset = 0,
  className = "",
}: FullHeightContainerProps) {
  const offsetStyle = offset > 0 ? { height: `calc(100dvh - ${offset}px)` } : { height: '100dvh' };
  
  return (
    <div 
      style={offsetStyle}
      className={className}
    >
      {children}
    </div>
  );
}
