import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Scrollbar({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "scrollbar-thin scrollbar-track-transparent",
        "scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20",
        "active:scrollbar-thumb-white/25 scrollbar-thumb-rounded-full",
        className,
      )}
      {...props}
    />
  );
}

export function CardScrollbar({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "scrollbar-thin scrollbar-track-black/5",
        "scrollbar-thumb-white/[0.15] hover:scrollbar-thumb-white/20",
        "active:scrollbar-thumb-white/30",
        className,
      )}
      {...props}
    />
  );
}
