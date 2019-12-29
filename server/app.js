const Koa = require("koa");
const path = require("path");
const cors = require("koa2-cors");
const httpProxy = require("http-proxy-middleware");
const k2c = require("koa2-connect");
const bodyparser = require("koa-bodyparser");
const statickoa = require("koa-static");
console.log("正在启动服务……");
const app = new Koa();
const staticPath = "./static";
app.use(cors());
app.use(statickoa(path.join(__dirname, staticPath)));
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
app.listen(9612);
console.log("启动成功，监听端口：9612");
