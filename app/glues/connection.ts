const path = require("path");
import { Connection, createConnection, EntityTarget } from "typeorm";
import { fluentProvide } from "daruk";

import { config } from "../config/config";

const { dbName, host, port, user, password, charset } = config.database;

import { Admin } from "../entity/admin";
import { Article } from "../entity/article";
import { Category } from "../entity/category";
import { Comment } from "../entity/comment";
import { Reply } from "../entity/reply";
import { User } from "../entity/user";

@(fluentProvide("Db").inSingletonScope().done())
export default class Db {
  static connection: Connection;

  static async getConnection() {
    if (!this.connection) {
      this.connection = await createConnection({
        type: "mysql",
        port: port,
        host: host,
        username: user,
        password: password,
        database: dbName,
        timezone: "+08:00",
        entities: [Admin, Article, Category, Comment, Reply, User],
        synchronize: true,
        charset: charset,
        logging: process.env.NODE_ENV === "dev",
      });
    }

    return this.connection;
  }

  static async getRepository<entity>(target: EntityTarget<entity>) {
    let c = await this.getConnection();
    return c.getRepository(target);
  }
}
