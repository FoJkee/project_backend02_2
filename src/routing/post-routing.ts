import {Router, Request, Response} from "express";
import {postRepository} from "../repository/post-repository";
import {QueryParamsPost} from "../post-type";
import {authMiddleware} from "../middleware /auth-middleware";
import {postMiddleware} from "../middleware /post-middleware";
import {errorsMiddleware} from "../middleware /errors-middleware";
import {CommentTypeId, QueryParamsCom} from "../comment-type";
import {commentMiddleware} from "../middleware /comment-middleware";


export const postRouter = Router()

postRouter.get('/:id/comments', async (req: Request<CommentTypeId, {}, {}, QueryParamsCom>, res: Response) => {
    const findPostId = await postRepository.getPostForId(req.params.id)
    if (!findPostId) {
        res.sendStatus(404)
        return
    }

    const postIdCom = await postRepository.getPostForComments(
        Number(req.query.pageNumber) || 1,
        Number(req.query.pageSize) || 10,
        req.query.sortBy || 'createdAt',
        req.query.sortDirection || 'desc',
        req.params.id
    )

    return res.status(200).json(postIdCom)

})
postRouter.post('/:id/comments', authMiddleware,commentMiddleware, errorsMiddleware,
    async (req: Request, res: Response) => {

    const findPostId = await postRepository.getPostForId(req.params.id)
    if (!findPostId) {
        res.sendStatus(404)
        return
    }

    const createPostForCom = await postRepository.createPostForComments(
        req.body.content, req.params.id
    )

       return  res.status(201).json(createPostForCom)




})


postRouter.get('/', async (req: Request<{}, {}, {}, QueryParamsPost>, res: Response) => {

    const getPost = await postRepository.getPost(
        req.query.pageNumber || 1,
        req.query.pageSize || 10,
        req.query.sortBy || 'createdAt',
        req.query.sortDirection || 'desc'
    )

    return res.status(200).json(getPost)

})

postRouter.post('/', authMiddleware, postMiddleware, errorsMiddleware, async (req: Request, res: Response) => {

    const createPost = await postRepository.createPost(
        req.body.title,
        req.body.shortDescription,
        req.body.content,
        req.body.blogId,
        req.body.blogName
    )
    return res.status(201).json(createPost)
})

postRouter.get('/:id', async (req: Request, res: Response) => {
    const findPostId = await postRepository.getPostForId(req.params.id)

    if (!findPostId) {
        res.sendStatus(404)
    } else {
        res.status(200).json(findPostId)
    }
})

postRouter.put('/:id', authMiddleware, errorsMiddleware, async (req: Request, res: Response) => {
    const findPostId = await postRepository.getPostForId(req.params.id)
    if (!findPostId) {
        res.sendStatus(404)

    } else {
        res.status(204).json(findPostId)
    }
    const updatePost = await postRepository.updatePost(
        req.body.title,
        req.body.shortDescription,
        req.body.content,
        req.body.blogId,
        req.params.id
    )

})

postRouter.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
    const findPostId = await postRepository.getPostForId(req.params.id)
    if (!findPostId) {
        res.sendStatus(404)
        return
    }

    const deletePost = await postRepository.deletePostId(req.params.id)
    return res.sendStatus(204)

})