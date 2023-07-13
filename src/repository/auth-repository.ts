import {userCollection} from "../db";
import {UserMe, UserTypeId} from "../types/user-type";





export const authRepository = {

    async findLoginOrEmail(loginOrEmail: string) {
        const user = await userCollection.findOne({
            $or: [{login: loginOrEmail}, {email: loginOrEmail}]
        })
        return user
    },

}

