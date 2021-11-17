import { service, DarukContext, inject, provide } from "daruk";
import { Article } from "../../entity/article";
import Db from "../../glues/connection";
import { errors } from "../../glues/http-exception";
import * as crypto from "crypto-js";
import { generateToken, isArray, unique } from "../../util";
import { Repository, In, FindManyOptions, Like } from "typeorm";
import { Category } from "../../entity/category";
import { Admin } from "../../entity/admin";
import { Comment } from "../../entity/comment";
import { User } from "../../entity/user";
import { Reply } from "../../entity/reply";
var xss = require("xss");

interface reply_params {
  reply_id;
  user_id?;
  email?;
  status?;
  content;
  comment_id;
  reply_user_id;
}

interface reply_list_params {
  id;
  article_id;
  is_replay;
  is_article;
  is_user;
  content?;
  status?;
  page_size?;
  page?;
}

@service()
export class ReplySer {
  public ctx!: DarukContext;
  @inject("Db") public Db!: Db;

  /**创建 */
  public async create(params: reply_params) {
    const repository = await Db.getRepository(Reply);

    const reply = new Reply();
    reply.content = xss(params.content);
    reply.email = params.email || 0;
    reply.reply_user_id = params.reply_user_id;

    if (params.user_id) {
      const user = await (
        await Db.getRepository(User)
      ).findOne({
        id: params.user_id,
      });
      reply.user_info = user;
    }

    if (params.comment_id) {
      const comment = await (
        await Db.getRepository(Comment)
      ).findOne({
        id: params.comment_id,
      });
      reply.comment_info = comment;
    }

    try {
      const res = await Db.connection.manager.save(reply);

      return [null, res];
    } catch (error) {
      return [error, null];
    }
  }

  /**查询 */
  public async detail(id: number) {
    try {
      const repository = await Db.getRepository(Reply);

      let reply = await repository.findOne({
        relations: ["user_info", "comment_info"],
        where: {
          id: id,
          deleted_at: null,
        },
      });

      if (!reply) {
        throw new errors.AuthFailed("没有找到相关回复信息");
      }

      return [null, reply];
    } catch (error) {
      return [error, null];
    }
  }

  // 更新
  public async update(id: number, v: reply_params) {
    const repository = await Db.getRepository(Reply);

    // 查询
    const reply = await repository.findOne({ id: id });
    if (!reply) {
      throw new global.errs.NotFound("没有找到相关评论信息");
    }

    if (v.content) reply.content = xss(v.content);
    if (v.status) reply.status = v.status;

    if (v.user_id) {
      const user = await (
        await Db.getRepository(User)
      ).findOne({
        id: v.user_id,
      });
      reply.user_info = user;
    }

    if (v.comment_id) {
      const comment = await (
        await Db.getRepository(Comment)
      ).findOne({
        id: v.comment_id,
      });
      reply.comment_info = comment;
    }

    try {
      const res = await repository.save(reply);
      return [null, res];
    } catch (err) {
      return [err, null];
    }
  }
  v;

  // 删除
  public async destroy(id: number) {
    const repository = await Db.getRepository(Reply);

    const reply = await repository.findOne({ id: id, deleted_at: null });

    if (!reply) {
      throw new global.errs.NotFound("没有找到相关回复");
    }

    try {
      // 软删除
      let res = await repository.softRemove(reply);

      return [null, res];
    } catch (err) {
      return [err, null];
    }
  }

  // 列表
  public async list(query: reply_list_params) {
    const {
      page = 1,
      is_article = 0,
      content,
      id,
      status,
      article_id,
      is_user = 0,
    } = query;

    const filter: any = {
      deleted_at: null,
    };
    if (id) {
      filter.id = id;
    }
    if (article_id) {
      filter.article_id = article_id;
    }
    if (status) {
      filter.status = status;
    }
    if (content) {
      filter.content = Like("%content%");
    }
    const page_size = 10;
    try {
      const repository = await Db.getRepository(Reply);
      const reply = await repository.findAndCount({
        relations: ["user_info", "comment_info"],
        where: filter,
        order: {
          created_at: "DESC",
        },
        take: page_size,
        skip: (page - 1) * page_size,
      });

      const data = {
        data: reply[0],
        // 分页
        meta: {
          current_page: page,
          per_page: 10,
          count: reply[1],
          total: reply[1],
          total_pages: Math.ceil(reply[1] / page_size),
        },
      };

      return [null, data];
    } catch (err) {
      console.log("err", err);
      return [err, null];
    }
  }
}
