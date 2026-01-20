import { AppDataSource } from "../db"
import { User as User_model } from '../models/user'
import { User } from "../types"

export const createUser = async (user: User) => {
    await AppDataSource.createQueryBuilder()
        .insert()
        .into(User_model)
        .values(user)
        .execute()
}

export const updateUser = async (user: User) => {
    await AppDataSource.createQueryBuilder()
        .update(User_model)
        .set(user)
        .where("id = :id", { id: user.id })
        .execute()
}

export const getUserByID = async (id: string): Promise<User> => {
    const user = await AppDataSource.getRepository(User_model)
        .createQueryBuilder("user")
        .where("user.id = :id", { id })
        .getOne();

    return user as User;
}