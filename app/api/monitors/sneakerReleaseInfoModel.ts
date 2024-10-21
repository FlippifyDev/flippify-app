import mongoose, { Document, Schema } from 'mongoose';



interface ICustomFields {
    Regions?: string[];
    "Number Of Raffles"?: string;
    "Style Code"?: string;
    "Price"?: number;
}


interface ISneakerReleaseInfo extends Document {
    _id: string;
    link: string;
    image: string;
    ping_sent: boolean;
    product_name: string;
    release_date: Date;
    send_ping: boolean;
    timestamp: Date;
    type: string;
    website: string;
    custom_fields: ICustomFields;
}


const customFieldsSchema = new Schema<ICustomFields>({
    Regions: { type: [String], default: [] },
    "Number Of Raffles": { type: String },
    "Style Code": { type: String },
    "Price": { type: Number }
}, { _id: false });

const sneakerReleaseInfoSchema = new Schema<ISneakerReleaseInfo>({
    _id: { type: String, required: true },
    link: { type: String, required: true },
    image: { type: String, required: true },
    ping_sent: { type: Boolean, required: true, default: false },
    product_name: { type: String, required: true },
    release_date: { type: Date, required: true },
    send_ping: { type: Boolean, required: true, default: false },
    timestamp: { type: Date, default: Date.now },
    type: { type: String, required: true },
    website: { type: String, required: true },
    custom_fields: { type: customFieldsSchema, required: true }
});


export const SneakerReleaseInfo = mongoose.models.SneakerReleaseInfo || mongoose.model<ISneakerReleaseInfo>('SneakerReleaseInfo', sneakerReleaseInfoSchema, 'scraper.sneaker-release-info');
export type { ISneakerReleaseInfo };