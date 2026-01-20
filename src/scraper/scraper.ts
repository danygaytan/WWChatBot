import fetch from 'node-fetch';
import { parse } from 'node-html-parser';
import { Asset , Store_ENUM } from '../types';

export const scrapeAndCreateAssetData = async (asset_param: Asset): Promise<Asset | null> => {
    try {
        if(!asset_param.url_string || asset_param.url_string == null) {
            throw('Asset URL is invalid');
        }

        const http_response = await fetch(asset_param.url_string, {
            method: 'GET',
            redirect: 'follow',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,xml;q=0.9,image/avif,webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5'
            }
        });

        const html = await http_response.text();
        const root = parse(html);

        const asset_description_content_tag = root.getElementById('productTitle');
        const asset_name = asset_description_content_tag?.firstChild?.innerText;

        const asset_price_content_tag = root.getElementById('items[0.base][customerVisiblePrice][amount]');
        const asset_price = asset_price_content_tag?.rawAttributes['value']

        return { 
            id: asset_param.id,
            name: asset_name?.trim(),
            price: asset_price,
            previous_price: asset_param.price,
            store: asset_param.store,
            prospect: asset_param.prospect,
            url_string: asset_param.url_string,
        } as Asset;

    } catch (e) {
        console.log('Error in function: ', e);
    }

    return null;
}
