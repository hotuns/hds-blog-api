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

import { auth } from "../glues/auth";
import { ReplySer } from "../services/reply";
import { ResTypes } from "../glues/resTypes";
import { generateToken } from "../util";
import {
  createValidator,
  detailValidator,
  listValidators,
} from "../validators/reply";

@controller()
@prefix("/api/v1")
class UserController {
  @inject("ReplySer")
  public ReplySer: ReplySer;

  //  创建回复
  @validate(createValidator as any)
  @post("/reply")
  public async register(ctx: DarukContext, next: Next) {
    const [error, data] = await this.ReplySer.create(ctx.request.body);

    if (!error) {
      // 返回结果
      ctx.body = ResTypes.json(data);
    } else {
      ctx.body = ResTypes.fail(error);
    }
  }

  // 获取信息
  @validate(detailValidator as any)
  @get("/reply/:id")
  public async detail(ctx: DarukContext, next: Next) {
    const { id } = ctx.params;
    let [error, data] = await this.ReplySer.detail(Number(id));

    if (!error) {
      ctx.body = ResTypes.json(data);
    } else {
      ctx.body = ResTypes.fail(error);
    }
  }

  // 更新信息
  // 需要管理员及以上才能操作
  @auth({ role: RoleTypes.ADMIN })
  @validate(createValidator as any)
  @put("/reply/:id")
  public async updateUser(ctx: DarukContext, next: Next) {
    const { id } = ctx.params;
    let [error, data] = await this.ReplySer.update(
      Number(id),
      ctx.request.body
    );
    if (!error) {
      ctx.body = ResTypes.success("更新文章成功");
    } else {
      ctx.body = ResTypes.fail(error);
    }
  }

  // 删除文章
  // 需要管理员及以上才能操作
  @auth({ role: RoleTypes.ADMIN })
  @validate({
    id: {
      type: "number",
      required: true,
    },
  })
  @del("/reply/:id")
  public async deleteUser(ctx: DarukContext, next: Next) {
    const { id } = ctx.params;
    let [error, data] = await this.ReplySer.destroy(Number(id));
    if (!error) {
      ctx.body = ResTypes.success("删除用户成功");
    } else {
      ctx.body = ResTypes.fail(error);
    }
  }

  // 获取列表
  @get("/reply")
  @validate(listValidators as any)
  public async list(ctx: DarukContext, next: Next) {
    let [error, data] = await this.ReplySer.list(ctx.query as any);

    if (!error) {
      ctx.body = ResTypes.json(data);
    } else {
      ctx.body = ResTypes.fail(error);
    }
  }
}
