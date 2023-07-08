import {ObjectId, Sort, SortDirection} from "mongodb";

export type UserType_Id = {
    _id: ObjectId,
    login: string,
    email: string,
    passwordHash: string,
    passwordSalt: string,
    createdAt: string
}

export type UserTypeId= {id: string} & Omit<UserType_Id, "_id" | 'passwordHash' | 'passwordSalt'>


export type QueryParamsUser = {
    pageNumber: number,
    pageSize: number,
    sortBy: Sort,
    sortDirection: SortDirection,
    searchLoginTerm: string,
    searchEmailTerm: string
}