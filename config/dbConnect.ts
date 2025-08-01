import mongoose from 'mongoose';

const connectDb = async()=>{
    try{
        const connection = await mongoose.connect(process.env.MONGODB_URL as string);
        console.log("Database connected successfully");

    }
    catch(error){
        console.error('Database connection error:', error);
        process.exit(1); // Exit the process with failure
    }
}

export default connectDb;