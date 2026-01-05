import { Asset } from "./models/asset"
import { User } from "./models/user"

export interface User_STRUCT {
    id: string,
    server: string,
    serialized_id: string,
    username?: string,
    tracked_assets?: [Asset]
}

export interface Asset_STRUCT {
    id?: number,
    url_string?: string,
    name?: string,
    price?: number, // double
    store?: Store_ENUM,
    prospect?: User // user id
}

export enum Store_ENUM {
    AMAZON = "Amazon",
    WALMART = "Walmart",
    MERCADOLIBRE = "Mercado Libre",
    DEFAULT = "Generic store",
}