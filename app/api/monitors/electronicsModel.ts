import mongoose, { Document, Model, Schema, Types } from 'mongoose';


interface IElectronics extends Document {
    _id: string;
    website: string;
    region: string;
    'product-name': string;
    price: number;
    rrp: number;
    'stock-available': boolean;
    link: string;
    image: string;
    type: string;
    timestamp: Date;
    device: string;
    'provider-product': boolean;
}

const electronicsSchema = new Schema<IElectronics>({
    _id: { type: String, required: true },
    website: { type: String, required: true },
    region: { type: String, required: true },
    'product-name': { type: String, required: true },
    price: { type: Number, required: true },
    rrp: { type: Number, required: true },
    'stock-available': { type: Boolean, required: true },
    link: { type: String, required: true },
    image: { type: String, required: true },
    type: { type: String, required: true },
    timestamp: { type: Date, required: true },
    device: { type: String, required: true },
    'provider-product': { type: Boolean, required: true },
});




export const Electronics = mongoose.models.Electronics || mongoose.model<IElectronics>('Electronics', electronicsSchema, 'scraper.electronics');
export type { IElectronics };
