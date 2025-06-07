import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { preloadCriticalResources } from "./utils/optimization";

// Предзагрузка критических ресурсов
preloadCriticalResources().catch(console.error);

// Отключаем масштабирование на мобильных устройствах
document.addEventListener('touchmove', (e) => {
  if (e.touches.length > 1) {
    e.preventDefault();
  }
}, { passive: false });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 