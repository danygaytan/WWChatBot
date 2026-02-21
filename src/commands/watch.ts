import WAWebJS from "whatsapp-web.js";
import * as global from "../utils/global";
import { createAsset } from "../controllers/asset";
import { getOrCreateUser } from "../controllers/user";
import { getPromptFromMessage } from "../utils/utils";

export const watch = async (chat: WAWebJS.Chat, msg: WAWebJS.Message) => {
    try {
        const url_string = getPromptFromMessage(msg);
        const sender = await chat.getContact();
        const user = await getOrCreateUser(sender);

        // The Asset info is scraped from Amazon to create the object.
        const created_asset = await createAsset(url_string, user)
        if(!created_asset) throw (global.error_createAsset_general_failure);
        
        chat.sendMessage(global.success_watch_command_general_response(created_asset));
    } catch (e: any) {
        console.log(e)
        chat.sendMessage(e);
    }
}