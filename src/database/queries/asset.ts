import { AppDataSource } from "../index";
import { Asset as Asset_model } from '../models/asset';
import { Asset, Store_ENUM, User } from "../../utils/types";

export const createAssetTracker = async (asset: Asset): Promise<Asset> => {
    const assetRepository = await AppDataSource.getRepository(Asset_model);
    const created_asset = await assetRepository.save(asset);

    return created_asset as Asset;
}

export const updateAsset = async (asset: Asset) => {
    await AppDataSource.createQueryBuilder()
            .update(Asset_model)
            .set(asset)
            .where("id = :id", { id: asset.id })
            .execute()
}

export const deleteAssetByURL = async (asset_url: string, user_id: string) => {

    const result = await AppDataSource.getRepository(Asset_model)
    .createQueryBuilder()
    .delete()
    .from('asset')
    .where('url_string = :asset_url AND prospect = :user_id', {asset_url, user_id})
    .execute();

    if(!result.affected || result.affected == 0) return false
    return true
}

export const getAssetByID = async (asset_id: string): Promise<Asset | null> => {
    const asset = await AppDataSource.getRepository(Asset_model)
    .createQueryBuilder('asset')
    .leftJoinAndSelect('asset.prospect', 'prospect')
    .where("asset_id = :id", { id : asset_id })
    .getOne();

    if (!asset) return null;

    return asset as Asset;
}

export const getAssetsByUserID = async (user_id: string): Promise<Asset[] | null> => {
    const assets = await AppDataSource.getRepository(Asset_model)
    .createQueryBuilder('asset')
    .leftJoinAndSelect('asset.prospect', 'prospect')
    .where('asset.prospect = :id', { id : user_id })
    .getMany();

    // console.log('Query assets: ', assets);

    if (!assets) return null;

    return assets as Asset[];
}

export const getAllAssets = async (): Promise<Asset[]> => {
    const assets = await AppDataSource.getRepository(Asset_model)
    .createQueryBuilder('asset')
    .leftJoinAndSelect('asset.prospect', 'prospect')
    .getMany() as Asset[];

    let parsed_assets: Asset[] = [];

    await assets.forEach(asset => {
        const parsed_asset: Asset = {
            id: asset?.id,
            name: asset?.name,
            url_string: asset?.url_string,
            price: asset?.price,
            store: asset?.store as Store_ENUM,
            prospect: { id: asset?.prospect.id },
        }

        parsed_assets.push(parsed_asset);
    });

    return parsed_assets;
}