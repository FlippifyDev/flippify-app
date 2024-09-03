import mongoose, { Document, Schema } from 'mongoose';


interface IEbay extends Document {
    _id: string;
    link: string;
    'mean-price': number;
    'max-price': number;
    'product-name': string;
    region: string;
    timestamp: Date;
    website: string;
    type: string;
}


const ebaySchema = new Schema<IEbay>({
    _id: { type: String, required: true },
    link: { type: String, required: true },
    'mean-price': { type: Number, required: true },
    'max-price': { type: Number, required: true },
    'product-name': { type: String, required: true },
    region: { type: String, required: true },
    website: { type: String, required: true },
    timestamp: { type: Date, required: true },
    type: { type: String, required: true },
});


export const Ebay = mongoose.models.Ebay || mongoose.model<IEbay>('Ebay', ebaySchema, 'scraper.ebay');
export type { IEbay };