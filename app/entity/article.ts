import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { BaseEntity } from "./base";
import { Admin } from "./admin";
import { Category } from "./category";
import { Comment } from "./comment";

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

  @ManyToOne(() => Admin, (admin) => admin.articles)
  admin_info: Admin;

  @ManyToOne(() => Category, (category) => category.articles)
  category_info: Category;

  @ManyToOne(() => Comment, (comment) => comment.article_info)
  comments: Comment[];
}
