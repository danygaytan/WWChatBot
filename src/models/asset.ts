import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne } from "typeorm"
import { User } from "./user"

// Asset is the entity name for any product related link that's being tracked

@Entity()
export class Asset {
    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    url_string: string

    @Column()
    name: string

    @Column("double")
    price: number

    @Column()
    store: string

    @ManyToOne(() => User, (user) => user.id)
    prospect: User
}