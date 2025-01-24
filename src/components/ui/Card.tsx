import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends PropsWithChildren {
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "card w-full bg-white/20 backdrop-blur-md shadow-2xl z-10",
        "border border-white/30 rounded-xl overflow-hidden",
        "transition-all duration-300 hover:shadow-white/5",
        className,
      )}
    >
      <div className="card-body !p-4 sm:p-5 flex flex-col h-full overflow-auto">
        <div className="flex flex-col h-full">{children}</div>
      </div>
    </div>
  );
}
