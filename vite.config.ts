import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { execSync } from "child_process";
import { VitePWA } from "vite-plugin-pwa";

const proxy = {
  staging: {
    "/api": {
      target: "https://staging.holodex.net/",
      changeOrigin: true,
    },
    "/statics": {
      target: "https://staging.holodex.net/",
      changeOrigin: true,
    },
  },
  local: {
    "/api": {
      target: "http://localhost:2434/",
      changeOrigin: true,
      rewrite: (path: string) => path.replace(/^\/api/, ""),
    },
    "/statics": {
      target: "http://localhost:2434/",
      changeOrigin: true,
    },
  },
};

const gitCommitHash = execSync("git describe --always").toString();
const gitCommitTimestamp = execSync(
  `git show -s --format=%ct ${gitCommitHash}`,
).toString();

console.log(
  "proxy",
  process.env.API_TARGET ? proxy[process.env.API_TARGET] : proxy.staging,
);

export default defineConfig({
  build: {
    outDir: "build",
  },
  server: {
    port: 3000,
    proxy: process.env.API_TARGET
      ? proxy[process.env.API_TARGET]
      : proxy.staging,
  },
  define: {
    GIT_COMMIT_HASH: JSON.stringify(gitCommitHash),
    GIT_COMMIT_TIMESTAMP: gitCommitTimestamp,
  },
  plugins: [
    react(),
    VitePWA({
      workbox: {
        navigateFallbackDenylist: [
          /^\/_/,
          /^\/api/,
          /^\/assets/,
          /^\/img/,
          /^\/sitemap-.*/,
          /^\/statics.*/,
          /^.*\.js(\.map)?/,
          /^.*\.css/,
          /^.*\.webmanifest/,
        ],
        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,jpeg,woff,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/i\.ytimg\.com\/.*\.(png|jpg|jpeg)$/i,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "ytimgs",
              expiration: {
                maxEntries: 160,
              },
            },
          },
          {
            urlPattern: /^https:\/\/.*mzstatic\.com\/.*\.(png|jpg|jpeg)$/,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "mzstatics",
              expiration: {
                maxEntries: 160,
              },
            },
          },
        ],
      },
      registerType: "prompt",
      includeAssets: ["favicon.ico", "apple-touch-icon.png"],
      manifest: {
        name: "Musicdex",
        short_name: "Musicdex",
        description: "VTuber Music Player",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        start_url: ".",
        icons: [
          {
            src: "img/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
});
