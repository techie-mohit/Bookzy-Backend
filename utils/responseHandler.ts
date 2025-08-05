import { Response } from "express";

export const response = (res:Response, statusCode:number, message:string, data?:any)=>{     // ? this indicate in data is data may pass by caller or not it is an optional because at the time error no data is passed
    res.status(statusCode).json({
        success: statusCode>=200 && statusCode<300,
        message: message,
        data: data || null     // If no data is provided, default to null
    })
};

