import { Client, LocalAuth } from "whatsapp-web.js";
import { handleCommand } from "./commands";
import * as dotenv from 'dotenv';
import * as global from './utils/global';
import * as qrcode from 'qrcode';
dotenv.config()

const client = new Client({
    authStrategy: new LocalAuth(
        {
            dataPath: '/var/sessions',
            rmMaxRetries: 3,
        }
    ),
    puppeteer: { 
        headless: false,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu",
            "--disable-extensions",
            "--disable-background-networking",
            "--disable-background-timer-throttling",
            "--disable-client-side-phishing-detection",
            "--disable-default-apps",
            "--disable-sync",
            "--metrics-recording-only",
            "--no-first-run",
            "--mute-audio",
            "--safebrowsing-disable-auto-update",
            "--window-size=1920,1080"
            ]
    }
});

client.initialize();

client.on('loading_screen', (percent, message) => {
    console.log('LOADING SCREEN', percent, message);
});

client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    console.log('QR Code:', qr);
});


// Pairing code only needs to be requested once
let pairingCodeRequested = false;
client.on('qr', async (qr) => {
    // NOTE: This event will not be fired if a session is specified.
    const newQRCode = qrcode.toString(qr, (err, url) => {});
    console.log('Parsed QR Code: ', newQRCode);

    const pairingCodeEnabled = false;
    if (pairingCodeEnabled && !pairingCodeRequested) { 
        const pairingCode = await client.requestPairingCode(process.env.PHONE_NUMBER || '');
        console.log('Pairing code enabled, code: '+ pairingCode);
        pairingCodeRequested = true;
    }
});

client.on('authenticated', () => {
    console.log('AUTHENTICATED');
});

client.on('disconnected', (reason) => {
    console.log('Disconnected, reason: ', reason);
})

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessful
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', () => {
    console.log('Client is ready!');
})

client.on('message', async (msg) => {
    const chat = await msg.getChat();
    if (!chat.isGroup) {
        chat.sendMessage(global.error_forbidden_caller);
    }

    await handleCommand(chat, msg);
})
