import { randomInt } from "crypto";
import { ResponseInputContent, ResponseInputMessageContentList } from "openai/resources/responses/responses";
import WAWebJS, { MessageMedia } from "whatsapp-web.js";
import { Store_ENUM } from "../types";
import * as global from './global';


// In case we have to add a previous message body to the current one 
// [TODO] What about media messages? How are these going to be concanated?
export const searchAndConstructContextFromMessageObject = async (msg: WAWebJS.Message): Promise<[string, MessageMedia[]]> => {
    let messageWithContextString: string = msg.body.split(' ').slice(1).join(' ');
    let attachments: MessageMedia[] = [];

    if (msg.hasQuotedMsg) {
        const quotedMessageObject = await msg.getQuotedMessage();
        const quotedMessageContent = quotedMessageObject.body;
        messageWithContextString =
            `
        Contexto:
        ${quotedMessageContent}

        Query:
        ${messageWithContextString}
        `

        const quotedMessageMedia = await extractAttachmentFromMessageObject(quotedMessageObject);
        if (quotedMessageMedia !== null) attachments.push(quotedMessageMedia);
    }

    const mainMessageMedia = await extractAttachmentFromMessageObject(msg);
    if (mainMessageMedia !== null) attachments.push(mainMessageMedia);

    console.log(messageWithContextString, attachments.length);
    return [messageWithContextString, attachments];
}

export const extractAttachmentFromMessageObject = async (msg: WAWebJS.Message): Promise<MessageMedia | null> => {
    if (!msg.hasMedia) {
        return null;
    }

    return await msg.downloadMedia();
}

export const constructResponseInputMessageContentList = ({
    text_query_message,
    img_query_attachments,
}: {
    text_query_message: string,
    img_query_attachments?: MessageMedia[],
}): ResponseInputMessageContentList => {
    let inputMessageContent: ResponseInputMessageContentList = [];

    if (text_query_message) {
        const textInputMessageItem = {
            type: 'input_text',
            text: text_query_message,
        }

        inputMessageContent.push(textInputMessageItem as ResponseInputContent);
    }

    if (img_query_attachments && img_query_attachments.length > 0) {
        const imgInputAttachmentItems = img_query_attachments.map(item => {
            return {
                type: 'input_image',
                image_url: item.data, // [TODO] verify
            } as ResponseInputContent;
        });

        inputMessageContent = inputMessageContent.concat(imgInputAttachmentItems);
    }

    return inputMessageContent;
}

// return message content without command text and prefix
export const getPromptFromMessage = (msg: WAWebJS.Message) => {
    return msg.body.split(' ').slice(1).join(' ');
}

export const getPrefixAndCommandFromMessage = (msg: WAWebJS.Message) => {
    const full_command = msg.body.split(' ').slice(0).join(' ');
    const prefix = full_command[0];
    const command = full_command.slice(1);

    return [prefix, command];
}

export const isURLValid = async (url_string: string) => {
    try {
        const url_whitelist = String(process.env.DOMAIN_WHITELIST).split(',') || [];
        const domain_url = url_string.split(':')[1].split('/')[2];
        const [is_valid_url_domain, domainENUM] = isValidDomain(domain_url);

        if(!is_valid_url_domain) {
            return [false, domainENUM]
        }

        await fetch(url_string, {
            method: 'GET',
            headers: { Accept: 'application/json' },
        });
        return [true, domainENUM];
    } catch (e) {
        return [false, null];
    }
}

export const isValidDomain = (url_domain_text: string) => {
    // I am thinking on moving this whitelist to a more scalable and hidden approach.
    try {
        const url_domain_whitelist = new Map<string, Store_ENUM>();
        url_domain_whitelist.set('a', Store_ENUM.AMAZON);
        url_domain_whitelist.set('amazon', Store_ENUM.AMAZON);

        return [true, url_domain_whitelist.get(url_domain_text)];
    } catch (e: any) {
        return [false, Store_ENUM.DEFAULT]
    }

}

export const generateRandomUsername = () => {
    const nouns = String(process.env.BOT_USER_NOUNS).split(',') || [];
    const adjectives = String(process.env.BOT_USER_ADJECTIVES).split(',') || [];

    return `${nouns[randomInt(nouns.length)]} ${adjectives[randomInt(adjectives.length)]}`
}