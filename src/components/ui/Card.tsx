import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends PropsWithChildren {
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "card w-full bg-white/20 backdrop-blur-md shadow-2xl z-10 border border-white/30",
        "h-full overflow-hidden",
        className,
      )}
    >
      <div className="card-body !p-3 sm:p-4 flex flex-col h-full overflow-auto">
        <div className="flex flex-col h-full">{children}</div>
      </div>
    </div>
  );
}
