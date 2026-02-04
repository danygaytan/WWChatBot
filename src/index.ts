import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;
import { handleCommand } from "./commands/index";
import { AppDataSource } from "./db";
import * as dotenv from 'dotenv';
import * as global from './utils/global';
import * as qrcode from 'qrcode';
import { createGetAndUpdateAllAssetsCronJob } from './cron-jobs/assets';
dotenv.config()

export let global_client: pkg.Client;

const main = async () => {
    const client = new Client({
        authStrategy: new LocalAuth(
            {
                // './.wwebjs_auth' as a default
                dataPath: '/var/sessions', // /var/sessions whenever Docker runs it
                rmMaxRetries: 3,
            }
        ),
        puppeteer: {
            headless: false, // false whenever Docker runs it
            // executablePath: '/usr/bin/chromium', // comment when Docker runs it
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

    global_client = client;

    try {
        await AppDataSource.initialize()
    } catch (error) {
        console.log(error)
    }


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
        const newQRCode = qrcode.toString(qr, (err, url) => { });
        console.log('Parsed QR Code: ', newQRCode);

        const pairingCodeEnabled = false;
        if (pairingCodeEnabled && !pairingCodeRequested) {
            const pairingCode = await client.requestPairingCode(process.env.PHONE_NUMBER || '');
            console.log('Pairing code enabled, code: ' + pairingCode);
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
        await handleCommand(chat, msg);
    })
};

main();
createGetAndUpdateAllAssetsCronJob();
