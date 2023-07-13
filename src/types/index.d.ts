import {UserType_Id, UserTypeId} from "./user-type";


declare global {
    declare namespace Express {
        export interface Request {
            userId: UserTypeId | null
        }
    }
}
