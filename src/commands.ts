import WAWebJS from "whatsapp-web.js";
import * as dotenv from 'dotenv';
import * as global from './utils/global';
import { sendQuery } from "./external/openai";
dotenv.config();

const proposito = async (chat: WAWebJS.Chat, msg: WAWebJS.Message) => {
    try{
        chat.sendMessage("Fui programado para ser su chalan. \nhttps://www.youtube.com/watch?v=sa9MpLXuLs0");
    } catch(e) {
        console.log(e);
        chat.sendMessage(global.error_general_failure);
    }
}

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

const ayuda = async (chat: WAWebJS.Chat, msg: WAWebJS.Message) => {
    chat.sendMessage(global.warning_command_work_in_progress);
}

const DEFAULT_COMMAND_PREFIX = '!';

export const handleCommand = async (chat: WAWebJS.Chat, msg: WAWebJS.Message) => {
    const command_prefix = process.env.COMMAND_PREFIX ?? DEFAULT_COMMAND_PREFIX;
    const command = msg.body.split(' ')[0];

    if(!command.startsWith(command_prefix)) return;

    const command_text = command.slice(1).toString();

    switch (command_text) {
        case 'proposito': proposito(chat, msg); break;
        case 'chatgpt': chatgpt(chat, msg); break;
        case 'ayuda': ayuda(chat, msg); break;
        default: chat.sendMessage(global.error_no_command_found); break;
    }
}
