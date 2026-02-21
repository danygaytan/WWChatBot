import { ask } from './ask';
import { watch } from './watch';
import { unwatch } from './unwatch';
import { watchlist } from './watchlist';

import * as dotenv from 'dotenv';
import * as global from '../utils/global';
import WAWebJS from "whatsapp-web.js";
import { getPrefixAndCommandFromMessage } from "../utils/utils";
dotenv.config();

const commandMap = new Map<string, any>();
commandMap.set('ask', ask);
commandMap.set('watch', watch);
commandMap.set('unwatch', unwatch);
commandMap.set('watchlist', watchlist);


export const handleCommand = async (chat: WAWebJS.Chat, msg: WAWebJS.Message) => {
    const should_start_with_prefix = process.env.COMMAND_PREFIX || '!';
    const [prefix, command] = getPrefixAndCommandFromMessage(msg);
    if(prefix !== should_start_with_prefix) return;

    const command_fn = commandMap.get(command);
    if (!command_fn) return chat.sendMessage(global.error_no_command_found);
    return await command_fn(chat, msg);
}