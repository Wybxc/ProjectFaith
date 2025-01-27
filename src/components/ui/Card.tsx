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
        `card flex flex-col overflow-hidden rounded-lg border border-white/20 bg-white/10
        shadow-lg shadow-black/10 backdrop-blur-lg`,
        variant === "fill" && "h-full w-full",
        className,
      )}
    >
      <div className="card-body overflow-hidden p-3">{children}</div>
    </div>
  );
}
