import WAWebJS from "whatsapp-web.js";
import * as dotenv from 'dotenv';
import * as global from './utils/global';
import { sendQuery } from "./external/openai";
dotenv.config();

const chatgpt = async (chat: WAWebJS.Chat, msg: WAWebJS.Message) => {
    try{
        const query = msg.body.slice(9); // The query portion will start at index 9
        if (query.length == 0){
            chat.sendMessage('Tienes que escribir un query');
        }
        const api_response = await sendQuery(query);
        msg.reply(api_response.output_text);
    } catch(e){
        console.log(e);
        chat.sendMessage(global.error_openai_api_response);
    }
}

const DEFAULT_COMMAND_PREFIX = '!';

export const handleCommand = async (chat: WAWebJS.Chat, msg: WAWebJS.Message) => {
    const command_prefix = process.env.COMMAND_PREFIX ?? DEFAULT_COMMAND_PREFIX;
    const command = msg.body.split(' ')[0];

    if(!command.startsWith(command_prefix)) return;

    const command_text = command.slice(1).toString();

    switch (command_text) {
        case 'chatgpt': chatgpt(chat, msg); break;
        default: chat.sendMessage(global.error_no_command_found); break;
    }
}
