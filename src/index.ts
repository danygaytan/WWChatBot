import * as dotenv from 'dotenv';
import * as qrcode from 'qrcode';
import { wweb_client_config } from './startup-config';
import pkg from "whatsapp-web.js";
import { AppDataSource } from "./database/index";
import { handleCommand } from "./commands/index";
import { createGetAndUpdateAllAssetsCronJob } from './cron-jobs/assets';

dotenv.config()
const { Client, LocalAuth } = pkg;

export let global_client: pkg.Client;

const main = async () => {
    const client_config = wweb_client_config[process.env.CONFIG_TARGET! as keyof typeof wweb_client_config] || wweb_client_config.dev;
    const client = new Client(client_config);

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
