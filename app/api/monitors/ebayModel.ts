import mongoose, { Document, Schema } from 'mongoose';


interface IEbay extends Document {
    _id: string;
    link: string;
    mean_price: number;
    max_price: number;
    product_name: string;
    region: string;
    timestamp: Date;
    website: string;
    type: string;
}


const ebaySchema = new Schema<IEbay>({
    _id: { type: String, required: true },
    link: { type: String, required: true },
    mean_price: { type: Number, required: true },
    max_price: { type: Number, required: true },
    product_name: { type: String, required: true },
    region: { type: String, required: true },
    website: { type: String, required: true },
    timestamp: { type: Date, required: true },
    type: { type: String, required: true },
});


export const Ebay = mongoose.models.Ebay || mongoose.model<IEbay>('Ebay', ebaySchema, 'scraper.ebay');
export type { IEbay };