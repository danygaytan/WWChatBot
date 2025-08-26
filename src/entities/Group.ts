import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { User } from "./User";

@Entity()
export class Group {
  @PrimaryGeneratedColumn() id!: number;
  @Column({ nullable: false }) name!: string;
  @Column({ nullable: true }) topic?: string;
  @ManyToMany(() => User, (user) => user.groups)
  users!: User[];
}
