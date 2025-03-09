import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import InputForm from "./form.jsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Toaster />
    <InputForm />
  </StrictMode>
);
