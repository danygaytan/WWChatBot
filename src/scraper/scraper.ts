import fetch from 'node-fetch';
import { HTMLElement, parse } from 'node-html-parser';
import { Asset , Store_ENUM } from '../utils/types';
import * as global from '../utils/global';

export const getUpdatedAssetInfo = async (asset_param: Asset): Promise<(Asset | (string | null))[]> => {
    try {
        const http_response = await fetch(asset_param.url_string as string, {
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

        let asset_data: (string | undefined)[] = [asset_param.name, asset_param.price];
        switch(asset_param.store) {
            case Store_ENUM.AMAZON:
                asset_data = amazonScraper(root);
                break;
            default: break;
        }

        if(asset_data[0] == undefined || asset_data[1] == undefined) {
            throw(global.error_fetching_asset);
        }

        const updated_asset: Asset = { 
            id: asset_param.id,
            name: asset_data[0]?.trim(),
            price: asset_data[1],
            previous_price: asset_param.price,
            store: asset_param.store,
            prospect: asset_param.prospect,
            url_string: asset_param.url_string,
        };

        return [updated_asset, null];

    } catch (e: any) {
        return [null, e];
    }
}

const amazonScraper = (html: HTMLElement) => {
    const asset_description_content_tag = html.getElementById('productTitle');
    const asset_name = asset_description_content_tag?.firstChild?.innerText;

    const asset_price_content_tag = html.getElementById('items[0.base][customerVisiblePrice][amount]');
    const asset_price = asset_price_content_tag?.rawAttributes['value']

    return [asset_name, asset_price];
}
