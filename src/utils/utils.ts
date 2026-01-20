import { randomInt } from "crypto";
import { ResponseInputContent, ResponseInputMessageContentList } from "openai/resources/responses/responses";
import WAWebJS, { MessageMedia } from "whatsapp-web.js";


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

// return message content without command
export const stripMessageContent = (msg: WAWebJS.Message) => {
    return msg.body.split(' ').slice(1).join(' ');
}

export const isURLValid = async (url_string: string) => {
    try {
        const url_whitelist = String(process.env.DOMAIN_WHITELIST).split(',') || [];
        console.log(url_whitelist);
        const domain_url = url_string.split(':')[1].split('/')[2];
        const is_valid_url_domain = url_whitelist.includes(domain_url);

        if(!is_valid_url_domain) {
            return false;
        }

        await fetch(url_string, {
            method: 'GET',
            headers: { Accept: 'application/json' },
        });
        return true;
    } catch (e) {
        console.log('URL no es valida: ', e);
        return false;
    }
}

export const generateRandomUsername = () => {
    const adjectives = String(process.env.BOT_USER_ADJECTIVES).split(',') || [];
    const nouns = String(process.env.BOT_USER_NOUNS).split(',') || [];

    return `${nouns[randomInt(nouns.length)]} ${adjectives[randomInt(adjectives.length)]}`
}