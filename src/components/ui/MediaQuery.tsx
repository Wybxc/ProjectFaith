import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function LandscapeStyles({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn("@container/landscape landscape:h-[100svh]", className)}
      {...props}
    />
  );
}
