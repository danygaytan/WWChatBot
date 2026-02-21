import WAWebJS from "whatsapp-web.js";
import { getOrCreateUser } from "../controllers/user";
import { prettifyAssetListResponse } from "../utils/global";
import { getAllAssetsByUserId } from "../controllers/asset";
import * as global from '../utils/global';
import { getPromptFromMessage } from "../utils/utils";

export const watchlist = async (chat: WAWebJS.Chat, msg: WAWebJS.Message) => {
    try {
        const sender = await chat.getContact();
        const user = await getOrCreateUser(sender);
        let page_string_value = getPromptFromMessage(msg);

        const page_number = page_string_value.length > 0 ? Number(page_string_value) : 0;

        const assets = await getAllAssetsByUserId(user, page_number);

        if(!assets) throw global.error_fetching_asset;

        const prettified_assets_message = prettifyAssetListResponse(assets);

        chat.sendMessage(prettified_assets_message);

    } catch (e: any) {
        chat.sendMessage(e)
    }

}