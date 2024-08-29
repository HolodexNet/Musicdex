import { execSync } from "child_process";
import { defineConfig, loadEnv } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginNodePolyfill } from "@rsbuild/plugin-node-polyfill";

const { publicVars } = loadEnv({ prefixes: ["REACT_APP_"] });

const gitCommitHash = execSync("git describe --always").toString();
const gitCommitTimestamp = execSync(
  `git show -s --format=%cD ${gitCommitHash}`,
).toString();

export default defineConfig({
  plugins: [pluginReact(), pluginNodePolyfill()],
  html: {
    template: "./public/index.html",
  },
  output: {
    distPath: {
      root: "build",
    },
  },
  source: {
    define: {
      GIT_COMMIT_HASH: JSON.stringify(gitCommitHash),
      GIT_COMMIT_TIMESTAMP: JSON.stringify(gitCommitTimestamp),
      ...publicVars,
    },
  },
  server: {
    proxy:
      process.env.API_TARGET === "local"
        ? {
            "/api/v2": {
              target: "http://localhost:2434",
              pathRewrite: { "^/api/v2": "/v2" },
              changeOrigin: true,
            },
            "/statics": {
              target: "http://localhost:2434",
              changeOrigin: true,
            },
          }
        : [
            {
              context: ["/statics", "/api"],
              target: "https://staging.holodex.net/",
              changeOrigin: true,
            },
          ],
  },
});
