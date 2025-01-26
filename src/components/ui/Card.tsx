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
        "border border-white/20 rounded-lg",
        "shadow-lg shadow-black/10",
        "flex flex-col overflow-hidden",
        variant === "fill" && "h-full w-full",
        className,
      )}
    >
      <div className="card-body p-3 overflow-hidden">{children}</div>
    </div>
  );
}
