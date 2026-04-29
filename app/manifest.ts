import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Rosarium Today",
    short_name: "Rosarium",
    description:
      "A quiet place to pray the Holy Rosary — word-by-word audio, three languages, no ads.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0906",
    theme_color: "#0a0906",
    orientation: "portrait-primary",
    categories: ["lifestyle"],
    icons: [
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
