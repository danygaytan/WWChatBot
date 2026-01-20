import { Asset, User } from "../types";
import { getOrCreateUser } from "./user";
import { getUserByID } from "../queries/user";
import { sendAssetUpdateToUser } from "./whatsapp";
import { scrapeAndCreateAssetData } from "../scraper/scraper";
import { createAssetTracker, updateAsset as updateAssetQuery, getAllAssets as getAllAssetsQuery, getAssetByID } from "../queries/asset";
import * as global from '../utils/global';

export const createAsset = async (asset_param: Asset, user_param: User): Promise<Asset | null> => {
    try {
        const user = await getOrCreateUser(user_param);
        if (!user) throw (global.error_user_not_found);

        let asset = await scrapeAndCreateAssetData(asset_param);
        if(!asset) throw (global.error_fetching_asset);

        asset.prospect = { id: user.id };
        
        return await createAssetTracker(asset);
    } catch (e) {
        console.log("Error in trackAsset: ", e);
    }

    return null;
}

export const updateAsset = async (asset_param: Asset) => {
    try {
        if(!asset_param.id ) throw ('The asset ID is invalid.');

        const asset = await getAssetByID(asset_param.id);
        if(!asset) throw ('There is an error retrieving the desired asset.');

        await updateAssetQuery(asset_param);
        return getAssetByID(asset_param.id);
    } catch (e) {
        console.log('Error in updateAsset: ', e);
        return null;
    } 
}

export const getAllAssets = async () => {
    return await getAllAssetsQuery();
}

export const getAndUpdateAllAssets = async () => {
    try {
        const assets = await getAllAssetsQuery();
        assets.forEach(async latest_asset_copy => {
            const updated_asset = await scrapeAndCreateAssetData(latest_asset_copy);
            if(!updated_asset) throw (global.error_fetching_asset);

            const asset_owner = await getUserByID(updated_asset.prospect.id || '');
            if (updated_asset.price !== latest_asset_copy.price ) {
                await updateAsset(updated_asset);
                await sendAssetUpdateToUser(asset_owner, updated_asset); 
            }
        });
    } catch (e) {
        console.log('Error in getAndUpdateAllAssets: ', e);
    }
}