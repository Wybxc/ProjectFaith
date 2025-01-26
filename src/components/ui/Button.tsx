import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const baseButtonStyles = "shadow-lg transition-colors duration-200";

export function GameButton({ className, ...props }: ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "btn btn-primary w-full text-base",
        baseButtonStyles,
        "hover:brightness-110 shadow-primary/20 hover:shadow-primary/30",
        "h-12 min-h-0",
        "landscape:h-8 landscape:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export function IconButton({ className, ...props }: ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "btn btn-ghost text-white/80 hover:text-white",
        "landscape:btn-sm",
        className,
      )}
      {...props}
    />
  );
}
