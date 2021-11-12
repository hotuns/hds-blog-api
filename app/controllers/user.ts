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

import {
  UserLoginValidator,
  RegisterValidator,
  UserListValidator,
} from "../validators/user";
import { auth } from "../glues/auth";
import { UserSer } from "../services/user";
import { ResTypes } from "../glues/resTypes";
import { generateToken } from "../util";

@controller()
@prefix("/api/v1/user")
class UserController {
  @inject("UserSer")
  public UserSer: UserSer;

  //   用户注册
  @post("/register")
  @validate(RegisterValidator as any)
  public async register(ctx: DarukContext, next: Next) {
    const { email, password1, nickname } = ctx.request.body;
    const [error, data] = await this.UserSer.create({
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

  //   登陆
  @post("/login")
  @validate(UserLoginValidator as any)
  public async login(ctx: DarukContext, next: Next) {
    const { email, password } = ctx.request.body;

    const [error, token] = await this.UserSer.login({ email, password });

    console.log(error, token);
    if (!error) {
      ctx.body = ResTypes.json({ token });
    } else {
      ctx.body = ResTypes.fail(error, error.msg);
    }
  }

  //   获取信息
  @auth({ role: RoleTypes.USER })
  @get("/auth")
  public async auth(ctx: DarukContext, next: Next) {
    const { id } = ctx.request.query;

    const [error, data] = await this.UserSer.detail(
      Number(id),
      StatusTypes.USER_STATUS_NORMAL
    );

    if (!error) {
      ctx.body = ResTypes.json(data);
    } else {
      ctx.body = ResTypes.fail(error, error.msg);
    }
  }

  // 获取用户列表
  // 需要管理员及以上才能操作
  @auth({ role: RoleTypes.ADMIN })
  @validate(UserListValidator as any)
  @get("list")
  public async list(ctx: DarukContext, next: Next) {
    let [error, data] = await this.UserSer.list(ctx.query);
    if (!error) {
      ctx.response.status = 200;
      ctx.body = ResTypes.json(data);
    } else {
      ctx.body = ResTypes.fail(error);
    }
  }

  // 获取用户信息
  // 需要管理员及以上才能操作
  @auth({ role: RoleTypes.ADMIN })
  @validate({
    id: {
      type: "number",
      required: true,
    },
  })
  @get("/detail/:id")
  public async detail(ctx: DarukContext, next: Next) {
    let [error, data] = await this.UserSer.list(ctx.query);
    if (!error) {
      ctx.response.status = 200;
      ctx.body = ResTypes.json(data);
    } else {
      ctx.body = ResTypes.fail(error);
    }
  }
}
