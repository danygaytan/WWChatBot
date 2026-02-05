import { LocalAuth } from "whatsapp-web.js";

export const wweb_client_config = {
    dev: {
        authStrategy: new LocalAuth(
            {
                dataPath: './.wwebjs_auth',
                rmMaxRetries: 3,
            }
        ),
        puppeteer: {
            headless: true,
            executablePath: '/usr/bin/chromium',
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
    },
    docker: {
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
    }
}