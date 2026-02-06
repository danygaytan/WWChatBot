import * as global from '../utils/global';
import { isURLValid } from "../utils/utils";
import { sendAssetUpdateToUser } from "./whatsapp";
import { getUserByID } from "../database/queries/user";
import { Asset, Store_ENUM, User } from "../utils/types";
import { getUpdatedAssetInfo } from "../scraper/scraper";
import { createAssetTracker, updateAsset as updateAssetQuery, getAllAssets as getAllAssetsQuery, getAssetByID } from "../database/queries/asset";

export const createAsset = async (asset_url_param: string, user_param: User): Promise<Asset | null> => {
    try {
        const [is_url_valid, storeENUM] = await isURLValid(asset_url_param);
        if(!is_url_valid) throw (global.error_track_command_unable_to_verify_url);
        
        let asset_prototype: Asset = {
            url_string: asset_url_param,
            store: storeENUM as Store_ENUM,
            prospect: {id : user_param.id}
        }

        let [asset, error] = await getUpdatedAssetInfo(asset_prototype);
        if(error) throw (global.error_fetching_asset);

        return await createAssetTracker(asset as Asset);
    } catch (e) {
        console.log("Error in trackAsset: ", e);
        return null;
    }
}

export const updateAsset = async (asset_param: Asset) => {
    try {
        if(!asset_param.id) throw (global.error_fetching_asset);

        const asset = await getAssetByID(asset_param.id);
        if(!asset) throw (global.error_fetching_asset);

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
    let updated_assets: Asset[] = [];
    const assets = await getAllAssetsQuery();
    assets.forEach(async latest_asset_copy => {
        try {
            const [updated_asset, error] = await getUpdatedAssetInfo(latest_asset_copy);
            if(error) throw(error);

            const cleaned_asset = updated_asset as Asset;
            const asset_owner = await getUserByID(cleaned_asset?.prospect?.id || '');
            if (cleaned_asset.price !== undefined && cleaned_asset.price !== latest_asset_copy.price ) {
                await sendAssetUpdateToUser(asset_owner, cleaned_asset); 
            }
        } catch (e: any) {
            console.log('Error in getAndUpdateAllAssets: ', e);
        }
    });

    await Promise.all(updated_assets.map(asset => {updateAsset(asset);}))
}