// vite.config.ts

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import path from "path";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { viteCommonjs } from '@originjs/vite-plugin-commonjs';

export default defineConfig({
  plugins: [
    react(),
    TanStackRouterVite({
      routesDirectory: "./src/routes",
      generatedRouteTree: "./src/routeTree.gen.ts",
    }),
    // This plugin handles CJS dependencies like CanvasJS
    viteCommonjs(),
    // This plugin provides polyfills for Node.js built-ins
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
      },
      // Important: We let our alias handle the 'stream' polyfill.
      protocolImports: true,
    }),
  ],
  resolve: {
    alias: {
      // General alias for cleaner imports
      "@": path.resolve(__dirname, "src"),

      // FIX: This alias explicitly maps 'stream' to the browser-friendly version.
      // This will solve the "Could not read from file: .../stream-browserify/web" error.
      "stream": "stream-browserify",
    },
  },
  optimizeDeps: {
    // This is still good practice for CanvasJS and other CJS deps
    include: ["@canvasjs/react-charts"],
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
});