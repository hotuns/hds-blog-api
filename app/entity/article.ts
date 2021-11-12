// const moment = require("moment");
// const { sequelize } = require("@core/db");
// const { Model, DataTypes } = require("sequelize");
// const { Category } = require("./category");
// // 定义文章模型
// class Article extends Model {}

// // 初始文章模型
// Article.init(
//   {
//     id: {
//       type: DataTypes.INTEGER(10).UNSIGNED,
//       primaryKey: true,
//       autoIncrement: true,
//       comment: "文章id",
//     },
//     title: {
//       type: DataTypes.STRING(128),
//       allowNull: false,
//       comment: "文章标题",
//     },
//     description: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       comment: "文章简介",
//     },
//     img_url: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       comment: "文章封面图URL",
//     },
//     content: {
//       type: DataTypes.TEXT,
//       allowNull: false,
//       comment: "文章内容",
//     },
//     seo_keyword: {
//       type: DataTypes.STRING(128),
//       allowNull: false,
//       comment: "文章SEO关键字",
//     },
//     status: {
//       type: DataTypes.TINYINT,
//       allowNull: true,
//       defaultValue: 1,
//       comment: "文章展示状态：0-隐藏,1-正常",
//     },
//     sort_order: {
//       type: DataTypes.INTEGER(10).UNSIGNED,
//       allowNull: true,
//       defaultValue: 1,
//       comment: "排序编号,默认1,数值越大排越前,相等则自然排序",
//     },
//     browse: {
//       type: DataTypes.INTEGER(10).UNSIGNED,
//       allowNull: true,
//       defaultValue: 0,
//       comment: "文章浏览次数",
//     },
//     favorite_num: {
//       type: DataTypes.INTEGER(10).UNSIGNED,
//       allowNull: true,
//       defaultValue: 0,
//       comment: "文章点赞次数",
//     },
//     admin_id: {
//       type: DataTypes.INTEGER(10).UNSIGNED,
//       allowNull: false,
//       comment: "发布文章的管理员id",
//     },
//     category_id: {
//       type: DataTypes.INTEGER(10).UNSIGNED,
//       allowNull: false,
//       comment: "分类id",
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
//     modelName: "article",
//     tableName: "article",
//   }
// );

// module.exports = {
//   Article,
// };

import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BaseEntity } from "./base";

@Entity()
export class Article extends BaseEntity {
  @Column({
    length: 128,
    nullable: false,

    comment: "文章标题",
  })
  title: string;

  @Column({ comment: "文章简介", nullable: false })
  description: string;

  @Column({ comment: "文章封面图URL", nullable: false })
  img_url: string;

  @Column({ type: "text", comment: "文章内容", nullable: false })
  content;

  @Column({ length: 128, nullable: false, comment: "文章SEO关键字" })
  seo_keyword: string;

  @Column({
    type: "tinyint",
    default: 1,
    nullable: true,
    comment: "文章展示状态：0-隐藏,1-正常",
  })
  status;

  @Column({
    type: "integer",
    default: 1,
    nullable: true,

    comment: "排序编号,默认1,数值越大排越前,相等则自然排序",
  })
  sort_order;

  @Column({
    type: "integer",
    nullable: true,

    comment: "文章浏览次数",
    default: 0,
  })
  browse;

  @Column({
    type: "integer",
    nullable: true,
    comment: "文章点赞次数",
    default: 0,
  })
  favorite_num;

  @Column({
    type: "integer",
    nullable: false,
    comment: "发布文章的管理员id",
    default: 0,
  })
  admin_id;

  @Column({ type: "integer", nullable: false, comment: "分类id", default: 0 })
  category_id;
}
