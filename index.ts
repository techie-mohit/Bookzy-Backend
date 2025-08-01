import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';   
import connectDb from './config/dbConnect';

dotenv.config({ override: true });

const Port = process.env.PORT || 8000;

const app= express();


const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials : true, // Allow credentials
}


app.use(cors(corsOptions));
app.use(express.json());    // it ensure data will be return in json format
app.use(bodyParser.json());   // parse body of the incoming request
app.use(cookieParser()); // Parse cookies

app.listen(Port, ()=>{
    console.log(`Server is running on port ${Port}`);
    connectDb();
})