import type { PropsWithChildren } from "react";

export function Card({ children }: PropsWithChildren) {
  return (
    <div className="card w-96 bg-white/20 backdrop-blur-md shadow-2xl z-10 border border-white/30">
      <div className="card-body">{children}</div>
    </div>
  );
}
