import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";

@Entity()
export class BaseEntity {
  @CreateDateColumn()
  created_at;
  @UpdateDateColumn()
  updated_at;
  @DeleteDateColumn()
  deleted_at;

  @PrimaryGeneratedColumn()
  id: number;
}
