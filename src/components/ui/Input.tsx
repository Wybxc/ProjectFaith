import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const baseInputStyles = cn(
  "bg-white/20 backdrop-blur-sm text-white",
  "transition-colors duration-200 focus:bg-white/30",
  "h-12 min-h-0",
  "landscape:h-8 landscape:text-sm",
);

export function Input({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={cn("input input-bordered", baseInputStyles, className)}
      {...props}
    />
  );
}

export function InputSmall({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "input input-bordered input-sm bg-white/20",
        "landscape:h-6",
        className,
      )}
      {...props}
    />
  );
}

export function Select({ className, ...props }: ComponentProps<"select">) {
  return (
    <select
      className={cn(
        "select select-bordered [&>option]:text-base-content",
        baseInputStyles,
        className,
      )}
      {...props}
    />
  );
}
