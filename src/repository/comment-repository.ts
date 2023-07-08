import {ObjectId} from "mongodb";
import {CommentType} from "../comment-type";


export const commentRepository = {
    async getUser(id: string, content: string, userId: string, userLogin: string) {

        const findCom: CommentType = {
            _id: new ObjectId(),
            content,
            commentatorInfo: {
                userId,
                userLogin
            },
            createdAt: new Date().toISOString()
        }


    }


}