import { scrapeAssetInfo } from "../amazon-scraper/scraper";
import { User } from "../models/user";
import { createAssetTracker } from "../queries/asset";
import { Asset_STRUCT, User_STRUCT } from "../types";
import { getOrCreateUser } from "./user";

export const createAsset = async (asset_param: Asset_STRUCT, user_param: User_STRUCT) => {
    try {
        const user = await getOrCreateUser(user_param);
        if (!user) {
            throw ('User not found ');
        }

        const asset_with_user = {
            ...asset_param,
            prospect: user
        };

        await createAssetTracker(asset_with_user);
        await scrapeAssetInfo(asset_param.url_string || '');
    } catch (e) {
        console.log("Error in trackAsset: ", e);
        return false;
    }

    return true;
}