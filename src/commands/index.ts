import { ask } from './ask';
import { track } from './track';

import * as dotenv from 'dotenv';
import * as global from '../utils/global';
import WAWebJS from "whatsapp-web.js";
import { getPrefixAndCommandFromMessage } from "../utils/utils";
dotenv.config();

const commandMap = new Map<string, any>();
commandMap.set('track', track);
commandMap.set('ask', ask);


export const handleCommand = async (chat: WAWebJS.Chat, msg: WAWebJS.Message) => {
    const should_start_with_prefix = process.env.COMMAND_PREFIX || '!';
    const [prefix, command] = getPrefixAndCommandFromMessage(msg);
    if(prefix !== should_start_with_prefix) return;

    const command_fn = commandMap.get(command);
    if (!command_fn) return chat.sendMessage(global.error_no_command_found);
    return await command_fn(chat, msg);
}