import {Filter, ObjectId, Sort, SortDirection} from "mongodb";
import {PostType_Id, PostTypeId} from "../post-type";
import {postCollection} from "../db";
import e from "express";
import {machine} from "os";
import {Paginated} from "../blog-type";
import * as net from "net";

export const postRepository = {

    async getPost(pageNumber: number, pageSize: number, sortBy: Sort, sortDirection: SortDirection): Promise<Paginated<PostTypeId>> {

        const filter: Filter<PostType_Id> = {}

        const settingPost = await postCollection
            .find(filter)
            .sort({sortBy: sortDirection})
            .skip(pageSize * (pageNumber - 1))
            .limit(pageSize)
            .toArray()

        const itemPost: PostTypeId[] = settingPost.map(el => ({
            id: el._id.toString(),
            title: el.title,
            shortDescription: el.shortDescription,
            content: el.content,
            blogId: el.blogId,
            blogName: el.blogName,
            createdAt: el.createdAt
        }))

        const totalCount: number = await postCollection.countDocuments(filter)
        const pagesCount: number = Math.ceil(totalCount / pageSize)

        const resultPost: Paginated<PostTypeId> = {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: itemPost
        }
        return resultPost

    },

    async createPost(title: string, shortDescription: string, content: string, blogId: string, blogName: string): Promise<PostTypeId> {

        const newPost: PostType_Id = {
            _id: new ObjectId(),
            title,
            shortDescription,
            content,
            blogId,
            blogName,
            createdAt: new Date().toISOString()
        }
        const resultNewPost = await postCollection.insertOne(newPost)

        return {
            id: resultNewPost.insertedId.toString(),
            title: newPost.title,
            shortDescription: newPost.shortDescription,
            content: newPost.content,
            blogId: newPost.blogId,
            blogName: newPost.blogName,
            createdAt: newPost.createdAt
        }

    },
    async getPostForId(id: string): Promise<PostTypeId | null> {

        const findPostId = await postCollection.findOne({_id: new ObjectId(id)})

        if (findPostId) {
            return {
                id: findPostId._id.toString(),
                title: findPostId.title,
                shortDescription: findPostId.shortDescription,
                content: findPostId.content,
                blogId: findPostId.blogId,
                blogName: findPostId.blogName,
                createdAt: findPostId.createdAt
            }
        } else {

            return null
        }

    },

    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {

        const updatePostForId = await postCollection.updateOne({_id: new ObjectId(id)}, {
            $set: {
                title,
                shortDescription,
                content,
                blogId
            }
        })

        return updatePostForId.matchedCount === 1

    },

    async deletePostId(id: string): Promise<boolean> {
        const deletePostId = await postCollection.deleteOne({_id: new ObjectId(id)})
        return deletePostId.deletedCount === 1

    },

    async deletePostAll(){
        const deleteAll= await postCollection.deleteMany({})
        return deleteAll.deletedCount === 1

    }

}