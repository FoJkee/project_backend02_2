import {BlogType_Id, BlogTypeId, Paginated} from "../blog-type";
import {Filter, ObjectId, Sort, SortDirection} from "mongodb";
import {blogRepository} from "../repository/blog-repository";
import {PostType_Id, PostTypeId} from "../post-type";
import {blogCollection, postCollection} from "../db";
import {postService} from "./post-service";
import {postRepository} from "../repository/post-repository";


export const blogService = {

    async getBlog(searchNameTerm: string, sortBy: Sort, sortDirection: SortDirection, pageNumber: number,
                  pageSize: number): Promise<Paginated<BlogTypeId>> {

        const filter: Filter<BlogType_Id> = {name: {$regex: searchNameTerm, $options: 'i'}}

        const settingBlog = await blogCollection
            .find(filter)
            .sort({sortBy: sortDirection})
            .skip(pageSize * (pageNumber - 1))
            .limit(pageSize)
            .toArray()

        const itemBlog: BlogTypeId[] = settingBlog.map(el => ({
            id: el._id.toString(),
            name: el.name,
            description: el.description,
            websiteUrl: el.websiteUrl,
            createdAt: el.createdAt,
            isMembership: el.isMembership
        }))

        const totalCount: number = await blogCollection.countDocuments(filter)
        const pagesCount: number = Math.ceil(totalCount / pageSize)

        return blogRepository.getBlog(itemBlog, totalCount, pagesCount, pageNumber, pageSize)

    },

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

    async getBlogForPost(pageNumber: number, pageSize: number, sortBy: Sort,
                         sortDirection: SortDirection, blogId: string): Promise<Paginated<PostTypeId>> {
        const result = await postCollection
            .find({blogId})
            .sort({sortBy: sortDirection})
            .skip(pageSize * (pageNumber - 1))
            .limit(pageSize)
            .toArray()

        const itemPostForBlog: PostTypeId[] = result.map(el => ({
            id: el._id.toString(),
            title: el.title,
            shortDescription: el.shortDescription,
            content: el.content,
            blogId: el.blogId,
            blogName: el.blogName,
            createdAt: el.createdAt

        }))

        const totalCount: number = await postCollection.countDocuments({blogId})
        const pagesCount: number = Math.ceil(totalCount / pageSize)

        return blogRepository.getBlogForPost(itemPostForBlog, totalCount, pagesCount, pageNumber, pageSize)
    },

    async createBlogForPost(title: string, shortDescription: string, content: string,
                            blogId: string): Promise<PostTypeId | null> {

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

    async getBlogForId(id: string): Promise<BlogTypeId | null> {
        return blogRepository.getBlogForId(id)
    },

    async updateBlogId(id: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
        return blogRepository.updateBlogId(id, name, description, websiteUrl)
    },

    async deleteBlogId(id: string): Promise<boolean> {
        return blogRepository.deleteBlogId(id)
    },

    async deleteBlogAll(): Promise<boolean> {
        return blogRepository.deleteBlogAll()
    }


}