import { createRouter } from "@swan-io/chicane";

export const Router = createRouter({
  MainMenu: "/",
  Decks: "/deck",
  DeckEditor: "/deck/edit/:deckName",
  Game: "/game/:room",
});
