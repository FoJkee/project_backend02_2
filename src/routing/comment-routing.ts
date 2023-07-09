import {Response, Request, Router} from "express";
import {commentRepository} from "../repository/comment-repository";
import {authMiddleware} from "../middleware /auth-middleware";
import {errorsMiddleware} from "../middleware /errors-middleware";


export const commentRouter = Router()


commentRouter.get('/:id', async (req: Request, res: Response) => {
    const getComId = await commentRepository.getComId(req.params.id)
    if (getComId) {
        res.status(200).json(getComId)
    } else {
        res.sendStatus(404)
    }
})

commentRouter.delete('/:commentId', authMiddleware, async (req: Request, res: Response) => {
    const findComId = await commentRepository.getComId(req.params.id)
    if (!findComId) {
        res.sendStatus(404)
        return
    }

    const deleteComId = await commentRepository.deleteCom(req.params.id)
    if (!deleteComId) {
        res.sendStatus(403)
        return
    }
    res.sendStatus(204)

})

commentRouter.put('/:commentId', authMiddleware, errorsMiddleware, async (req: Request, res: Response) => {
    const findComId = await commentRepository.getComId(req.params.id)
    if (!findComId) {
        res.sendStatus(404)
    } else {
        res.status(204).json(findComId)
    }
    const comPut = await commentRepository.updateCom(req.body.content, req.params.id)
    if (!comPut) {
        res.sendStatus(403)
        return
    }

})