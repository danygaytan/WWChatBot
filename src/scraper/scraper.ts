import fetch from 'node-fetch';
import { HTMLElement, parse } from 'node-html-parser';
import { Asset , Store_ENUM } from '../utils/types';
import * as global from '../utils/global';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

export const getUpdatedAssetInfo = async (asset_param: Asset): Promise<(Asset | (string | null))[]> => {
    const browser = await puppeteer.launch({
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
    });

    try {
        const page = await browser.newPage();
        
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');

        await page.goto(asset_param.url_string as string, { waitUntil: 'networkidle2' });

        const html = await page.content();
        const root = parse(html);

        let asset_data = amazonScraper(root);

        await browser.close();
        
        return [{ ...asset_param, price: asset_data[1] }, null];

    } catch (e) {
        await browser.close();
        return [null, e as string];
    }
}

const amazonScraper = (html: HTMLElement) => {
    const asset_description_content_tag = html.getElementById('productTitle');
    const asset_name = asset_description_content_tag?.firstChild?.innerText;

    const asset_price_content_tag = html.getElementById('items[0.base][customerVisiblePrice][amount]');
    const asset_price = asset_price_content_tag?.rawAttributes['value']

    return [asset_name, asset_price];
}
