import bcrypt from 'bcrypt'
import {Filter, ObjectId, Sort, SortDirection} from "mongodb";
import {UserType_Id, UserTypeId} from "../user-type";
import {userCollection} from "../db";
import {Paginated} from "../blog-type";


export const userRepository = {

    async getUser( itemUser: UserTypeId[], pageNumber: number,
                   pageSize: number, pagesCount: number, totalCount: number): Promise<Paginated<UserTypeId>> {

        const resultUser: Paginated<UserTypeId> = {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: itemUser
        }
        return resultUser

    },

    async createUser(userNew: UserType_Id): Promise<UserTypeId> {

        const resultUserNew = await userCollection.insertOne(userNew)

        return {
            id: resultUserNew.insertedId.toString(),
            login: userNew.login,
            email: userNew.email,
            createdAt: userNew.createdAt
        }
    },

    async getUserId(id: string): Promise<UserTypeId | null> {

        const getUser = await userCollection.findOne({_id: new ObjectId(id)})

        if (getUser) {

            return {
                id: getUser._id.toString(),
                login: getUser.login,
                email: getUser.email,
                createdAt: getUser.createdAt
            }
        } else {
            return null
        }
    },

    async deleteUserId(id: string): Promise<boolean> {

        const deleteUser = await userCollection.deleteOne({_id: new ObjectId(id)})
        return deleteUser.deletedCount === 1
    },

    async deleteUserAll(): Promise<boolean> {
        const deleteUserAll = await userCollection.deleteMany({})
        return deleteUserAll.deletedCount === 1


    }


}