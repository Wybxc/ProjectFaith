import { Outlet } from "react-router";

export default function Background() {
  return (
    <div className="relative flex h-screen bg-base-200 bg-[url('/bg.jpg')] bg-cover bg-center">
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/70" />
      <div className="relative z-10 flex flex-1 flex-col items-stretch p-4">
        <Outlet />
      </div>
    </div>
  );
}
