import WAWebJS from "whatsapp-web.js";
import * as dotenv from 'dotenv';
import * as global from './utils/global';
import { sendQuery } from "./external/openai";
import { constructResponseInputMessageContentList, extractAttachmentFromMessageObject, searchAndConstructContextFromMessageObject } from "./utils/utils";
dotenv.config();

const chatgpt = async (chat: WAWebJS.Chat, msg: WAWebJS.Message) => {
    try{
        const [completeMessageString, mediaAttachments] = await searchAndConstructContextFromMessageObject(msg);
        if (completeMessageString.length == 0){
            chat.sendMessage('Tienes que escribir un query');
        }

        const inputContent = constructResponseInputMessageContentList({
            text_query_message: completeMessageString,
            img_query_attachments: mediaAttachments,
        });

        const api_response = await sendQuery(inputContent);
        msg.reply(api_response.output_text);
    } catch(e){
        console.log(e);
        chat.sendMessage(global.error_openai_api_response);
    }
}

const DEFAULT_COMMAND_PREFIX = '!';

export const handleCommand = async (chat: WAWebJS.Chat, msg: WAWebJS.Message) => {
    const command_prefix = process.env.COMMAND_PREFIX || DEFAULT_COMMAND_PREFIX;
    const command = msg.body.split(' ')[0];

    if(!command.startsWith(command_prefix)) return;

    const command_text = command.slice(1).toString();

    switch (command_text) {
        case 'chatgpt': chatgpt(chat, msg); break;
        default: chat.sendMessage(global.error_no_command_found); break;
    }
}
