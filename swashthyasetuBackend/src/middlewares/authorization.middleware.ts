import { NextFunction, Request, Response } from "express";
import { UserRole } from "../generated/prisma/enums";
import { ApiError } from "../utils/apiError.js";


export default function authorize(...roles:UserRole[]){
    return (
        req: Request,
        _res: Response,
        next: NextFunction
    ) => {
        if(!req.user){
            throw new ApiError(401,"Unauthorized");
        }
        if(!roles.includes(req.user.role)){
            throw new ApiError(403,"Forbidden");
        }
        next();
    }
}