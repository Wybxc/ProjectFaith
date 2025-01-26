import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

interface BackgroundProps extends PropsWithChildren {
  className?: string;
}

export function Background({ children, className }: BackgroundProps) {
  return (
    <div
      className={cn(
        "h-screen bg-base-200 bg-cover bg-center relative",
        "bg-[url('/bg.jpg')] flex",
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/70" />
      <div
        className={cn(
          "relative z-10 flex flex-col flex-1 items-stretch p-4",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
