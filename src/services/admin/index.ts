import { service, DarukContext, inject, provide } from "daruk";
import { Admin } from "../../entity/admin";
import Db from "../../glues/connection";
import { errors } from "../../glues/http-exception";
import * as crypto from "crypto-js";
import { generateToken } from "../../util";

@service()
export class AdminSer {
  public ctx!: DarukContext;
  @inject("Db") public Db!: Db;

  /**创建管理员 */
  public async create(params) {
    const { email, password, nickname } = params;

    const connection = await Db.getConnection();
    const isExist = await connection
      .getRepository(Admin)
      .findOne({ email: email, deleted_at: null });

    if (Boolean(isExist)) {
      throw new errors.Existing("管理员已存在");
    }

    console.log("isExist", isExist);

    const admin = new Admin();
    admin.nickname = nickname;
    admin.password = crypto.MD5(password).toString();
    admin.email = email;

    try {
      const res = await connection.manager.save(admin);

      const data = {
        email: res.email,
        nickname: res.nickname,
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
      const connection = await Db.getConnection();

      const admin = await connection
        .getRepository(Admin)
        .findOne({ email: email });

      if (!admin) {
        throw new errors.AuthFailed("账号不存在");
      }

      const pw = crypto.MD5(password).toString();

      if (pw !== admin.password) {
        throw new errors.AuthFailed("账号不存在或密码错误");
      }

      return [null, generateToken(admin.id, RoleTypes.ADMIN)];
    } catch (error) {
      return [error, null];
    }
  }

  /**查询管理员 */
  public async detail(id: number) {
    try {
      const connection = await Db.getConnection();

      const admin = await connection.getRepository(Admin).findOne({
        where: {
          id: id,
        },
        // select: [
        //   "email",
        //   "id",
        //   "nickname",
        //   "password",
        //   "updated_at",
        //   "created_at",
        //   "deleted_at",
        // ],
      });

      console.log(id, admin);

      if (!admin) {
        throw new errors.AuthFailed("账号不存在或者密码不正确");
      }

      return [null, admin];
    } catch (error) {
      return [error, null];
    }
  }
}
