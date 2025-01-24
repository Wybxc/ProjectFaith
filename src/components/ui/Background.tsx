import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

interface BackgroundProps extends PropsWithChildren {
  className?: string;
}

export function Background({ children, className }: BackgroundProps) {
  return (
    <div
      className={cn(
        "min-h-screen bg-base-200 bg-cover bg-center relative",
        "bg-[url('@static/bg.jpg')] p-3 sm:p-4 md:p-6",
        className,
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/70" />
      <div className="relative z-10 h-full flex flex-col gap-4">{children}</div>
    </div>
  );
}
