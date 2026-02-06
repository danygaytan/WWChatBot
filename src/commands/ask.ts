import WAWebJS from "whatsapp-web.js";
import * as global from '../utils/global';
import { sendQuery } from "../external/openai";
import { constructResponseInputMessageContentList, searchAndConstructContextFromMessageObject } from "../utils/utils";

export const ask = async (chat: WAWebJS.Chat, msg: WAWebJS.Message) => {
    try {
        const [completeMessageString, mediaAttachments] = await searchAndConstructContextFromMessageObject(msg);
        if (completeMessageString.length == 0) {
            chat.sendMessage(global.error_no_query_in_body);
        }

        const inputContent = constructResponseInputMessageContentList({
            text_query_message: completeMessageString,
            img_query_attachments: mediaAttachments,
        });

        const api_response = await sendQuery(inputContent);
        msg.reply(api_response.output_text);
    } catch (e) {
        console.log(e);
        chat.sendMessage(global.error_openai_api_response);
    }
}