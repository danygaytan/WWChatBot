import { Client, LocalAuth } from "whatsapp-web.js";
import { sendQuery } from "./src/external/openai";
import { handleCommand } from "./src/commands";
import * as dotenv from 'dotenv';
dotenv.config()

const client = new Client({
    authStrategy: new LocalAuth(),
    // proxyAuthentication: { username: 'username', password: 'password' },
    puppeteer: { 
        // args: ['--proxy-server=proxy-server-that-requires-authentication.example.com'],
        headless: false,
    }
});

client.initialize();

client.on('loading_screen', (percent, message) => {
    console.log('LOADING SCREEN', percent, message);
});


// Pairing code only needs to be requested once
let pairingCodeRequested = false;
client.on('qr', async (qr) => {
    // NOTE: This event will not be fired if a session is specified.
    console.log('QR RECEIVED', qr);

    // paiuting code example
    const pairingCodeEnabled = false;
    if (pairingCodeEnabled && !pairingCodeRequested) {
        const pairingCode = await client.requestPairingCode('+522206781821'); // enter the target phone number
        console.log('Pairing code enabled, code: '+ pairingCode);
        pairingCodeRequested = true;
    }
});

client.on('authenticated', () => {
    console.log('AUTHENTICATED');
});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessful
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('message', async (msg) => {
    const chat = await msg.getChat();

    if (!chat.isGroup) {
        chat.sendMessage('Que esperabas? una API a chatgpt gratis? a solas? nah');
    }else if (chat.name !== process.env.RESTRICTED_GROUP_NAME){
        chat.sendMessage('Ajas, solo pertenezco a un grupo :(');
    }

    await handleCommand(chat, msg);
})