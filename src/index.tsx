import React from "react";
import ReactDOM from "react-dom/client";
import { match } from "ts-pattern";
import ScreenRotationGuard from "./components/ui/ScreenRotationGuard";
import "./index.css";
import DeckEditor from "./pages/DeckEditor";
import Decks from "./pages/Decks";
import Game from "./pages/Game";
import MainMenu from "./pages/MainMenu";
import NotFound from "./pages/NotFound";
import { Router } from "./routes";

const App = () => {
  const route = Router.useRoute(["MainMenu", "Decks", "DeckEditor", "Game"]);

  return (
    <ScreenRotationGuard>
      {match(route)
        .with({ name: "MainMenu" }, () => <MainMenu />)
        .with({ name: "Decks" }, () => <Decks />)
        .with({ name: "DeckEditor" }, ({ params }) => (
          <DeckEditor deckName={params.deckName} />
        ))
        .with({ name: "Game" }, ({ params }) => <Game room={params.room} />)
        .otherwise(() => (
          <NotFound />
        ))}
    </ScreenRotationGuard>
  );
};

const rootEl = document.getElementById("root");
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
