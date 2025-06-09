import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import path from "path";
import { nodePolyfills } from "vite-plugin-node-polyfills";

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
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  optimizeDeps: {
    // FIX: Add this 'include' array.
    // This tells Vite to find this package and pre-process it from
    // CommonJS (require) to ESM (import) so the browser can understand it.
    include: ["@canvasjs/react-charts"],

    // Your existing esbuildOptions are fine to keep, they solve a different issue.
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
});