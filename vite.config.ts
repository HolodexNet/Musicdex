import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { execSync } from "child_process";
import { replaceCodePlugin as replace } from "vite-plugin-replace";

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
    },
    "/statics": {
      target: "http://localhost:2434/",
      changeOrigin: true,
    },
    "^/api/v2": {
      target: "http://localhost:2434/",
      changeOrigin: true,
      rewrite: (path: string) => path.replace(/^\/api\/v2/, "/v2"),
    },
    "^/statics": {
      target: "http://localhost:2434/",
      changeOrigin: true,
      rewrite: (path: string) => path.replace(/^\/statics/, "/statics"),
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
    proxy: process.env.API_TARGET
      ? proxy[process.env.API_TARGET]
      : proxy.staging,
  },
  plugins: [
    react(),
    replace({
      replacements: [
        {
          from: "GIT_COMMIT_HASH",
          to: JSON.stringify(gitCommitHash),
        },
        {
          from: "GIT_COMMIT_TIMESTAMP",
          to: gitCommitTimestamp,
        },
      ],
    }),
  ],
});
