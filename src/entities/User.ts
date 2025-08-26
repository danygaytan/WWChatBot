import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { Group } from "./Group";

@Entity()
export class User {
  @PrimaryGeneratedColumn() id!: number;
  @Column({ unique: true }) phone_number!: string;
  @Column({ nullable: true }) user_name?: string;
  @ManyToMany(() => Group, (group) => group.users, { cascade: true });
  @JoinTable({
    name: "members",
    joinColumn: { name: "user_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "group_id", referencedColumnName: "id"},
  })
  groups!: Group[];
}


