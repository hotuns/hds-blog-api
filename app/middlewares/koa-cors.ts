const cors = require("@koa/cors");

import { join } from "path";
import { Daruk, defineMiddleware, injectable, MiddlewareClass } from "daruk";

@defineMiddleware("koa-cors")
class koaCors implements MiddlewareClass {
  public initMiddleware(daruk: Daruk) {
    daruk.app.use(cors());
  }
}
