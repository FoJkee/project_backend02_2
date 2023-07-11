import {authRepository} from "../repository/auth-repository";
import {userService} from "./user-service";


export const authService = {

    async checkCredentials(loginOrEmail: string, password: string): Promise<boolean> {
        const user = await authRepository.findLoginOrEmail(loginOrEmail)
        if (!user) return false

        const passwordHash = await userService._generateHash(password, user.passwordSalt)
        if (user.passwordSalt !== passwordHash) {
            return false
        }
        return true
    }

}