import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Title({ className, ...props }: ComponentProps<"span">) {
  return <span className={cn("font-bold text-white", className)} {...props} />;
}

export function Subtitle({ className, ...props }: ComponentProps<"span">) {
  return <span className={cn("text-white/90", className)} {...props} />;
}
