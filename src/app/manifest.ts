import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CollegeFit AI",
    short_name: "CollegeFit",
    description: "AI-powered engineering college recommendations and admission planning.",
    start_url: "/",
    display: "standalone",
    background_color: "#070711",
    theme_color: "#6366f1",
    icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png" }],
  };
}
