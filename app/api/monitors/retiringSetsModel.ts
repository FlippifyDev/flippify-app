import mongoose, { Document, Model, Schema, Types } from 'mongoose';


interface IRetiringSet extends Document {
    _id: string;
    website: string;
    sku: string;
    link: string;
    'product-name': string;
    region: string;
    timestamp: Date;
    image: string;
    price: number;
    'retirement-date': string;
    rrp: number;
    'stock-available': boolean;
    type: string;
}

const retiringSetsSchema = new Schema<IRetiringSet>({
    _id: { type: String, required: true },
    website: { type: String, required: true },
    sku: { type: String, required: true },
    link: { type: String, required: true },
    'product-name': { type: String, required: true },
    region: { type: String, required: true },
    timestamp: { type: Date, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    'retirement-date': { type: String, required: true },
    rrp: { type: Number, required: true },
    'stock-available': { type: Boolean, required: true },
    type: { type: String, required: true },
});




export const RetiringSet: Model<IRetiringSet> = mongoose.models.RetiringSet || mongoose.model<IRetiringSet>('RetiringSet', retiringSetsSchema, 'scraper.retiring-sets-deals');
export type { IRetiringSet };
