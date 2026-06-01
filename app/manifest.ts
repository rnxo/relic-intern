import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Lumi",
    short_name: "Lumi",
    description:
      "習慣を育てるたびに、ペットが育つ。あなたの努力をLumiが感じ取ります。",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#1a1b26",
    theme_color: "#1a1b26",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
