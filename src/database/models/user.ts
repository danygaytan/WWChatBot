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

    @OneToMany(() => Asset, (asset: Asset) => asset.prospect)
    assets: Asset[]
}


/*
User could have many assets to track (0-N).
Each user PK is their whatsapp provided id.
The username is auto generated. Is used for replying back to them.
*/