import mongoose from 'mongoose';
import { Document, Schema } from 'mongoose';


export interface IWishlist extends Document {
    user: mongoose.Types.ObjectId;
    products: mongoose.Types.ObjectId[];
}

const wishlistSchema = new Schema<IWishlist>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product', required: true }]
}, {
    timestamps: true
})

export default mongoose.model<IWishlist>('Wishlist', wishlistSchema);



