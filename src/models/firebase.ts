interface IOrder {
	additionalFees: number;
	buyerUsername: string;
	image: string;
	itemName: string;
	legacyItemId: string;
	listingDate: string;
	orderId: string;
	purchaseDate: string | null;
	quantitySold: number;
	recordType: string;
	saleDate: string;
	salePlatform: string;
	salePrice: number;
	shippingFees: number;
	purchasePrice: number | null;
	purchasePlatform: string | null;
	customTag: string;
}


interface IListing {
	dateListed: string;
	image: string;
	itemId: string;
	itemName: string;
	price: number;
	quantity: number;
	recordType: string;
}


interface IUserData {

}


interface IEbayTokenData {
	access_token: string;
	refresh_token: string;
	expires_in: number;
	error?: string;
	error_description?: string;
}



export type { IListing, IOrder, IUserData, IEbayTokenData }