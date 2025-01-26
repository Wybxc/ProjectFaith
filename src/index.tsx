import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import Background from "./components/layout/Background";
import ScreenRotationGuard from "./components/ui/ScreenRotationGuard";
import "./index.css";
import DeckEditor from "./pages/DeckEditor";
import Decks from "./pages/Decks";
import Game from "./pages/Game";
import MainMenu from "./pages/MainMenu";
import NotFound from "./pages/NotFound";
import { root as route } from "./routes";
import Full from "./components/layout/Full";

const rootEl = document.getElementById("root");
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route element={<ScreenRotationGuard />}>
            <Route element={<Background />}>
              <Route path={route.$path()} element={<MainMenu />} />
              <Route element={<Full />}>
                <Route path={route.deck.$path()} element={<Decks />} />
                <Route
                  path={route.deck.edit.$path()}
                  element={<DeckEditor />}
                />
              </Route>
              <Route path={route.game.$path()} element={<Game />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </React.StrictMode>,
  );
}
