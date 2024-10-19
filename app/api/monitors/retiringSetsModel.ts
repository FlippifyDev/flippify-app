import mongoose, { Document, Model, Schema, Types } from 'mongoose';


interface IRetiringSet extends Document {
    _id: string;
    website: string;
    sku: string;
    link: string;
    product_name: string;
    region: string;
    timestamp: Date;
    image: string;
    price: number;
    retirement_date: string;
    rrp: number;
    stock_available: boolean;
    type: string;
    estimatedProfit?: number;
    ebayMeanPrice?: number;
    ebayMaxPrice?: number;
}

const retiringSetsSchema = new Schema<IRetiringSet>({
    _id: { type: String, required: true },
    website: { type: String, required: true },
    sku: { type: String, required: true },
    link: { type: String, required: true },
    product_name: { type: String, required: true },
    region: { type: String, required: true },
    timestamp: { type: Date, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    retirement_date: { type: String, required: true },
    rrp: { type: Number, required: true },
    stock_available: { type: Boolean, required: true },
    type: { type: String, required: true },
});




export const RetiringSet: Model<IRetiringSet> = mongoose.models.RetiringSet || mongoose.model<IRetiringSet>('RetiringSet', retiringSetsSchema, 'scraper.retiring-sets-deals');
export type { IRetiringSet };
