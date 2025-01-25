import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends PropsWithChildren {
  className?: string;
  variant?: "fill" | "fit";
}

export function Card({ children, className, variant = "fit" }: CardProps) {
  return (
    <div
      className={cn(
        "card bg-white/10 backdrop-blur-lg",
        "border border-white/20 rounded-lg md:rounded-xl",
        "transition-all duration-300",
        "shadow-lg hover:shadow-xl",
        "shadow-black/10 hover:shadow-black/20",
        "hover:bg-white/[0.12]",
        "flex flex-col overflow-hidden",
        variant === "fill" && "h-full",
        className,
      )}
    >
      <div className="card-body !p-3 sm:!p-4 md:!p-5 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
