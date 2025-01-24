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
        "bg-[url('@static/bg.jpg')] p-2 sm:p-4",
        className,
      )}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 h-full flex flex-col">{children}</div>
    </div>
  );
}
