import { AppDataSource } from "../db"
import { User } from '../models/user'
import { User_STRUCT } from "../types"

export const createUser = async (user: User_STRUCT) => {
    await AppDataSource.createQueryBuilder()
        .insert()
        .into(User)
        .values(user)
        .execute()
}

export const updateUser = async (user: User_STRUCT) => {
    await AppDataSource.createQueryBuilder()
        .update(User)
        .set(user)
        .where("id = :id", { id: user.id })
        .execute()
}

export const getUserByID = async (id: string) => {
    return await AppDataSource.getRepository(User)
        .createQueryBuilder("user")
        .where("user.id = :id", { id })
        .getOne();
}