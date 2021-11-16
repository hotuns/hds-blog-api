// const moment = require('moment');

// const { DataTypes, Model } = require('sequelize')
// const { sequelize } = require('@core/db')
// // const { Comment } = require('@models/comment')

// class Reply extends Model {

// }

// Reply.init({
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//     comment: '回复id'
//   },
//   content: {
//     type: DataTypes.TEXT,
//     allowNull: false,
//     comment: '回复内容'
//   },
//   status: {
//     type: DataTypes.TINYINT,
//     allowNull: true,
//     defaultValue: 0,
//     comment: '回复状态：0-审核中,1-审核通过,2-审核不通过'
//   },
//   comment_id: {
//     type: DataTypes.INTEGER(10).UNSIGNED,
//     allowNull: false,
//     comment: '关联的评论id'
//   },
//   article_id: {
//     type: DataTypes.INTEGER(10).UNSIGNED,
//     allowNull: false,
//     comment: '关联的文章id'
//   },
//   user_id: {
//     type: DataTypes.INTEGER(10).UNSIGNED,
//     allowNull: true,
//     defaultValue: 0,
//     comment: '回复用户id,0-代表匿名回复'
//   },
//   email: {
//     type: DataTypes.STRING,
//     allowNull: true,
//     defaultValue: 0,
//     comment: '匿名评论时，填的联系邮箱'
//   },
//   reply_user_id: {
//     type: DataTypes.INTEGER(10).UNSIGNED,
//     allowNull: true,
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { BaseEntity } from "./base";
import { Comment } from "./comment";
import { User } from "./user";

@Entity()
export class Reply extends BaseEntity {
  @Column({ type: "text", comment: "文章内容", nullable: false })
  content;

  @Column({
    type: "tinyint",
    default: 1,
    nullable: true,
    comment: "回复状态：0-审核中,1-审核通过,2-审核不通过",
  })
  status;

  @Column({ type: "integer", comment: "关联的评论id", nullable: false })
  comment_id;

  @ManyToOne(() => Comment, (comment) => comment.replys)
  comment_info: Comment;

  @Column({ type: "integer", comment: "关联的文章id", nullable: false })
  article_id;

  @Column({
    type: "tinyint",
    default: 0,
    nullable: true,
    comment: "回复用户id,0-代表匿名回复",
  })
  user_id;

  @ManyToOne(() => User, (user) => user.replys)
  user_info: User;

  @Column({
    type: "char",
    nullable: true,
    default: 0,
    comment: "匿名评论时，填的联系邮箱",
  })
  email;

  @Column({
    type: "tinyint",
    nullable: true,
    default: 0,
    comment: "匿名评论时，填的联系邮箱",
  })
  reply_user_id;
}
