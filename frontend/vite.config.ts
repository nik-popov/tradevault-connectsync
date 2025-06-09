// vite.config.ts

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import path from "path";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { viteCommonjs } from "@originjs/vite-plugin-commonjs"; // <-- Import the plugin

export default defineConfig({
  plugins: [
    react(),
    TanStackRouterVite({
      routesDirectory: "./src/routes",
      generatedRouteTree: "./src/routeTree.gen.ts",
    }),
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
      },
    }),

    // FIX: Configure the plugin to include the problematic dependency
    viteCommonjs({
      filter(id) {
        // The `id` is the full path to the module. We need to check
        // if it's the CanvasJS module we want to transform.
        if (id.includes('node_modules/@canvasjs/react-charts')) {
          return true;
        }
      }
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  // The optimizeDeps block is no longer needed with this plugin approach
});