import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends PropsWithChildren {
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "card w-full max-w-md bg-white/20 backdrop-blur-md shadow-2xl z-10 border border-white/30",
        className,
      )}
    >
      <div className="card-body">{children}</div>
    </div>
  );
}
