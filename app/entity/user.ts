// const moment = require("moment");
// const bcrypt = require("bcryptjs");
// const { sequelize } = require("@core/db");
// const { DataTypes, Model } = require("sequelize");

// // 定义用户模型
// class User extends Model {}

// // 初始用户模型
// User.init(
//   {
//     id: {
//       type: DataTypes.INTEGER(10).UNSIGNED,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     username: {
//       type: DataTypes.STRING(50),
//       allowNull: false,
//       // 备注
//       comment: "用户昵称",
//     },
//     email: {
//       type: DataTypes.STRING(50),
//       allowNull: false,
//       unique: "user_email_unique",
//       comment: "登录邮箱",
//     },
//     password: {
//       type: DataTypes.STRING,
//       set(val) {
//         // 加密
//         const salt = bcrypt.genSaltSync(10);
//         // 生成加密密码
//         const psw = bcrypt.hashSync(val, salt);
//         this.setDataValue("password", psw);
//       },
//       allowNull: false,
//       comment: "登录密码",
//     },
//     status: {
//       type: DataTypes.TINYINT,
//       allowNull: true,
//       defaultValue: 1,
//       comment: "用户状态：0-禁用,1-正常",
//     },
//     created_at: {
//       type: DataTypes.DATE,
//       allowNull: false,
//       get() {
//         return moment(this.getDataValue("created_at")).format(
//           "YYYY-MM-DD HH:mm:ss"
//         );
//       },
//     },
//   },
//   {
//     sequelize,
//     modelName: "user",
//     tableName: "user",
//   }
// );

// module.exports = {
//   User,
// };

import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from "typeorm";
import { BaseEntity } from "./base";
import { Comment } from "./comment";
import { Reply } from "./reply";

@Entity()
export class User extends BaseEntity {
  @Column({
    type: "char",
    length: 50,
    comment: "用户昵称",
  })
  username: string;

  @Column({
    type: "char",
    length: 50,
    unique: true,
    comment: "登录邮箱",
  })
  email: string;

  @Column({
    type: "char",
    length: 255,
    comment: "登陆密码",
  })
  password: string;

  @Column({
    type: "tinyint",
    default: 1,
    comment: "用户状态：0-禁用,1-正常",
  })
  status: number;
  return: any;

  @OneToMany(() => Comment, (comment) => comment.user_info)
  comments: Comment[];

  @OneToMany(() => Reply, (reply) => reply.user_info)
  replys: Reply[];
}
