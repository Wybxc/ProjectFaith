import type { PropsWithChildren } from "react";
import { HiDevicePhoneMobile } from "react-icons/hi2";
import { useOrientation } from "react-use";

export default function ScreenRotationGuard({ children }: PropsWithChildren) {
  const orientation = useOrientation();
  const isPortrait = orientation.type.includes("portrait");

  return (
    <>
      <div
        className={`
          fixed top-0 left-0 w-full h-full bg-black
          flex justify-center items-center z-50
          transition-all duration-300 ease-in-out
          ${isPortrait ? "opacity-100 visible pointer-events-auto" : "opacity-0 invisible pointer-events-none"}
        `}
      >
        <div className="text-center text-white">
          <HiDevicePhoneMobile className="w-12 h-12 rotate-90 mb-4 mx-auto" />
          <p className="text-xl m-0">请将设备横向放置以获得最佳体验</p>
        </div>
      </div>
      {children}
    </>
  );
}
