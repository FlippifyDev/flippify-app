import mongoose, { Document, Schema } from 'mongoose';


interface IRestockInfo extends Document {
	_id: string;
	product_code: string;
	product_name: string;
	link: string;
	image: string;
	website: string;
	price: number;
	stock_available: boolean;
	stock_level: string;
	maxOrderQuantity: number;
	release_date: string;
	ebay_mean_price: number;
	sold_last_7_days: number;
	sold_last_month: number;
	timestamp: Date;
	ebay_link: string;
	type: string;
	region: string;
	estimatedProfit?: number;
}

const restockInfoSchema = new Schema<IRestockInfo>({
	_id: { type: String, required: true },
	product_code: { type: String, required: true },
	product_name: { type: String, required: true },
	link: { type: String, required: true },
	image: { type: String, required: true },
	website: { type: String, required: true },
	price: { type: Number, required: true },
	stock_available: { type: Boolean, required: true },
	stock_level: { type: String, required: true },
	maxOrderQuantity: { type: Number, required: true },
	release_date: { type: String, required: true },
	ebay_mean_price: { type: Number, required: true },
	sold_last_7_days: { type: Number, required: true },
	sold_last_month: { type: Number, required: true },
	timestamp: { type: Date, required: true },
	ebay_link: { type: String, required: true },
	type: { type: String, required: true },
	region: { type: String, required: true },
	estimatedProfit: { type: Number, required: false }
});


export const RestockInfo = mongoose.models.RestockInfo || mongoose.model<IRestockInfo>('RestockInfo', restockInfoSchema, 'scraper.restock-info');
export type { IRestockInfo };