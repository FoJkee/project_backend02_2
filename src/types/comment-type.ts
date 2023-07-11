import {ObjectId, Sort, SortDirection} from "mongodb";

export type CommentType_Id = {
    _id: ObjectId,
    content: string,
    commentatorInfo: {
        userId: string,
        userLogin: string
    },
    createdAt: string
}

export type CommentTypeId = {id: string} & Omit<CommentType_Id, "_id">


export type QueryParamsCom = {
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: SortDirection,
}

