import { route } from "react-router-typesafe-routes";

export const root = route({
  path: "",
  children: {
    deck: route({
      path: "deck",
      children: {
        edit: route({
          path: "edit/:deckName",
        }),
      },
    }),
    game: route({
      path: "game/:room",
    }),
  },
});
