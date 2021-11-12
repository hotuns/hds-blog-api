// const moment = require('moment');

// const { DataTypes, Model } = require('sequelize')
// const { sequelize } = require('@core/db')

// class Comment extends Model {

// }

// Comment.init({
//   id: {
//     type: DataTypes.INTEGER(10).UNSIGNED,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   content: {
//     type: DataTypes.TEXT,
//     allowNull: false,
//     comment: '评论内容'
//   },
//   status: {
//     type: DataTypes.TINYINT,
//     allowNull: true,
//     defaultValue: 0,
//     comment: '评论状态：0-审核中,1-审核通过,2-审核不通过'
//   },
//   article_id: {
//     type: DataTypes.INTEGER(10).UNSIGNED,
//     allowNull: false,
//     comment: '关联的评论文章id'
//   },
//   user_id: {
//     type: DataTypes.INTEGER(10).UNSIGNED,
//     allowNull: true,
//     defaultValue: 0,
//     comment: '评论用户id,0-代表匿名回复'
//   },
//   email: {
//     type: DataTypes.STRING,
//     allowNull: true,
//     defaultValue: 0,
//     comment: '匿名评论时，填的联系邮箱'
//   },

//   created_at: {
//     type: DataTypes.DATE,
//     allowNull: false,
//     get() {
//       return moment(this.getDataValue('created_at')).format('YYYY-MM-DD HH:mm:ss');
//     }
//   }
// }, {
//   sequelize,
//   modelName: 'comment',
//   tableName: 'comment'
// })

// module.exports = {
//   Comment
// }

import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BaseEntity } from "./base";

@Entity()
export class Comment extends BaseEntity {
  @Column({ type: "text", comment: "评论内容", nullable: false })
  content;

  @Column({
    type: "tinyint",
    nullable: true,
    default: 0,
    comment: "评论状态：0-审核中,1-审核通过,2-审核不通过",
  })
  status;

  @Column({
    type: "integer",
    comment: "关联的评论文章id",
    nullable: false,
  })
  article_id;

  @Column({
    type: "integer",
    comment: "评论用户id,0-代表匿名回复",
    nullable: true,
    default: 0,
  })
  user_id;

  @Column({
    type: "char",
    comment: "匿名评论时，填的联系邮箱",
    nullable: true,
    default: 0,
  })
  email;
}
