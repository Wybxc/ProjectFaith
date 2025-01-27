import { Outlet } from "react-router";

export default function Full() {
  return (
    <div
      className="card flex h-full w-full flex-col overflow-hidden rounded-lg border
        border-white/20 bg-white/10 shadow-lg shadow-black/10 backdrop-blur-lg"
    >
      <div className="card-body overflow-hidden p-3">
        <Outlet />
      </div>
    </div>
  );
}
