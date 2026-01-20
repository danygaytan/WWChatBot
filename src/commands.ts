import WAWebJS from "whatsapp-web.js";
import * as dotenv from 'dotenv';
import * as global from './utils/global';
import { sendQuery } from "./external/openai";
import {
    constructResponseInputMessageContentList,
    isURLValid,
    searchAndConstructContextFromMessageObject,
    stripMessageContent } from "./utils/utils";
import { createAsset } from "./api/asset";
import { Asset, User } from "./types";
import { scrapeAndCreateAssetData } from "./scraper/scraper";
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
        const url_received = stripMessageContent(msg);
        const is_URL_valid = await isURLValid(url_received);

        if (!is_URL_valid) {
            return chat.sendMessage(global.error_track_command_unable_to_verify_url);
        }

        let asset: Asset = {
            url_string: url_received,
            prospect: {id: ''},
        }

        const user: User = {
            id: chat_user.id.user,
            server: chat_user.id.server,
            serialized_id: chat_user.id._serialized,
            username: '',
            assets: [],
        }

        const created_asset = await createAsset(asset, user)
        if(!created_asset) throw (global.error_createAsset_general_failure);
        
        return chat.sendMessage(global.success_track_command_general_response(created_asset));
    } catch (e) {
        console.log('Error in trackAsset: ', e)
        return chat.sendMessage(global.error_track_command_general_failure);
    }
}

export const handleCommand = async (chat: WAWebJS.Chat, msg: WAWebJS.Message) => {
    const command_prefix = process.env.COMMAND_PREFIX || '!';
    const command = msg.body.split(' ')[0];
    const isGroupMessage = chat.isGroup;

    if (!command.startsWith(command_prefix)) return;

    const command_text = command.slice(1).toString();

    if(isGroupMessage) {
        switch (command_text) {
            case 'chatgpt': chatgpt(chat, msg); break;
            default: chat.sendMessage(global.error_no_command_found); break;
        }
    }
    else {
        switch (command_text) {
            case 'track': trackAsset(chat, msg); break;
            default: chat.sendMessage(global.error_no_command_found); break;
        }
    }
}
