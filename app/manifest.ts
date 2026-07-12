import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nós Dois",
    short_name: "Nós Dois",
    description: "Nosso cantinho especial",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF7FF",
    theme_color: "#9B7EC8",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
