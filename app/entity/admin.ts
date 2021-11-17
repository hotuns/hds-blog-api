import { Entity, Column, OneToMany } from "typeorm";
import { Article } from "./article";
import { BaseEntity } from "./base";

@Entity()
export class Admin extends BaseEntity {
  @Column({
    type: "char",
    length: 50,
    unique: true,
    comment: "登录邮箱",
    nullable: false,
  })
  email: string;

  @Column({
    type: "char",
    length: 50,
    nullable: false,
    comment: "管理员昵称",
  })
  nickname: string;

  @Column({
    type: "char",
    length: 255,
    comment: "登陆密码",
    nullable: false,
  })
  password: string;

  @OneToMany(() => Article, (article) => article.admin_info)
  articles: Article[];
}
