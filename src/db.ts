import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./models/user"
import { Asset } from "./models/asset"

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "prod",
    entities: [User, Asset],
    synchronize: true,
    logging: true,
});

