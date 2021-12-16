const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:2434",
      changeOrigin: true,
      pathRewrite: {
        "^/api/v2": "/v2",
      },
    })
  );
};
