import mongoose from 'mongoose';
import { Document, Schema } from 'mongoose';


export interface ICardItem extends Document {
    productId:mongoose.Types.ObjectId;
    quantity: number;
}

export interface ICart extends Document{
    user: mongoose.Types.ObjectId;
    items: ICardItem[];
}


const cardItemSchema = new Schema<ICardItem>({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 }
})

const cartSchema = new Schema<ICart>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [cardItemSchema]
})


export default mongoose.model<ICart>('Cart', cartSchema);