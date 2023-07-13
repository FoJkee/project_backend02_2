import bcrypt from 'bcrypt'
import {Filter, ObjectId, Sort, SortDirection} from "mongodb";
import {UserMe, UserType_Id, UserTypeId} from "../types/user-type";
import {userCollection} from "../db";
import {Paginated} from "../types/blog-type";


export const userRepository = {

    async getUser(searchLoginTerm: string, searchEmailTerm: string, sortBy: string,
                  sortDirection: SortDirection, pageNumber: number, pageSize: number): Promise<Paginated<UserTypeId>> {

        const filter: Filter<UserType_Id> = {}
        if (searchLoginTerm || searchEmailTerm) {
            filter.$or = []

            if (searchLoginTerm) {
                filter.$or.push({login: {$regex: searchLoginTerm, $options: 'i'}})
            }
            if (searchEmailTerm) {
                filter.$or.push({email: {$regex: searchEmailTerm, $options: 'i'}})
            }
        }

        const settingUser = await userCollection
            .find(filter)
            .sort({[sortBy]: sortDirection})
            .skip(pageSize * (pageNumber - 1))
            .limit(pageSize)
            .toArray()

        const itemUser: UserTypeId[] = settingUser.map(el => ({
            id: el._id.toString(),
            login: el.login,
            email: el.email,
            createdAt: el.createdAt
        }))

        const totalCount = await userCollection.countDocuments(filter)
        const pagesCount = Math.ceil(totalCount / pageSize)

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


    },

    async getMe(id: string): Promise<UserMe | null> {

        const getUser = await userCollection.findOne({_id: new ObjectId(id)})

        if (getUser) {
            return {
                login: getUser.login,
                email: getUser.email,
                userId: getUser._id.toString()
            }
        } else {
            return null
        }
    },


}