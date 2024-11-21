import mongoose, { Document, Schema } from 'mongoose';


interface IDealWatch extends Document {
	_id: string;
	product_name: string;
	price: number;
	website: string;
	image: string;
	provider_link: string;
	link: string;
	ebay_mean_price: number;
	ebay_median_price: number;
	ebay_min_price: number;
	ebay_max_price: number;
	ebay_link: string
	sold_last_7_days: number;
	sold_last_month: number;
	timestamp: Date;
	type: string;
	region: string;
	estimatedProfit?: number
}


const dealWatchSchema = new Schema<IDealWatch>({
	_id: { type: String, required: true },
	product_name: { type: String, required: true },
	price: { type: Number, required: true },
	website: { type: String, required: true },
	image: { type: String, required: true },
	provider_link: { type: String, required: true },
	link: { type: String, required: true },
	ebay_mean_price: { type: Number, required: true },
	ebay_median_price: { type: Number, required: true },
	ebay_min_price: { type: Number, required: true },
	ebay_max_price: { type: Number, required: true },
	ebay_link: { type: String, required: true },
	sold_last_7_days: { type: Number, required: true },
	sold_last_month: { type: Number, required: true },
	timestamp: { type: Date, default: Date.now, required: true },
	type: { type: String, required: true },
	region: { type: String, required: true },
	estimatedProfit: { type: Number, required: false },
});



export const DealWatch = mongoose.models.DealWatch || mongoose.model<IDealWatch>('DealWatch', dealWatchSchema, 'scraper.deal-watch');
export type { IDealWatch };