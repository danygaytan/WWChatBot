import { AppDataSource } from "../db"
import { Asset } from '../models/asset'
import { Asset_STRUCT, User_STRUCT } from "../types"

export const createAssetTracker = async (asset: Asset_STRUCT) => {
    await AppDataSource.createQueryBuilder()
        .insert()
        .into(Asset)
        .values(asset)
        .execute()
}

export const getAllAssets = async () => {
    await AppDataSource.getRepository(Asset)
    .createQueryBuilder('asset')
    .getMany();
}
