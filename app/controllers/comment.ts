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
import { CommentSer } from "../services/comment";
import { ResTypes } from "../glues/resTypes";
import { generateToken } from "../util";
import {
  createValidator,
  detailValidator,
  listValidators,
} from "../validators/comment";

@controller()
@prefix("/api/v1")
class UserController {
  @inject("CommentSer")
  public CommentSer: CommentSer;

  //  创建评论
  @validate(createValidator as any)
  @post("/comment")
  public async register(ctx: DarukContext, next: Next) {
    const [error, data] = await this.CommentSer.create(ctx.request.body);

    if (!error) {
      // 返回结果
      ctx.body = ResTypes.json(data);
    } else {
      ctx.body = ResTypes.fail(error);
    }
  }

  // 获取文章信息
  @validate(detailValidator as any)
  @get("/comment/:id")
  public async detail(ctx: DarukContext, next: Next) {
    const { id } = ctx.params;
    let [error, data] = await this.CommentSer.detail(
      Number(id),
      ctx.query as any
    );

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
  @put("/comment/:id")
  public async updateUser(ctx: DarukContext, next: Next) {
    const { id } = ctx.params;
    let [error, data] = await this.CommentSer.update(
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
  @del("/comment/:id")
  public async deleteUser(ctx: DarukContext, next: Next) {
    const { id } = ctx.params;
    let [error, data] = await this.CommentSer.destroy(Number(id));
    if (!error) {
      ctx.body = ResTypes.success("删除用户成功");
    } else {
      ctx.body = ResTypes.fail(error);
    }
  }

  // 获取列表
  @get("/comment")
  @validate(listValidators as any)
  public async list(ctx: DarukContext, next: Next) {
    let [error, data] = await this.CommentSer.list(ctx.query as any);

    if (!error) {
      ctx.body = ResTypes.json(data);
    } else {
      ctx.body = ResTypes.fail(error);
    }
  }

  // 获取列表
  @get("/comment/target/list")
  @validate(listValidators as any)
  public async targetlist(ctx: DarukContext, next: Next) {
    let [error, data] = await this.CommentSer.targetComment(ctx.query as any);

    if (!error) {
      ctx.body = ResTypes.json(data);
    } else {
      ctx.body = ResTypes.fail(error);
    }
  }
}
