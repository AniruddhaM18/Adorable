export const BASE_TEMPLATE = {
  // -------------------------
  // package.json
  // -------------------------
  "package.json": `{
  "name": "react-sandbox",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite --host --port 5173",
    "build": "vite build",
    "preview": "vite preview --host --port 5173"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "vite": "^5.4.0"
  }
}
`,

  // -------------------------
  // vite.config.js
  // -------------------------
  "vite.config.js": `
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    host: true,
    port: 5173,
    strictPort: true,
    allowedHosts: true,     // DEV SERVER
  },

  preview: {
    host: true,
    port: 5173,
    strictPort: true,
    allowedHosts: "all",     // REQUIRED FOR e2b
  },
});
`,

  // -------------------------
  // index.html
  // -------------------------
  "index.html": `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React Sandbox</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`,

  // -------------------------
  // src/main.jsx
  // -------------------------
  "src/main.jsx": `
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`,

  // -------------------------
  // src/App.jsx
  // -------------------------
  "src/App.jsx": `
export default function App() {
  return (
    <div style={{ padding: 24 }}>
      <h1>🚀 React Sandbox Ready</h1>
      <p>Edit <code>src/App.jsx</code> and save.</p>
    </div>
  );
}
`,

  // -------------------------
  // src/index.css
  // -------------------------
  "src/index.css": `
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
}
`,
};
