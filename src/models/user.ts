import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm"
import { Asset } from "./asset"

@Entity()
export class User {

    // Phone number with Country code
    @PrimaryColumn()
    id: string

    @Column({
        length: 50,
    })
    username: string

    @OneToMany(() => Asset, (asset: Asset) => asset.id)
    tracked_assets: Asset[]
}