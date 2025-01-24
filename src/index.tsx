import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import Deck from "./pages/DeckBuilder";
import Game from "./pages/Game";
import MainMenu from "./pages/MainMenu";
import "./index.css";
import ScreenRotationGuard from "./components/ui/ScreenRotationGuard";

const rootEl = document.getElementById("root");
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ScreenRotationGuard />}>
            <Route index element={<MainMenu />} />
            <Route path="deck-builder" element={<Deck />} />
            <Route path=":room" element={<Game />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </React.StrictMode>,
  );
}
