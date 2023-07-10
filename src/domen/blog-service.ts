import {BlogType_Id, BlogTypeId, Paginated} from "../blog-type";
import {ObjectId, Sort, SortDirection} from "mongodb";
import {blogRepository} from "../repository/blog-repository";
import {PostType_Id, PostTypeId} from "../post-type";
import {blogCollection} from "../db";


export const blogService = {

    async createBlog(name: string, description: string, websiteUrl: string): Promise<BlogTypeId> {

        const newBlog: BlogType_Id = {
            _id: new ObjectId(),
            name,
            description,
            websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }

        return blogRepository.createBlog(newBlog)


    },

    async createBlogForPost(title: string, shortDescription: string, content: string,
                            blogId: string): Promise<PostTypeId | null>{

        const createPostForBlog = await blogCollection.findOne({_id: new ObjectId(blogId)})
        if (!createPostForBlog) return null

        const createPostInBlog: PostType_Id = {
            _id: new ObjectId(),
            title,
            shortDescription,
            content,
            blogId: createPostForBlog._id.toString(),
            blogName: createPostForBlog.name,
            createdAt: new Date().toISOString()
        }
        return blogRepository.createBlogForPost(createPostInBlog, blogId)

    },






}