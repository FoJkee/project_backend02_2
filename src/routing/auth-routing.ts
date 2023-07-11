import {Response, Router, Request} from "express";
import {errorsMiddleware} from "../middleware /errors-middleware";
import {authService} from "../domen/auth-service";


export const authRouter = Router({})



authRouter.post('/login', errorsMiddleware, async (req: Request, res: Response) => {

    const loginUser = await authService.checkCredentials(req.body.loginOrEmail, req.body.password)
    if(!loginUser){
        res.sendStatus(401)
        return
    }
    res.status(200).json(loginUser)
    
})