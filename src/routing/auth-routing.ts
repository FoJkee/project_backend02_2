import {Response, Router, Request} from "express";
import {errorsMiddleware} from "../middleware /errors-middleware";
import {authService} from "../domen/auth-service";
import {jwtService} from "../application/jwt-service";


export const authRouter = Router({})


authRouter.post('/login', errorsMiddleware, async (req: Request, res: Response) => {

    const loginUser: any = await authService.checkCredentials(req.body.loginOrEmail, req.body.password)
    if (loginUser) {
        const token = await jwtService.createJwt(loginUser)
        res.status(200).json(token)

    } else {
        res.sendStatus(401)
    }
})

authRouter.get('/me', async (req: Request, res: Response) => {


})