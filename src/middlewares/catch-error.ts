import { errors } from "../glues/http-exception";

import { config } from "../config/config";

import {
  Daruk,
  defineMiddleware,
  injectable,
  MiddlewareClass,
  Next,
  DarukContext,
} from "daruk";

@defineMiddleware("catch-error")
class CatchError implements MiddlewareClass {
  public initMiddleware(daruk: Daruk) {
    return async (ctx: DarukContext, next: Next) => {
      try {
        await next();
      } catch (error) {
        // 开发环境
        const isHttpException = error instanceof errors.HttpException;
        //   const isDev = global.config.environment === "dev";
        const isDev = config.environment === "dev";
        // console.log('error1', error)
        if (isDev && !isHttpException) {
          throw error;
        }

        // 生产环境
        if (isHttpException) {
          ctx.body = {
            msg: error.msg,
            error_code: error.errorCode,
            request: `${ctx.method} ${ctx.path}`,
          };
          ctx.response.status = error.code;
        } else {
          ctx.body = {
            msg: "未知错误！",
            error_code: 9999,
            request: `${ctx.method} ${ctx.path}`,
          };
          ctx.response.status = 500;
        }
      }
    };
  }
}
