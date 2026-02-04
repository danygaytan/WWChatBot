import WAWebJS from "whatsapp-web.js";
import { generateRandomUsername } from "../utils/utils";
import { createUser, getUserByID } from "../database/queries/user";
import { User } from "../utils/types";

export const getOrCreateUser = async (user_param: WAWebJS.Contact) => {
    const user_id = user_param.id.user; // ID provided by Whatsapp
    let user = await getUserByID(user_id);

    if (!user) {
        const user_query_input: User = {
            id: user_id,
            server: user_param.id.server,
            serialized_id: user_param.id._serialized,
            username: generateRandomUsername(),
            assets: []
        }
        await createUser(user_query_input);
        user = await getUserByID(user_id);
    }
    return user;
}