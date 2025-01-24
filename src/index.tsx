import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import ScreenRotationGuard from "./components/ui/ScreenRotationGuard";
import "./index.css";
import DeckBuilder from "./pages/DeckBuilder";
import Game from "./pages/Game";
import MainMenu from "./pages/MainMenu";
import NotFound from "./pages/NotFound";
import { routes } from "./routes";

const rootEl = document.getElementById("root");
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ScreenRotationGuard />}>
            <Route index element={<MainMenu />} />
            <Route
              path={routes.deckBuilder.$path()}
              element={<DeckBuilder />}
            />
            <Route path={routes.game.$path()} element={<Game />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </React.StrictMode>,
  );
}
