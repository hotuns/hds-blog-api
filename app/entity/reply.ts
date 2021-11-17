import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
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

  @ManyToOne(() => Comment, (comment) => comment.replys, {
    cascade: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "comment_id" })
  comment_info: Comment;

  @ManyToOne(() => User, (user) => user.replys, {
    cascade: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "user_id" })
  user_info: User;

  @Column({
    type: "char",
    nullable: true,
    default: 0,
    length: 100,
    comment: "匿名评论时，填的联系邮箱",
  })
  email;

  @Column({
    type: "tinyint",
    nullable: true,
    comment: "回复对象id,0-代表匿名回复",
  })
  reply_user_id;
}
