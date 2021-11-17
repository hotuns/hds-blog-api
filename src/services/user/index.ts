import { service, DarukContext, inject, provide } from "daruk";
import { User } from "../../entity/user";
import Db from "../../glues/connection";
import { errors } from "../../glues/http-exception";
import * as crypto from "crypto-js";
import { generateToken } from "../../util";
import { Repository, Like } from "typeorm";

interface user_list_params {
  id?: string;
  email?: string;
  status?: StatusTypes;
  username?: string;
  page?: number;
  page_size?: number;
}

@service()
export class UserSer {
  public ctx!: DarukContext;
  @inject("Db") public Db!: Db;

  /**创建用户 */
  public async create(params: { email; password; username }) {
    const { email, password, username } = params;

    const repository = await (await Db.getConnection()).getRepository(User);

    const isExist = await repository.findOne({
      email: email,
      deleted_at: null,
    });

    if (Boolean(isExist)) {
      throw new errors.Existing("用户已存在");
    }

    const user = new User();
    user.username = username;
    user.password = crypto.MD5(password).toString();
    user.email = email;

    try {
      const res = await Db.connection.manager.save(user);

      const data = {
        code: 200,
        email: res.email,
        username: res.username,
      };

      return [null, data];
    } catch (error) {
      return [error, null];
    }
  }

  /**管理员登陆 */
  public async login(params: { email; password }) {
    const { email, password } = params;

    try {
      const user = await (
        await Db.getRepository(User)
      ).findOne({ email: email });

      if (!user) {
        throw new errors.AuthFailed("账号不存在");
      }

      const pw = crypto.MD5(password).toString();

      if (pw !== user.password) {
        throw new errors.AuthFailed("账号不存在或密码错误");
      }

      return [null, generateToken(user.id, RoleTypes.USER)];
    } catch (error) {
      return [error, null];
    }
  }

  /**查询 */
  public async detail(
    id: number,
    status: StatusTypes = StatusTypes.USER_STATUS_NORMAL
  ) {
    try {
      const repository = await Db.getRepository(User);
      const user = await repository.findOne({
        where: {
          id: id,
          status: status,
        },
        select: [
          "email",
          "id",
          "status",
          "username",
          "updated_at",
          "created_at",
          "deleted_at",
        ],
      });

      if (!user) {
        throw new errors.AuthFailed("账号不存在或者已被禁用，请联系管理员！");
      }

      return [null, user];
    } catch (error) {
      return [error, null];
    }
  }

  // 删除用户
  public async destroy(id: number) {
    const repository = await Db.getRepository(User);

    const user = await repository.findOne({ id: id });

    if (!user) {
      throw new global.errs.NotFound("没有找到相关用户");
    }

    try {
      // 软删除用户
      let res = await repository.softRemove(user);

      return [null, res];
    } catch (err) {
      return [err, null];
    }
  }

  // 更新用户
  public async update(
    id: number,
    v: { email: string; username: string; status: StatusTypes }
  ) {
    const repository = await Db.getRepository(User);

    // 查询用户
    const user = await repository.findOne({ id: id });
    if (!user) {
      throw new global.errs.NotFound("没有找到相关用户");
    }

    // 更新用户
    user.email = v.email;
    user.username = v.username;
    user.status = Number(v.status);

    try {
      const res = await repository.save(user);
      return [null, res];
    } catch (err) {
      return [err, null];
    }
  }

  // 用户列表
  public async list(query: user_list_params) {
    const { id, email, status, username, page = 1, page_size = 10 } = query;

    const filter: any = {};
    if (email) {
      filter.email = email;
    }
    if (id) {
      filter.id = id;
    }
    if (status) {
      filter.status = status;
    }
    if (username) {
      filter.username = {
        username: Like("%username%"),
      };
    }

    try {
      const repository = await Db.getRepository(User);
      const user = await repository.findAndCount({
        where: filter,
        order: {
          created_at: "DESC",
        },
        take: page_size,
        skip: (page - 1) * page_size,
      });
      console.log("filter", user);
      const data = {
        data: user[0],
        // 分页
        meta: {
          current_page: page,
          per_page: 10,
          count: user[1],
          total: user[1],
          total_pages: Math.ceil(user[1] / page_size),
        },
      };

      return [null, data];
    } catch (err) {
      console.log("err", err);
      return [err, null];
    }
  }
}
