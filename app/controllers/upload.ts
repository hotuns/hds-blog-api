import { controller, DarukContext, Next, post, prefix } from "daruk";

const qiniu = require("qiniu");

import { config } from "../config/config";
import { auth } from "../glues/auth";
import { ResTypes } from "../glues/resTypes";

@controller()
@prefix("/api/v1")
class UserController {
  //   用户注册
  @auth({ role: RoleTypes.ADMIN })
  @post("/upload/token")
  public async register(ctx: DarukContext, next: Next) {
    const options = {
      scope: config.qiniu.scope,
      expires: 7200,
    };

    const mac = new qiniu.auth.digest.Mac(config.qiniu.ak, config.qiniu.sk);

    const putPolicy = new qiniu.rs.PutPolicy(options);
    ctx.response.status = 200;
    const data = {
      token: putPolicy.uploadToken(mac),
    };
    ctx.body = ResTypes.json(data);
  }
}
