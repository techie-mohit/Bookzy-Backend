import { NextFunction, Request, Response } from "express";
import { response } from "../utils/responseHandler";
import jwt from "jsonwebtoken";

// globally for id     it is used to access the user id globally in typescript only
declare global{
    namespace Express{
        interface Request{
            id:string;
        }
    }
}

const authenticateMidddleware = async(req:Request, res:Response, next:NextFunction)=>{

    try {
        const token = req.cookies.accessToken;
    if(!token){
        return response(res, 401, "User not autheticated or token not available");
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
    if(!decode){
        return response(res, 401, "Invalid token or user not authenticated");
    }

    req.id = decode.userId;
    next();
    } catch (error) {
        console.log("Error in authentication middleware:", error);
        return response(res, 500, "Internal Server Error, Please Try Again Later");
        
    }

}

export default authenticateMidddleware;