import { DarukServer } from "daruk";

(async () => {
  let app = DarukServer({
    rootPath: __dirname,
    middlewareOrder: ["koa-cors", "catch-error"],
    validateOptions: {
      error: true,
    },
    // errorOptions: {
    //   //   html: (err: Error, ctx: DarukContext) => {
    //   //     ctx.body = `${err.message}`;
    //   //   },
    // },
  });

  let port = process.env.NODE_ENV !== "production" ? 3000 : 3001;

  await app.loadFile("./middlewares");
  await app.loadFile("./glues");
  await app.loadFile("./controllers");
  await app.loadFile("./services");
  await app.binding();

  app.listen(port);
  app.logger.info(`app listen port ${port}`);
})();
