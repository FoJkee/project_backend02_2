import {CommentType_Id, CommentTypeId} from "../comment-type";
import {commentCollection, postCollection, userCollection} from "../db";
import {Filter, ObjectId, Sort, SortDirection} from "mongodb";
import {postRepository} from "../repository/post-repository";
import {PostType_Id, PostTypeId} from "../post-type";
import {Paginated} from "../blog-type";


export const postService = {

    async getPostForComments(pageNumber: number, pageSize: number,
                             sortBy: Sort, sortDirection: SortDirection, postId: string): Promise<Paginated<CommentTypeId>> {

        const settingComForPost: CommentType_Id[] = await commentCollection
            .find({postId})
            .sort({sortBy: sortDirection})
            .skip(pageSize * (pageNumber - 1))
            .limit(pageSize)
            .toArray()

        const itemCom: CommentTypeId[] = settingComForPost.map(el => ({
            id: el._id.toString(),
            content: el.content,
            commentatorInfo: el.commentatorInfo,
            createdAt: el.createdAt
        }))

        const totalCount: number = await commentCollection.countDocuments({postId})
        const pagesCount: number = Math.ceil(totalCount / pageSize)

        return postRepository.getPostForComments(itemCom, pageNumber, pageSize, totalCount, pagesCount)

    },

    async createPostForComments(content: string, postId: string): Promise<CommentTypeId | null> {
        const createComForPost = await userCollection.findOne({_id: new ObjectId(postId)})
        if (!createComForPost) return null

        const createComInPost: CommentType_Id = {
            _id: new ObjectId(),
            content,
            commentatorInfo: {
                userId: createComForPost._id.toString(),
                userLogin: createComForPost.login,
            },
            createdAt: new Date().toISOString()
        }

        return postRepository.createPostForComments(createComInPost)

    },

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

        return postRepository.getPost(itemPost, pagesCount, pageNumber, pageSize, totalCount)

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
        return postRepository.createPost(newPost)

    },

    async getPostForId(id: string): Promise<PostTypeId | null> {
        return postRepository.getPostForId(id)
    },

    async updatePost(id: string, title: string, shortDescription: string,
                     content: string, blogId: string): Promise<boolean> {

        return postRepository.updatePost(id, title, shortDescription, content, blogId)
    },

    async deletePostId(id: string): Promise<boolean> {
        return postRepository.deletePostId(id)

    },
    async deletePostAll() {
        return postRepository.deletePostAll()
    }

}