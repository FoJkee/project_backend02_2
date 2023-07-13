import jwt from 'jsonwebtoken'
import {UserType_Id, UserTypeId} from "../types/user-type";
import {ObjectId} from "mongodb";
import {jwtSecret} from "../db";



export const jwtService = {

    async createJwt(user: UserType_Id){

        const token = jwt.sign({userId: user._id}, jwtSecret, {expiresIn: '1h'})
        return token

    },

    async getUserByToken(token: string){

        try{
            const result: any = jwt.verify(token, jwtSecret)
            return result.userId
        } catch (error){
            return null
        }
    }

}