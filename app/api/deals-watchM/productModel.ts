import mongoose, { Document, Model, Schema, Types } from 'mongoose';

interface IElectronicsProduct extends Document {
    website: string;
    region: string;
    productName: string;
    price: number;
    rrp: number;
    stockAvailable: boolean;
    link: string;
    image: string;
    type: string;
    timestamp: Date;
    device: string;
    providerProduct: boolean;
}

const ElectronicsProductSchema = new Schema<IElectronicsProduct>({
    website: { type: String, required: true },
    region: { type: String, required: true },
    productName: { type: String, required: true },
    price: { type: Number, required: true },
    rrp: { type: Number, required: true },
    stockAvailable: { type: Boolean, required: true },
    link: { type: String, required: true },
    image: { type: String, required: true },
    type: { type: String, required: true },
    timestamp: { type: Date, required: true },
    device: { type: String, required: true },
    providerProduct: { type: Boolean, required: true },
});

// Define and export the model
export const ElectronicsProduct = mongoose.models.ElectronicsProduct || mongoose.model<IElectronicsProduct>('ElectronicsProduct', ElectronicsProductSchema, 'scraper.electronics');
export type { IElectronicsProduct };
