import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import jwtInterceptor from "./utils/jwtInterceptor.js";
import { BrowserRouter } from "react-router-dom";
// import { AuthProvider } from "./context/auth.jsx";
// import { AuthProvider } from "./context/auth.jsx";

// jwtInterceptor();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* <AuthProvider> */}
    <BrowserRouter>
      {/* <AuthProvider> */}
        <App />
      {/* </AuthProvider> */}
    </BrowserRouter>
    {/* </AuthProvider> */}
  </React.StrictMode>
);
