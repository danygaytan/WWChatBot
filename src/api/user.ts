import { createUser, getUserByID } from "../queries/user";
import { User_STRUCT } from "../types";
import { generateRandomUsername } from "../utils/utils";

export const getOrCreateUser = async (user_param: User_STRUCT) => {
    let user = await getUserByID(user_param.id);
    if (!user) {
        const user_query_input = {
            ...user_param,
            username: generateRandomUsername()
        }
        await createUser(user_query_input);
        user = await getUserByID(user_param.id);
    }
    return user;
}