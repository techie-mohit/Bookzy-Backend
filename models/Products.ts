import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document{
    title:string;
    images:string[];
    subject:string;
    category:string;
    condition: string;
    classType: string;
    price:number;
    author:string;
    edition?:string;
    description?: string;
    finalPrice:number;
    shippingCharge:string;
    seller:mongoose.Types.ObjectId;
    paymentMode:"UPI" | "Bank Account";
    paymentDetails: {
        upiId?:string;
        bankDetails?:{
            accountNumber:string;
            ifscCode:string;
            bankName: string;
        }
    } 

}


const productSchema = new Schema<IProduct>({
    title: { type: String, required: true },
    images: { type: [String], required: true },
    subject: { type: String, required: true },
    category: { type: String, required: true },
    condition: { type: String, required: true },
    classType: { type: String, required: true },
    price: { type: Number, required: true },
    author: { type: String, required: true },
    edition: { type: String },
    description: { type: String },
    finalPrice: { type: Number, required: true },
    shippingCharge: { type: String, required: true },
    seller: { type: Schema.Types.ObjectId, ref:'User',  required: true },
    paymentMode: { type: String, enum: ["UPI", "Bank Account"], required: true },
    paymentDetails: {
        upiId: { type: String },
        bankDetails: {
            accountNumber: { type: String },
            ifscCode: { type: String},
            bankName: { type: String}
        }
    }
}, {
    timestamps: true,
})

export default mongoose.model<IProduct>('Product', productSchema);