import { route, string } from "react-router-typesafe-routes";

export const routes = route({
  children: {
    index: route({}),
    deckBuilder: route({
      path: "deck-builder/:deckName",
      params: { deckName: string() },
    }),
    game: route({
      path: "game/:room",
      params: { room: string() },
    }),
  },
});
