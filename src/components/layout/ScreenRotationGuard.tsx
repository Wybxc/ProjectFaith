import { HiDevicePhoneMobile } from "react-icons/hi2";
import { Outlet } from "react-router";
import { useOrientation } from "react-use";
import { cn } from "@/lib/utils";

export default function ScreenRotationGuard() {
  const orientation = useOrientation();
  const isPortrait = orientation.type.includes("portrait");

  return (
    <>
      <div
        className={cn(
          `fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black
          transition-all duration-300 ease-in-out`,
          isPortrait
            ? "pointer-events-auto visible opacity-100"
            : "pointer-events-none invisible opacity-0",
        )}
      >
        <div className="text-center text-white">
          <HiDevicePhoneMobile className="mx-auto mb-4 h-12 w-12 rotate-90" />
          <p className="m-0 text-xl">请将设备横向放置以获得最佳体验</p>
        </div>
      </div>
      <Outlet />
    </>
  );
}
