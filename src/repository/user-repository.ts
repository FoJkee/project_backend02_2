import bcrypt from 'bcrypt'
import {ObjectId} from "mongodb";
import {UserType_Id, UserTypeId} from "../user-type";
import {userCollection} from "../db";


export const userRepository = {

    async getUser(){





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

    async getUserId(id: string): Promise<UserTypeId | null>{

        const getUser = await userCollection.findOne({_id: new ObjectId(id)})

        if(getUser) {

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


   async _generateHash(password: string, salt: string){
        const hash = await bcrypt.hash(password, salt)
       return hash
    },

    async deleteUserId(id: ObjectId): Promise<boolean> {

        const deleteUser = await userCollection.deleteOne({_id: id})
        return deleteUser.deletedCount === 1
    },

    async deleteUserAll(): Promise<boolean> {
        const deleteUserAll = await userCollection.deleteMany({})
        return deleteUserAll.deletedCount === 1



    }











}