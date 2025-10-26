import WAWebJS from "whatsapp-web.js";

// In case we have to add a previous message body to the current one 
// [TODO] What about media messages? How are these going to be concanated?
export const searchAndAppendContextFromMessageObject = async (msg: WAWebJS.Message): Promise<string> => {
    let newMessage: string = msg.body.split(' ').slice(1).join(' ');

    if (msg.hasQuotedMsg) {
        const quotedMessageObject = await msg.getQuotedMessage();
        const quotedMessageContent = quotedMessageObject.body;
        newMessage =
        `
        Contexto:
        ${quotedMessageContent}

        Query:
        ${newMessage}
        `
    }

    return newMessage;
}