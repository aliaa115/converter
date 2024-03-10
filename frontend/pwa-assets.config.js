import {
  defineConfig,
  minimal as preset,
} from "@vite-pwa/assets-generator/config";
const manifestForPlugIn = {
  registerType: "autoUpdate",
  includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
  manifest: {
    name: "Vite PWA Project",
    short_name: "Vite PWA Project",
    theme_color: "#ffffff",
    icons: [
      {
        src: "pwa-64x64.png",
        sizes: "64x64",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "pwa-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "pwa-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "pwa-144x144.png",
        sizes: "144x144",
        type: "image/png",
        purpose: "any",
      },
    ],
    background_color: "#f0e7db",
    display: "standalone",
    scope: "/",
    start_url: "/",
    orientation: "portrait",
  },
};

export default defineConfig({
  //   preset,
  ...manifestForPlugIn,
});
