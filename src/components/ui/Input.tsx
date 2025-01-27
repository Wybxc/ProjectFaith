import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={cn(
        `input input-bordered h-8 min-h-0 bg-white/20 text-sm text-white backdrop-blur-sm
        transition-colors duration-200 focus:bg-white/30`,
        className,
      )}
      {...props}
    />
  );
}

export function InputSmall({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "input input-sm input-bordered bg-white/20",
        "h-6",
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
        `select select-bordered h-8 min-h-0 bg-white/20 text-sm text-white
        backdrop-blur-sm transition-colors duration-200 focus:bg-white/30
        [&>option]:text-base-content`,
        className,
      )}
      {...props}
    />
  );
}
