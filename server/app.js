const Koa = require("../node_modules/koa");
var cors = require("../node_modules/koa2-cors");
const app = new Koa();
app.use(cors());
const httpProxy = require("../node_modules/http-proxy-middleware");
const k2c = require("../node_modules/koa2-connect");
const bodyparser = require("../node_modules/koa-bodyparser");
app.use(async (ctx, next) => {
  if (ctx.url.startsWith("/api")) {
    ctx.respond = false;
    await k2c(
      httpProxy({
        target: "https://app.hbooker.com",
        changeOrigin: true,
        secure: false,
        pathRewrite: { "^/api": "" }
      })
    )(ctx, next);
  }
  await next();
});
app.use(bodyparser({ enableTypes: ["json", "form", "text"] }));
app.listen(9527);
