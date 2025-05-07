import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/")({
  component: () => {
    window.location.href = "/scraping-tools/https-proxy";
    return null;
  },
});