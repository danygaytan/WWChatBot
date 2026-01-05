import fetch from 'node-fetch';
import { parse } from 'node-html-parser';
import { Asset_STRUCT, Store_ENUM } from '../types';

export const scrapeAssetInfo = async (asset: Asset_STRUCT): Promise<Asset_STRUCT> => {
    try {
        const asset_url = asset.url_string;
        if(!asset_url || asset_url == null) {
            throw('Asset URL is invalid');
        }

        const response = await fetch(asset_url, {
            method: 'GET',
            redirect: 'follow',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,xml;q=0.9,image/avif,webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5'
            }
        });

        const html = await response.text();
        const root = parse(html);

        const asset_description_content_tag = root.getElementById('productTitle');
        const asset_name = asset_description_content_tag?.firstChild?.innerText;

        const asset_price_content_tag = root.getElementById('items[0.base][customerVisiblePrice][amount]');
        const asset_price = asset_price_content_tag?.rawAttributes['value']

        asset.name = asset_name;
        asset.price = Number(asset_price);
        asset.store = Store_ENUM.AMAZON;
    } catch (e) {
        console.log('Error in scrapeAssetInfo: ', e);
    }

    return asset;
}
