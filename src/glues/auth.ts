import { DarukContext, Next } from "daruk";
import { errors } from "./http-exception";
const basicAuth = require("basic-auth");

// const jwt = require("jsonwebtoken");
import { verify, JwtPayload } from "jsonwebtoken";
import { config } from "../config/config";

type PermissionConfig = {
  role: RoleTypes;
};

export function auth(opt?: PermissionConfig) {
  return (
    target: Object,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) => {
    const method = descriptor.value;

    descriptor.value = async function (ctx: DarukContext, next: Next) {
      // token 检测
      // token 开发者 传递令牌
      // token body header
      // HTTP 规定 身份验证机制 HttpBasicAuth

      const tokenToken = basicAuth(ctx.req);

      let errMsg = "无效的token";
      // 不带token
      if (!tokenToken || !tokenToken.name) {
        errMsg = "需要携带token值";
        throw new errors.Forbidden(errMsg);
      }

      try {
        var decode = verify(
          tokenToken.name,
          config.security.secretKey
        ) as JwtPayload;
      } catch (error) {
        // token 不合法 过期
        if (error.name === "TokenExpiredError") {
          errMsg = "token已过期";
        }

        throw new errors.Forbidden(errMsg);
      }

      if (decode.scope < opt["role"]) {
        errMsg = "权限不足";
        throw new errors.Forbidden(errMsg);
      }

      ctx.auth = {
        uid: decode.uid,
        scope: decode.scope,
      };

      console.log("ctx.auth", ctx.auth);

      const result = method.call(this, ...arguments);

      return result;
    };
  };
}
