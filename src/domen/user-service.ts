import {Filter, ObjectId, Sort, SortDirection} from "mongodb";
import {Paginated} from "../blog-type";
import {UserType_Id, UserTypeId} from "../user-type";
import {userCollection} from "../db";
import {userRepository} from "../repository/user-repository";
import bcrypt from "bcrypt";


export const userService = {


    async getUser(searchLoginTerm: string, searchEmailTerm: string, sortBy: Sort,
                  sortDirection: SortDirection, pageNumber: number, pageSize: number): Promise<Paginated<UserTypeId>> {

        const filter: Filter<UserType_Id> = {}
        if (searchLoginTerm || searchEmailTerm) {
            let filter = []

            if (searchLoginTerm) {
                filter.push({login: {$regex: {searchEmailTerm, $options: 'i'}}})
            }
            if (searchEmailTerm) {
                filter.push({email: {$regex: searchEmailTerm, $options: 'i'}})
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

        return userRepository.getUser(itemUser, pageNumber, pageSize, pagesCount, totalCount)

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
        return userRepository.createUser(userNew)

    },

    async getUserId(id: string): Promise<UserTypeId | null> {
        return userRepository.getUserId(id)

    },

    async _generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        return hash
    },

    async deleteUserId(id: string): Promise<boolean> {
        return userRepository.deleteUserId(id)
    },

    async deleteUserAll(): Promise<boolean> {
        return userRepository.deleteUserAll()
    }

}