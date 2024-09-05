import mongoose, { Document, Schema } from 'mongoose';


interface IElectronics extends Document {
    _id: string;
    website: string;
    region: string;
    product_name: string;
    price: number;
    rrp: number;
    stock_available: boolean;
    link: string;
    image: string;
    type: string;
    timestamp: Date;
    device: string;
    provider_product: boolean;
    estimatedProfit?: number;
    ebayMeanPrice?: number;
    ebayMaxPrice?: number;
}

const electronicsSchema = new Schema<IElectronics>({
    _id: { type: String, required: true },
    website: { type: String, required: true },
    region: { type: String, required: true },
    product_name: { type: String, required: true },
    price: { type: Number, required: true },
    rrp: { type: Number, required: true },
    stock_available: { type: Boolean, required: true },
    link: { type: String, required: true },
    image: { type: String, required: true },
    type: { type: String, required: true },
    timestamp: { type: Date, required: true },
    device: { type: String, required: true },
    provider_product: { type: Boolean, required: true }
});




export const Electronics = mongoose.models.Electronics || mongoose.model<IElectronics>('Electronics', electronicsSchema, 'scraper.electronics');
export type { IElectronics };
