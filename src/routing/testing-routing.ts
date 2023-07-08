import {Response, Router, Request} from "express";
import {postRepository} from "../repository/post-repository";
import {blogRepository} from "../repository/blog-repository";
import {userRepository} from "../repository/user-repository";


export const testingRouter = Router()


testingRouter.delete('/all-data', async (req: Request, res: Response) => {
    await postRepository.deletePostAll()
    await blogRepository.deleteBlogAll()
    await userRepository.deleteUserAll()
    res.sendStatus(204)
})
