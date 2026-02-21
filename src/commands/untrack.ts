import WAWebJS from "whatsapp-web.js";
import * as global from "../utils/global";
import { getOrCreateUser } from "../controllers/user";
import { getPromptFromMessage } from "../utils/utils";
import { deleteAssetByURL } from "../controllers/asset";

export const untrack = async (chat: WAWebJS.Chat, msg: WAWebJS.Message) => {
    try {
        const url_string = getPromptFromMessage(msg);
        const sender = await chat.getContact();
        const user = await getOrCreateUser(sender);

        const deletion_result = await deleteAssetByURL(url_string, user);

        if(!deletion_result) throw (global.error_deletion_general_failure);
        msg.reply(global.success_deletion_general_message);
        
    } catch (e: any) {
        console.log(e);
        msg.reply(e);
    }
}