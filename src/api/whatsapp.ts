import { global_client } from "..";
import WAWebJS from "whatsapp-web.js";
import { Asset, User } from "../types";
import { success_track_cron_job_general_response } from "../utils/global";

export const sendAssetUpdateToUser = async (user: User, asset: Asset) => {
    global_client.sendMessage(
        user.serialized_id,
        success_track_cron_job_general_response(asset)
    );
}