import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import Game from "./Game";
import Login, { SessionGuard } from "./Login";
import MainMenu from "./MainMenu";
import "./index.css";

const rootEl = document.getElementById("root");
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="/" element={<SessionGuard />}>
            <Route index element={<MainMenu />} />
            <Route path=":room" element={<Game />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </React.StrictMode>,
  );
}
