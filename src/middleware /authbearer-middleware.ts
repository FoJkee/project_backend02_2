import {Request, Response, NextFunction} from "express";
import {jwtService} from "../application/jwt-service";
import {userService} from "../domen/user-service";
import {userRepository} from "../repository/user-repository";


export const authBearerMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.sendStatus(401)
        return
    }

    const token = req.headers.authorization.split(' ')[1]

    const userId = await jwtService.getUserByToken(token)

    if (userId) {
        req.userId = await userService.getUserId(userId)
        next()
    }
    res.sendStatus(401)
}