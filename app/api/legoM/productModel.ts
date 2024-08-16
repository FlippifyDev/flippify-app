import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import mongooseLong from 'mongoose-long';

mongooseLong(mongoose);
const Long = Types.Long;


interface ILegoProduct extends Document {
    website: string;
    sku: string;
    link: string;
    productName: string; // Changed 'product-name' to 'productName' for better TS naming conventions
    region: string;
    timestamp: Date;
    image: string;
    price: number;
    retirementDate: string; // Consider using Date if you're converting the string to a Date object
    rrp: number;
    stockAvailable: boolean;
    type: string;
  }

const ProductSchema = new Schema<ILegoProduct>({
    website: { type: String, required: true },
    sku: { type: String, required: true },
    link: { type: String, required: true },
    productName: { type: String, required: true },
    region: { type: String, required: true },
    timestamp: { type: Date, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    retirementDate: { type: String, required: true },
    rrp: { type: Number, required: true },
    stockAvailable: { type: Boolean, required: true },
    type: { type: String, required: true },
});




export const LegoProduct = mongoose.model<ILegoProduct>('LegoProduct', ProductSchema, 'scraper.retiring-sets-deals');

