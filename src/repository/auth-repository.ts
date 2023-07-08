import {userCollection} from "../db";
import {userRepository} from "./user-repository";


export const authRepository = {

    async createLogin(loginOrEmail: string, password: string): Promise<boolean> {
        const user = await userCollection.findOne({
            $or: [{login: {loginOrEmail}}, {email: {loginOrEmail}}]
        })

        if (!user) return false

        const passwordHash = await userRepository._generateHash(password, user.passwordSalt)
        if (user.passwordSalt !== passwordHash) {
            return false
        }
        return true

    }

}