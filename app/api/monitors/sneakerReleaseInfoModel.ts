import mongoose, { Document, Schema } from 'mongoose';


interface ISneakerReleaseInfo extends Document {
    _id: string;
    link: string;
    image: string;
    no_raffles: number;
    ping_sent: boolean;
    product_name: string;
    regions: string[];
    release_date: Date;
    send_ping: boolean;
    timestamp: Date;
    type: string;
    website: string;
}

const sneakerReleaseInfoSchema = new Schema<ISneakerReleaseInfo>({
    _id: { type: String, required: true },
    link: { type: String, required: true },
    image: { type: String, required: true },
    no_raffles: { type: Number, required: true, default: 0 },
    ping_sent: { type: Boolean, required: true, default: false },
    product_name: { type: String, required: true },
    regions: { type: [String], required: true },
    release_date: { type: Date, required: true },
    send_ping: { type: Boolean, required: true, default: false },
    timestamp: { type: Date, default: Date.now },
    type: { type: String, required: true },
    website: { type: String, required: true }
});


export const SneakerReleaseInfo = mongoose.models.SneakerReleaseInfo || mongoose.model<ISneakerReleaseInfo>('SneakerReleaseInfo', sneakerReleaseInfoSchema, 'scraper.sneaker-release-info');
export type { ISneakerReleaseInfo };