import WAWebJS from "whatsapp-web.js";
import { getOrCreateUser } from "../controllers/user";
import { prettifyAssetList } from "../utils/utils";
import { getAllAssetsByUserId } from "../controllers/asset";
import * as global from '../utils/global';

export const trackers = async (chat: WAWebJS.Chat, msg: WAWebJS.Message) => {
    try {
        const sender = await chat.getContact();
        const user = await getOrCreateUser(sender);

        const assets = await getAllAssetsByUserId(user);

        if(!assets) throw global.error_fetching_asset;

        const prettified_assets_message = prettifyAssetList(assets);

        chat.sendMessage(prettified_assets_message);

    } catch (e: any) {
        chat.sendMessage(e)
    }

}