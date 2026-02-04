import { Asset, Store_ENUM, User } from "../utils/types";
import { getOrCreateUser } from "./user";
import { getUserByID } from "../database/queries/user";
import { sendAssetUpdateToUser } from "./whatsapp";
import { scrapeAndCreateAssetData } from "../scraper/scraper";
import { createAssetTracker, updateAsset as updateAssetQuery, getAllAssets as getAllAssetsQuery, getAssetByID } from "../database/queries/asset";
import * as global from '../utils/global';
import { isURLValid } from "../utils/utils";

export const createAsset = async (asset_url_param: string, user_param: User): Promise<Asset | null> => {
    try {
        const [is_url_valid, storeENUM] = await isURLValid(asset_url_param);
        if(!is_url_valid) throw (global.error_track_command_unable_to_verify_url);
        
        let asset_prototype: Asset = {
            url_string: asset_url_param,
            store: storeENUM as Store_ENUM,
            prospect: {id : user_param.id}
        }

        let asset = await scrapeAndCreateAssetData(asset_prototype);
        if(!asset) throw (global.error_fetching_asset);

        return await createAssetTracker(asset);
    } catch (e) {
        console.log("Error in trackAsset: ", e);
        return null;
    }
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