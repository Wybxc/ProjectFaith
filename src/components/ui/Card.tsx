import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends PropsWithChildren {
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "card w-full bg-white/10 backdrop-blur-lg",
        "border border-white/20 rounded-lg md:rounded-xl overflow-hidden",
        "transition-all duration-300",
        "shadow-lg hover:shadow-xl",
        "shadow-black/10 hover:shadow-black/20",
        "hover:bg-white/[0.12]",
        className,
      )}
    >
      <div className="card-body !p-3 sm:!p-4 md:!p-5">
        <div className="h-full">{children}</div>
      </div>
    </div>
  );
}
