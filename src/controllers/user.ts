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
  del,
  put,
} from "daruk";

import {
  UserLoginValidator,
  RegisterValidator,
  UserListValidator,
  UserUpdateValidator,
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
  @validate(RegisterValidator as any)
  @post("/register")
  public async register(ctx: DarukContext, next: Next) {
    const { email, password1, username } = ctx.request.body;
    const [error, data] = await this.UserSer.create({
      email,
      password: password1,
      username,
    });

    if (!error) {
      // 返回结果
      ctx.body = ResTypes.json(data);
    } else {
      ctx.body = ResTypes.fail(error);
    }
  }

  //   登陆
  @validate(UserLoginValidator as any)
  @post("/login")
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
  @get("/auth")
  @auth({ role: RoleTypes.USER })
  public async auth(ctx: DarukContext, next: Next) {
    const id = ctx.auth.uid;

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
  @get("list")
  @validate(UserListValidator as any)
  @auth({ role: RoleTypes.ADMIN })
  public async list(ctx: DarukContext, next: Next) {
    let [error, data] = await this.UserSer.list(ctx.query);

    console.log(error, data);
    if (!error) {
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
    const { id } = ctx.params;

    let [error, data] = await this.UserSer.detail(Number(id));

    if (!error) {
      ctx.body = ResTypes.json(data);
    } else {
      ctx.body = ResTypes.fail(error);
    }
  }

  // 删除用户
  // 需要管理员及以上才能操作
  @auth({ role: RoleTypes.ADMIN })
  @validate({
    id: {
      type: "number",
      required: true,
    },
  })
  @del("/detail/:id")
  public async deleteUser(ctx: DarukContext, next: Next) {
    const { id } = ctx.params;

    let [error, data] = await this.UserSer.destroy(Number(id));
    if (!error) {
      ctx.body = ResTypes.json("删除用户成功");
    } else {
      ctx.body = ResTypes.fail(error);
    }
  }

  // 更新用户信息
  // 需要管理员及以上才能操作
  @auth({ role: RoleTypes.ADMIN })
  @validate(UserUpdateValidator as any)
  @put("/update/:id")
  public async updateUser(ctx: DarukContext, next: Next) {
    const { id } = ctx.params;
    const { email, username, status } = ctx.request.body;
    let [error, data] = await this.UserSer.update(Number(id), {
      email,
      username,
      status,
    });
    if (!error) {
      ctx.body = ResTypes.json(data);
    } else {
      ctx.body = ResTypes.fail(error);
    }
  }
}
