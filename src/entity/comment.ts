import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Article } from "./article";
import { BaseEntity } from "./base";
import { Reply } from "./reply";
import { User } from "./user";

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

  //  所属文章
  @ManyToOne(() => Article, (article) => article.comments, {
    cascade: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "article_id" })
  article_info: Article;

  @ManyToOne(() => User, (user) => user.comments, {
    cascade: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "user_id" })
  user_info: User;

  @Column({
    type: "char",
    comment: "匿名评论时，填的联系邮箱",
    nullable: true,
    length: 100,
    default: 0,
  })
  email;

  @OneToMany(() => Reply, (reply) => reply.comment_info)
  replys: Reply[];
}
