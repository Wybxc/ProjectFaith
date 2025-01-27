import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function GameButton({ className, ...props }: ComponentProps<"button">) {
  return (
    <button
      className={cn(
        `btn btn-primary h-8 min-h-0 w-full text-sm shadow-lg shadow-primary/20
        transition-colors duration-200 hover:shadow-primary/30 hover:brightness-110`,
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
        "btn btn-ghost btn-sm text-white/80 hover:text-white",
        className,
      )}
      {...props}
    />
  );
}
