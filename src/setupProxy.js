const { createProxyMiddleware } = require("http-proxy-middleware");
const { env } = require("process");

const targets = {
  staging: () =>
    createProxyMiddleware({
      target: "https://staging.holodex.net/",
      changeOrigin: true,
    }),
  local: () =>
    createProxyMiddleware({
      target: "http://localhost:2434/",
      changeOrigin: true,
      pathRewrite: {
        "^/api/v2": "/v2",
      },
    }),
};
module.exports = function (app) {
  let getMiddleware = targets.staging;

  if (env.API_TARGET && targets[env.API_TARGET]) {
    getMiddleware = targets[env.API_TARGET];
    console.info("Proxying API to ", env.API_TARGET);
  }

  app.use("/api", getMiddleware());
};
