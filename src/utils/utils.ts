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

export const stripMessageContent = (msg: WAWebJS.Message) => {
    return msg.body.split(' ').slice(1).join(' '); // message content without command
}


export const verifyURLString = async (url_string: string) => {
    const url_whitelist = [
        "amazon",
        "walmart",
        "mercadolibre",
        ""
    ];
    try {
        const response = await fetch(url_string, {
            method: 'GET',
            headers: { Accept: 'application/json' },
        });
        return url_string;
    } catch (e) {
        console.log('URL no es valida: ', e);
        return null;
    }
}

export const generateRandomUsername = () => {
    const adjectives = [
        "Explosivo",
        "Radioactivo",
        "Crujiente",
        "Desorientado",
        "Pegajoso",
        "Galáctico",
        "Sarcástico",
        "Fluorescente",
        "Sonámbulo",
        "Incomprendido",
        "Chistoso",
        "Esponjoso",
        "Veloz",
        "Dramático",
        "Bailarín",
        "Misterioso",
        "Glotón",
        "Relampagueante",
        "Invisible",
        "Afortunado"
    ];

    const nouns = [
        "Axolote",
        "Panda",
        "Aguacate",
        "Tostadora",
        "Capibara",
        "Sandía",
        "Calcetín",
        "Pingüino",
        "Chilaquil",
        "Pantufla",
        "Dinosaurio",
        "Kiwi",
        "Microondas",
        "Ornitorrinco",
        "Banana",
        "Taco",
        "Koala",
        "Lámpara",
        "Zanahoria",
        "Sombrero"
    ];

    return `${nouns[randomInt(nouns.length)]} ${adjectives[randomInt(adjectives.length)]}`
}