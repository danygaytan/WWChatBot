import WAWebJS from "whatsapp-web.js";
import * as dotenv from 'dotenv';
import * as global from './utils/global';
import { sendQuery } from "./external/openai";
import { constructResponseInputMessageContentList, extractAttachmentFromMessageObject, searchAndConstructContextFromMessageObject, stripMessageContent, verifyURLString } from "./utils/utils";
import { getUserByID } from "./queries/user";
import { createAsset } from "./api/asset";
import { Asset_STRUCT, User_STRUCT } from "./types";
dotenv.config();

const chatgpt = async (chat: WAWebJS.Chat, msg: WAWebJS.Message) => {
    try {
        const [completeMessageString, mediaAttachments] = await searchAndConstructContextFromMessageObject(msg);
        if (completeMessageString.length == 0) {
            chat.sendMessage('Tienes que escribir un query');
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

const trackAsset = async (chat: WAWebJS.Chat, msg: WAWebJS.Message) => {
    try {
        const chat_user = await chat.getContact();
        const verified_url = await verifyURLString(stripMessageContent(msg));
        if (verified_url == null) {
            return chat.sendMessage(global.error_track_command_unable_to_verify_url);
        }
        const asset: Asset_STRUCT = {
            url_string: verified_url, // [TODO] Verify body contains a valid URL
        }

        const user: User_STRUCT = {
            id: chat_user.id.user,
            server: chat_user.id.server,
            serialized_id: chat_user.id._serialized,
        }

        await createAsset(asset, user)
        chat.sendMessage(global.success_track_command_general_response);
    } catch (e) {
        console.log('Error in trackAsset: ', e)
        chat.sendMessage(global.error_track_command_general_failure);
    }
}

const DEFAULT_COMMAND_PREFIX = '!';

export const handleCommand = async (chat: WAWebJS.Chat, msg: WAWebJS.Message) => {
    const command_prefix = process.env.COMMAND_PREFIX || DEFAULT_COMMAND_PREFIX;
    const command = msg.body.split(' ')[0];

    if (!command.startsWith(command_prefix)) return;

    const command_text = command.slice(1).toString();

    switch (command_text) {
        case 'chatgpt': chatgpt(chat, msg); break;
        case 'track': trackAsset(chat, msg); break;
        default: chat.sendMessage(global.error_no_command_found); break;
    }
}
