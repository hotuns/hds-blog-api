import { service, DarukContext, inject, provide } from "daruk";

import Db from "../../glues/connection";
import { errors } from "../../glues/http-exception";
import * as crypto from "crypto-js";
import { generateToken } from "../../util";
import { Repository, Like } from "typeorm";
import { Category } from "../../entity/category";

interface category_list_params {
  status?;
  name?;
  id?;
  page_size?;
  page?;
}

@service()
export class CategorySer {
  public ctx!: DarukContext;
  @inject("Db") public Db!: Db;

  /**创建 分类 */
  public async create(params: { name; sort_order?; parent_id? }) {
    const { name, sort_order = 1, parent_id = 0 } = params;

    const repository = await Db.getRepository(Category);

    const isExist = await repository.findOne({
      name,
      deleted_at: null,
    });

    if (Boolean(isExist)) {
      throw new errors.Existing("分类已存在");
    }

    const user = new Category();
    user.name = name;
    user.sort_order = sort_order;
    user.parent_id = parent_id;

    try {
      const res = await Db.connection.manager.save(user);

      const data = {
        code: 200,
        name: res.name,
        sort_order: res.sort_order,
        parent_id: res.parent_id,
        msg: "创建成功",
      };

      return [null, data];
    } catch (error) {
      return [error, null];
    }
  }

  /**查询 */
  public async detail(id: number) {
    try {
      const repository = await Db.getRepository(Category);
      const category = await repository.findOne({
        id: id,
        deleted_at: null,
      });

      if (!category) {
        throw new errors.NotFound("没有找到相关分类");
      }

      return [null, category];
    } catch (error) {
      return [error, null];
    }
  }

  // 删除 分类
  public async destroy(id: number) {
    const repository = await Db.getRepository(Category);

    const category = await repository.findOne({ id: id });

    if (!category) {
      throw new global.errs.NotFound("没有找到相关 分类");
    }

    try {
      // 软删除 分类
      let res = await repository.softRemove(category);

      return [null, res];
    } catch (err) {
      return [err, null];
    }
  }

  // 更新 分类
  public async update(
    id: number,
    v: { name: string; status: string; sort_order; parent_id }
  ) {
    const repository = await Db.getRepository(Category);

    // 查询 分类
    const category = await repository.findOne({ id: id });
    if (!category) {
      throw new global.errs.NotFound("没有找到相关 分类");
    }

    // 更新 分类
    category.name = v.name;
    category.sort_order = v.sort_order;
    category.parent_id = v.parent_id;
    category.status = Number(v.status);

    try {
      const res = await repository.save(category);
      return [null, res];
    } catch (err) {
      return [err, null];
    }
  }

  //  分类列表
  public async list(query: category_list_params) {
    const { status, name, id, page_size = 10, page = 1 } = query;

    const filter: any = {};
    if (id) {
      filter.id = id;
    }
    if (status) {
      filter.status = status;
    }
    if (name) {
      filter.username = {
        username: Like("%name%"),
      };
    }

    try {
      const repository = await Db.getRepository(Category);
      const category = await repository.findAndCount({
        where: filter,
        order: {
          created_at: "DESC",
        },
        take: page_size,
        skip: (page - 1) * page_size,
      });

      const data = {
        data: category[0],
        // 分页
        meta: {
          current_page: page,
          per_page: 10,
          count: category[1],
          total: category[1],
          total_pages: Math.ceil(category[1] / page_size),
        },
      };

      return [null, data];
    } catch (err) {
      console.log("err", err);
      return [err, null];
    }
  }
}
