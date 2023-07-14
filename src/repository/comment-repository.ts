import {ObjectId} from "mongodb";
import {CommentTypeId} from "../types/comment-type";
import {userCollection} from "../db";


export const commentRepository = {

    async getComId(content: string, userId: string): Promise<CommentTypeId | null> {
        const findComId = await userCollection.findOne({_id: new ObjectId(userId)})

        if (findComId) {
            return {
                id: findComId._id.toString(),
                content,
                commentatorInfo: {
                    userId: findComId!._id.toString(),
                    userLogin: findComId!.login
                },
                createdAt: findComId.createdAt
            }
        } else {
            return null
        }

    },

    async deleteCom(userId: string): Promise<boolean> {
        const deleteComment = await userCollection.deleteOne({_id: new ObjectId(userId)})
        return deleteComment.deletedCount === 1


    },

    async updateCom(content: string, userId: string) {
        const updateComment = await userCollection.updateOne({_id: new ObjectId(userId)},
            {
                $set: {
                    content
                }
            })
        return updateComment.matchedCount === 1

    }


}