import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne, JoinColumn, Double } from "typeorm"
import { User } from "./user"

// Asset is the entity name for any product related link that's being tracked

@Entity()
export class Asset {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({
        nullable: false
    })
    url_string: string

    @Column({
        nullable: true
    })
    name: string

    @Column({
        nullable: true
    })
    price: string

    @Column({
        nullable: true
    })
    previous_price: string

    @Column({
        nullable: true
    })
    store: string

    @ManyToOne(() => User, (user) => user.assets)
    @JoinColumn({ name: "user_id" })
    prospect: User
}

/*
Assets are referenced by the IDs assigned to each. 
Even though we have the same product tracked by different user, each asset will have their own ID.

The URL string is used for the scraper.

All the rest of items, besides prospect, are for display.
*/