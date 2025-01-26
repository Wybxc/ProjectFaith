import { cn } from "@/lib/utils";
import { Outlet } from "react-router";

export default function Full() {
  return (
    <div
      className={cn(
        "card bg-white/10 backdrop-blur-lg",
        "border border-white/20 rounded-lg",
        "shadow-lg shadow-black/10",
        "flex flex-col overflow-hidden",
        "h-full w-full",
      )}
    >
      <div className="card-body p-3 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}
