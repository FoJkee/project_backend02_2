import {Router, Request, Response} from "express";
import {blogMiddleware} from "../middleware /blog-middleware";
import {blogRepository} from "../repository/blog-repository";
import {errorsMiddleware} from "../middleware /errors-middleware";
import {authMiddleware} from "../middleware /auth-middleware";
import {QueryParamsBlog} from "../types";


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

blogRouter.post('/', authMiddleware, blogMiddleware, errorsMiddleware, async (req: Request, res: Response) => {

    const blogCreate = await blogRepository.createBlog(
        req.body.name, req.body.description, req.body.websiteUrl)

    return res.status(201).json(blogCreate)

})
