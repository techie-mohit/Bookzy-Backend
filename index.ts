import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';   
import connectDb from './config/dbConnect';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import cartRoutes from './routes/cartRoutes';
import wishlistRoutes from './routes/wishlistRoutes';

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


// api endpoints
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);

app.listen(Port, ()=>{
    console.log(`Server is running on port ${Port}`);
    connectDb();
})