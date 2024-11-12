import mongoose, { Document, Model, Schema } from 'mongoose';

// Interface to represent the shape of a product document
interface IProduct extends Document {
	"role-id": string;
	"role-id-server": string;
	"stripe-product-id": string;
	"stripe-product-id-server": string;
	"channel-id": string;
	"deal-type": string;
	"data-table": string;
	"subscription-name": string;
	"subscription-name-server": string;
	"regions": string[];
}

// Mongoose Schema for the product documents
const productSchema = new Schema<IProduct>({
	"role-id": { type: String, required: true },
	"role-id-server": { type: String, required: true },
	"stripe-product-id": { type: String, required: true },
	"stripe-product-id-server": { type: String, required: true },
	"channel-id": { type: String, required: true },
	"deal-type": { type: String, required: true },
	"data-table": { type: String, required: true },
	"subscription-name": { type: String, required: true },
	"subscription-name-server": { type: String, required: true },
	"regions": { type: [String], required: true },
});

// Create a Mongoose model based on the product schema
const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);


export { Product, productSchema };
export type { IProduct };