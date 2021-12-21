const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://staging.holodex.net/",
      changeOrigin: true,
      // pathRewrite: {
      //   "^/api/v2": "/v2",
      // },
    })
  );
};
