import { User } from "../types";
import { generateRandomUsername } from "../utils/utils";
import { createUser, getUserByID } from "../queries/user";

export const getOrCreateUser = async (user_param: User) => {
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