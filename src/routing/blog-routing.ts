import {Router, Request, Response} from "express";
import {blogMiddleware} from "../middleware /blog-middleware";
import {blogRepository} from "../repository/blog-repository";
import {errorsMiddleware} from "../middleware /errors-middleware";
import {authMiddleware} from "../middleware /auth-middleware";
import {QueryParamsBlog} from "../blog-type";
import {PostTypeId, QueryParamsPost} from "../post-type";
import {blogPostMiddleware} from "../middleware /blogPost-middleware";


export const blogRouter = Router()

blogRouter.get('/', async (req: Request<{}, {}, {}, QueryParamsBlog>, res: Response) => {

    const getBlog = await blogRepository.getBlog(
        req.query.searchNameTerm || '',
        req.query.sortBy || 'createdAt',
        req.query.sortDirection === 'asc' ? "asc" : "desc",
        Number(req.query.pageNumber) || 1,
        Number(req.query.pageSize) || 10
    )

    return res.status(200).json(getBlog)

})

blogRouter.post('/', authMiddleware, blogMiddleware, errorsMiddleware,
    async (req: Request, res: Response) => {

    const blogCreate = await blogRepository.createBlog(
        req.body.name, req.body.description, req.body.websiteUrl)

    return res.status(201).json(blogCreate)

})

blogRouter.get('/:id/posts', async (req: Request<PostTypeId, {}, {}, QueryParamsPost>, res: Response) => {
    const findBlogId = await blogRepository.getBlogForId(req.params.id)
    if (!findBlogId) {
        res.sendStatus(404)
        return
    }
    const blogIdPost = await blogRepository.getBlogForPost(
        Number(req.query.pageNumber) || 1,
        Number(req.query.pageSize) || 10,
        req.query.sortBy || 'createdAt',
        req.query.sortDirection || "desc" ? "desc" : "asc",
        req.params.id
    )

    if (blogIdPost) {
        res.status(200).json(blogIdPost)
        return
    }

})

blogRouter.post('/:id/posts', authMiddleware, blogPostMiddleware, errorsMiddleware,
    async (req: Request, res: Response) => {

        const findBlogId = await blogRepository.getBlogForId(req.params.id)
        if (!findBlogId) {
            res.sendStatus(404)
            return
        }
        const createBlogForPost = await blogRepository.createBlogForPost(
            req.body.title, req.body.shortDescription, req.body.content, req.params.id
        )

        if (createBlogForPost) {
            res.status(201).json(createBlogForPost)
            return
        }
    })

blogRouter.get('/:id', async (req: Request, res: Response) => {

    const blogGetId = await blogRepository.getBlogForId(req.params.id)
    if (blogGetId) {
        res.status(200).json(blogGetId)
    } else {
        res.sendStatus(404)
    }

})

blogRouter.put('/:id', authMiddleware, blogMiddleware, errorsMiddleware, async (req: Request, res: Response) => {

    const findBlogId = await blogRepository.getBlogForId(req.params.id)
    if (!findBlogId) {
        res.sendStatus(404)
    } else {
        res.status(204).json(findBlogId)
    }
    const blogPut = await blogRepository.updateBlogId(
        req.params.id,
        req.body.name,
        req.body.description,
        req.body.websiteUrl
    )
})
blogRouter.delete('/:id', authMiddleware, async (req: Request, res: Response) => {

    const findBlogId = await blogRepository.getBlogForId(req.params.id)
    if (!findBlogId) {
        res.sendStatus(404)
        return
    }

    const blogDeleteId = await blogRepository.deleteBlogId(req.params.id)
    res.sendStatus(204)

})


