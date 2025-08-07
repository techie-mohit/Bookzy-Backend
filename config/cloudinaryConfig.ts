import multer from "multer";
import { v2 as cloudinary , UploadApiOptions, UploadApiResponse} from "cloudinary";
import dotenv from "dotenv";
import { RequestHandler } from "express";

dotenv.config();


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
    api_key: process.env.CLOUDINARY_API_KEY as string,
    api_secret: process.env.CLOUDINARY_API_SECRET as string,
})


interface CustomFile extends Express.Multer.File{
    path:string;
}

const uploadToCloudinary = (file:CustomFile): Promise<UploadApiResponse> => {

    const options : UploadApiOptions = {
        resource_type: "image",
    }

    return new Promise((resolve, reject)=>{
        cloudinary.uploader.upload(file.path, options, (error, result)=>{
            if(error){
                return reject(error);
            }
            resolve(result as UploadApiResponse);
        })
    })
}


// Define a middleware to handle image uploads.
// - Accepts up to 4 files under the field name 'images'
// - Saves them in the 'uploads/' directory
// - Typed as Express RequestHandler for type safety in TypeScript
const multerMiddleware : RequestHandler = multer({dest: 'uploads/'}).array('images', 4);


export { multerMiddleware, uploadToCloudinary };

