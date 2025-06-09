// vite.config.ts

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
    // KEEP THIS: This part fixed our original 'useToast' error.
    include: [
      '@chakra-ui/react',
      '@chakra-ui/icons',
      '@emotion/react',
      '@emotion/styled',
      'framer-motion',
    ],

    // ADD THIS: This tells the optimizer to NOT touch the polyfill
    // plugin, resolving the new "chunk file not found" error.
    exclude: [
      'vite-plugin-node-polyfills'
    ]
  },
});