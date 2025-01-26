import type { ComponentProps, ElementType } from "react";
import { cn } from "@/lib/utils";

const baseGlassStyles = "bg-white/20 rounded-lg backdrop-blur-sm";

export function GlassPanel({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(baseGlassStyles, className)} {...props} />;
}

type CardHoverProps<T extends ElementType = "div"> = {
  as?: T;
} & ComponentProps<T>;

export function CardHover<T extends ElementType = "div">({
  as,
  className,
  ...props
}: CardHoverProps<T>) {
  const Component = as || "div";
  return (
    <Component
      className={cn(
        baseGlassStyles,
        "cursor-pointer transition-colors hover:bg-white/30",
        className,
      )}
      {...props}
    />
  );
}
