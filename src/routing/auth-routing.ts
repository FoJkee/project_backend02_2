import {Response, Router, Request} from "express";
import {authRepository} from "../repository/auth-repository";
import {errorsMiddleware} from "../middleware /errors-middleware";


export const authRouter = Router()



authRouter.post('/login', errorsMiddleware, async (req: Request, res: Response) => {
    const loginUser = await authRepository.createLogin(req.body.loginOrEmail, req.body.password)
    if(!loginUser){
        res.sendStatus(401)
        return
    }
    res.status(200).json(loginUser)
    
})