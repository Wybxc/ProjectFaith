import { routes } from "@/routes";
import { useTypedParams } from "react-router-typesafe-routes";

export default function Game() {
  const { room } = useTypedParams(routes.game);

  return <>{room}</>;
}
