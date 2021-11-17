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
var xss = require("xss");

interface comment_params {
  article_id?: number;
  user_id?: number;
  status?: number;
  email?: string;
  content?: string;
}

interface comment_list_params {
  id: any;
  article_id: any;
  is_replay: any;
  is_article: any;
  is_user: any;
  content?: any;
  status?: any;
  page_size?: any;
  page?: any;
}

@service()
export class CommentSer {
  public ctx!: DarukContext;
  @inject("Db") public Db!: Db;

  /**创建 */
  public async create(params: comment_params) {
    const repository = await Db.getRepository(Comment);

    const comment = new Comment();
    comment.content = xss(params.content);
    comment.email = params.email || 0;

    // 处理文章
    if (params.article_id) {
      const article = await (
        await Db.getRepository(Article)
      ).findOne({
        id: params.article_id,
      });

      comment.article_info = article;
    }

    // 处理用户
    if (params.user_id) {
      const user = await (
        await Db.getRepository(User)
      ).findOne({
        id: params.user_id,
      });

      comment.user_info = user;
    }

    try {
      const res = await Db.connection.manager.save(comment);

      return [null, res];
    } catch (error) {
      return [error, null];
    }
  }

  /**查询 */
  public async detail(
    id: number,
    query: {
      is_replay: number;
      is_article: number;
      is_user: number;
    }
  ) {
    try {
      const { is_replay = 0, is_article = 0, is_user = 0 } = query;

      const repository = await Db.getRepository(Comment);

      let comment = await repository.findOne({
        relations: ["replys", "user_info", "article_info"],
        where: {
          id: id,
          deleted_at: null,
        },
      });

      if (!comment) {
        throw new errors.AuthFailed("没有找到相关文章！");
      }

      return [null, comment];
    } catch (error) {
      return [error, null];
    }
  }

  // 更新
  public async update(id: number, v: comment_params) {
    const repository = await Db.getRepository(Comment);

    // 查询
    const comment = await repository.findOne({ id: id });
    if (!comment) {
      throw new global.errs.NotFound("没有找到相关评论信息");
    }

    if (v.content) comment.content = xss(v.content);
    if (v.status) comment.status = v.status;

    // 处理文章
    if (v.article_id) {
      const article = await (
        await Db.getRepository(Article)
      ).findOne({
        id: v.article_id,
      });

      comment.article_info = article;
    }

    // 处理用户
    if (v.user_id) {
      const user = await (
        await Db.getRepository(User)
      ).findOne({
        id: v.user_id,
      });

      comment.user_info = user;
    }

    try {
      const res = await repository.save(comment);
      return [null, res];
    } catch (err) {
      return [err, null];
    }
  }

  // 删除
  public async destroy(id: number) {
    const repository = await Db.getRepository(Comment);

    const comment = await repository.findOne({ id: id, deleted_at: null });

    if (!comment) {
      throw new global.errs.NotFound("没有找到相关评论");
    }

    try {
      // 软删除
      let res = await repository.softRemove(comment);

      return [null, res];
    } catch (err) {
      return [err, null];
    }
  }

  // 列表
  public async list(query: comment_list_params) {
    const { content, id, status, article_id, page = 1, page_size = 10 } = query;

    try {
      const repository = await Db.getRepository(Comment);
      let qb = await repository
        .createQueryBuilder("comment")
        .leftJoinAndSelect("comment.replys", "replys")
        .leftJoinAndSelect("comment.user_info", "user_info")
        .leftJoinAndSelect("comment.article_info", "article_info");

      if (id) {
        qb.where("comment.id = :id", { id });
      }

      if (status) {
        qb.where("comment.status = :status", { status });
      }

      if (content) {
        qb.where("comment.content LIKE :content", { content: `"%content%"` });
      }

      const comments = await qb
        .orderBy("created_at", "DESC")
        .take(page_size)
        .skip((page - 1) * page_size)
        .getManyAndCount();

      const data = {
        data: comments[0],
        // 分页
        meta: {
          current_page: page,
          per_page: 10,
          count: comments[1],
          total: comments[1],
          total_pages: Math.ceil(comments[1] / page_size),
        },
      };

      return [null, data];
    } catch (err) {
      console.log("err", err);
      return [err, null];
    }
  }

  public async targetComment(params: any) {
    const {
      content,
      id,
      status,
      article_id,
      page = 1,
      page_size = 10,
    } = params;

    try {
      const repository = await Db.getRepository(Comment);
      let qb = await repository
        .createQueryBuilder("comment")
        .leftJoinAndSelect("comment.replys", "replys")
        .leftJoinAndSelect("comment.user_info", "user_info")
        .leftJoinAndSelect("comment.article_info", "article_info");

      if (id) {
        qb.where("comment.id = :id", { id });
      }

      if (status) {
        qb.where("comment.status = :status", { status });
      }

      if (content) {
        qb.where("comment.content LIKE :content", { content: `"%content%"` });
      }

      const comments = await qb
        .orderBy("comment.created_at", "DESC")
        .take(page_size)
        .skip((page - 1) * page_size)
        .getManyAndCount();

      const data = {
        data: comments[0],
        // 分页
        meta: {
          current_page: page,
          per_page: 10,
          count: comments[1],
          total: comments[1],
          total_pages: Math.ceil(comments[1] / page_size),
        },
      };

      return [null, data];
    } catch (err) {
      console.log("err", err);
      return [err, null];
    }
  }
}
