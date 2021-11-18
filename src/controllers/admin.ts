import {
  controller,
  DarukContext,
  get,
  inject,
  injectable,
  middleware,
  Next,
  post,
  prefix,
  type,
  validate,
} from "daruk";

import { AdminLoginValidator, RegisterValidator } from "../validators/admin";
import { auth } from "../glues/auth";
import { AdminSer } from "../services/admin";
import { ResTypes } from "../glues/resTypes";
import { generateToken } from "../util";
import { errors } from "../glues/http-exception";

@controller()
@prefix("/api/v1/admin")
class AdminController {
  @inject("AdminSer")
  public adminSer: AdminSer;

  //   管理员注册
  @post("/register")
  @validate(RegisterValidator as any)
  public async register(ctx: DarukContext, next: Next) {
    const { email, password1, nickname } = ctx.request.body;
    const [error, data] = await this.adminSer.create({
      email,
      password: password1,
      nickname,
    });

    if (!error) {
      // 返回结果
      ctx.body = ResTypes.json(data);
    } else {
      ctx.body = ResTypes.fail(error);
    }
  }

  //   管理员登陆
  @post("/login")
  @validate(AdminLoginValidator as any)
  public async login(ctx: DarukContext, next: Next) {
    const { email, password } = ctx.request.body;

    const [error, token] = await this.adminSer.login({ email, password });

    if (!error) {
      ctx.body = ResTypes.json({ token });
    } else {
      ctx.body = ResTypes.fail(error, error.msg);
    }
  }

  //   获取信息
  @auth({ role: RoleTypes.ADMIN })
  @get("/auth")
  public async auth(ctx: DarukContext, next: Next) {
    const id = ctx.auth.uid;
    const [error, data] = await this.adminSer.detail(Number(id));

    if (!error) {
      ctx.body = ResTypes.json(data);
    } else {
      ctx.body = ResTypes.fail(error, error.msg);
    }
  }
}
