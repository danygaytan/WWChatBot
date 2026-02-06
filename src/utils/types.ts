import { Asset as Asset_model } from "../database/models/asset";

export interface User {
    id: string,
    server: string,
    serialized_id: string,
    username: string,
    assets: Asset_model[]
}

export interface Asset {
    id?: string,
    url_string?: string,
    name?: string,
    price?: string,
    previous_price?: string,
    store?: Store_ENUM,
    prospect: { id: string } // User id
}

export enum Store_ENUM {
    AMAZON = "Amazon",
    WALMART = "Walmart",
    MERCADOLIBRE = "Mercado Libre",
    DEFAULT = "Generic store",
}