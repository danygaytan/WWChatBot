import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm"
import { Asset } from "./asset"

@Entity()
export class User {

    // Whatsapp provided id [user](id->user)
    @PrimaryColumn()
    id: string

    @Column()
    server: string

    @Column()
    serialized_id: string

    @Column({
        length: 50,
    })
    username: string

    @OneToMany(() => Asset, (asset: Asset) => asset.id)
    assets: Asset[]
}


/*
User could have many assets to track (0-N).
Each user PK is their whatsapp provided id.
The username is to reference the user when replying back to them.
*/