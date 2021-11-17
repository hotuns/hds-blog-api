import { x64 } from "crypto-js";
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
import { ResTypes } from "../glues/resTypes";
import { CategorySer } from "../services/category";
import {
  categoryListValidator,
  createValidator,
  updateValidator,
} from "../validators/category";

@controller()
@prefix("/api/v1")
class CategoryController {
  @inject("CategorySer")
  public CategorySer: CategorySer;

  // 获取所有分类
  @get("/category")
  @validate(categoryListValidator as any)
  public async list(ctx: DarukContext, next: Next) {
    let [error, data] = await this.CategorySer.list(ctx.query);

    if (!error) {
      ctx.body = ResTypes.json(data);
    } else {
      ctx.body = ResTypes.fail(error);
    }
  }

  // 获取分类详情
  @validate({
    id: {
      type: "number",
      required: true,
    },
  })
  @get("/category/:id")
  public async detail(ctx: DarukContext, next: Next) {
    const { id } = ctx.params;

    let [error, data] = await this.CategorySer.detail(Number(id));

    if (!error) {
      ctx.body = ResTypes.json(data);
    } else {
      ctx.body = ResTypes.fail(error);
    }
  }

  //   创建分类
  @post("/category")
  @auth({ role: RoleTypes.ADMIN })
  @validate(createValidator as any)
  public async createCategory(ctx: DarukContext, next: Next) {
    const { name, sort_order, parent_id } = ctx.request.body;
    let [error, data] = await this.CategorySer.create({
      name,
      sort_order,
      parent_id,
    });

    if (!error) {
      ctx.body = ResTypes.json(data);
    } else {
      ctx.body = ResTypes.fail(error);
    }
  }

  // 删除分类
  @validate({
    id: {
      type: "number",
      required: true,
    },
  })
  @auth({ role: RoleTypes.ADMIN })
  @del("/category/:id")
  public async deleteCategory(ctx: DarukContext, next: Next) {
    const { id } = ctx.params;

    let [error, data] = await this.CategorySer.destroy(Number(id));
    if (!error) {
      ctx.body = ResTypes.json("删除分类成功");
    } else {
      ctx.body = ResTypes.fail(error);
    }
  }

  // 更新信息
  @auth({ role: RoleTypes.ADMIN })
  @validate(updateValidator as any)
  @put("/category/:id")
  public async updateCategory(ctx: DarukContext, next: Next) {
    const { id } = ctx.params;
    const { name, status, sort_order, parent_id } = ctx.request.body;
    let [error, data] = await this.CategorySer.update(Number(id), {
      name,
      status,
      sort_order,
      parent_id,
    });
    if (!error) {
      ctx.body = ResTypes.json(data);
    } else {
      ctx.body = ResTypes.fail(error);
    }
  }
}
