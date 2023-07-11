import {UserType_Id} from "./user-type";


declare global {
    declare namespace Express {
        export interface Request {
            user: UserType_Id | null
        }
    }
}
