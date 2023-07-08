import bcrypt from 'bcrypt'
import {Filter, ObjectId, Sort, SortDirection} from "mongodb";
import {UserType_Id, UserTypeId} from "../user-type";
import {userCollection} from "../db";
import {Paginated} from "../blog-type";


export const userRepository = {

    async getUser(searchLoginTerm: string, searchEmailTerm: string, sortBy: Sort,
                  sortDirection: SortDirection, pageNumber: number, pageSize: number): Promise<Paginated<UserTypeId>> {

        const filter: Filter<UserType_Id> = {}
        if (searchLoginTerm || searchEmailTerm) {
            let filter = []

            if (searchLoginTerm) {
                filter.push({login: {$regex: {searchEmailTerm, $options: 'i'}}})
            }
            if(searchEmailTerm){
                filter.push({email:{$regex: searchEmailTerm, $options: 'i'}})
            }
        }

        const settingUser = await userCollection
            .find(filter)
            .sort({sortBy: sortDirection})
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


    async createUser(login: string, password: string, email: string): Promise<UserTypeId> {

        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)

        const userNew: UserType_Id = {
            _id: new ObjectId(),
            login,
            email,
            passwordHash,
            passwordSalt,
            createdAt: new Date().toISOString()
        }

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


    async _generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        return hash
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