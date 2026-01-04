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