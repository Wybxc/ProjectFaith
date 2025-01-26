import { root } from "@/routes";
import { useTypedParams } from "react-router-typesafe-routes";

export default function Game() {
  const { room } = useTypedParams(root.game);

  return (
    <>
      <title>对战 - {room}</title>
      {room}
    </>
  );
}
