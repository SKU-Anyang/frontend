// src/main.jsx
<<<<<<< HEAD
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./app.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
=======
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app.jsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
>>>>>>> f9d3f48cd1d5919d148d5fc0a19388617cbfff4a
);
