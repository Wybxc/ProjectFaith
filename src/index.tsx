import React from "react";
import ReactDOM from "react-dom/client";
import App from "./MainMenu";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import Game from "./Game";

const rootEl = document.getElementById("root");
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route index element={<App />} />
          <Route path=":room" element={<Game />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>,
  );
}
