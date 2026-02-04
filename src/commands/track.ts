import WAWebJS from "whatsapp-web.js";
import * as global from "../utils/global";
import { createAsset } from "../api/asset";
import { getOrCreateUser } from "../api/user";
import { getPromptFromMessage } from "../utils/utils";

export const track = async (chat: WAWebJS.Chat, msg: WAWebJS.Message) => {
    try {
        const url_string = getPromptFromMessage(msg);
        const sender = await chat.getContact();
        const user = await getOrCreateUser(sender);

        const created_asset = await createAsset(url_string, user)
        if(!created_asset) throw (global.error_createAsset_general_failure);
        
        return chat.sendMessage(global.success_track_command_general_response(created_asset));
    } catch (e: any) {
        console.log('Error in trackAsset: ', e)
        return chat.sendMessage(e);
    }
}