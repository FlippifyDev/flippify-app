import { sortByRoiStockAndTimestamp } from "./sorting";
import { IMonitorCard, ISortingDoc } from "@/src/models/mongodb/monitors/monitor-card";
import fetchProducts from "@/src/services/mongodb/fetch-monitor-products";
import { IEbay } from "@/src/models/mongodb/monitors/ebay";
import { collectionToType } from "../mapping-text";


interface LoadProductsProps {
	setProducts: React.Dispatch<React.SetStateAction<ISortingDoc[]>>;
	setDisplayedProducts: React.Dispatch<React.SetStateAction<IMonitorCard[]>>;
	limit: number;
	mapToIMonitorCard: (product: ISortingDoc) => IMonitorCard;
	collection: string;
	query?: object;
}


interface LoadMoreProductsProps {
	loading: boolean;
	offset: number;
	limit: number;
	products: ISortingDoc[];
	collection: string;
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
	setOffset: React.Dispatch<React.SetStateAction<number>>;
	setDisplayedProducts: React.Dispatch<React.SetStateAction<IMonitorCard[]>>;
	mapToIMonitorCard: (product: ISortingDoc) => IMonitorCard;
}


// Function to load products initially and update the displayed products
export const loadProducts = async ({
	setProducts,
	setDisplayedProducts,
	limit,
	mapToIMonitorCard,
	collection,
	fetchEbayData = false,
	query = {}
}: LoadProductsProps & { fetchEbayData?: boolean }) => {
	// Fetch the main collection products using fetchProducts
	const allProducts = await fetchProducts<ISortingDoc>(collection, query);

	// If we need eBay data, fetch it using the fetchProducts function
	let ebayProducts: IEbay[] = [];
	if (fetchEbayData) {
		ebayProducts = await fetchProducts<IEbay>('Ebay', { type: collectionToType[collection] });
	}

	// Merge eBay data with the product data
	const updatedProducts = allProducts.map((product) => {
		// Try to find the matching eBay product by product_name and region
		const matchingEbayProduct = ebayProducts.find(
			(ebayProduct) =>
				ebayProduct.product_name.toLowerCase() === product.product_name.toLowerCase() &&
				ebayProduct.region.toLowerCase() === product.region.toLowerCase()
		);

		// If a match is found, calculate estimated profit
		if (matchingEbayProduct) {
			product.estimatedProfit = matchingEbayProduct.mean_price - (product.price || 0);
			product.ebay_mean_price = matchingEbayProduct.mean_price;
			product.ebay_max_price = matchingEbayProduct.max_price;
		} else {
			// If no matching eBay product, default to estimated profit
			product.estimatedProfit = product.estimatedProfit ?? (product.ebay_mean_price - (product.price || 0));
		}
		return product;
	});

	// Set the products in the state
	setProducts(updatedProducts);

	// Sort and map the products to the monitor card format, then display the first batch
	const monitorCards = sortByRoiStockAndTimestamp(updatedProducts)
		.map(mapToIMonitorCard)
		.slice(0, limit);

	setDisplayedProducts(monitorCards);
};


// This function handles loading more products when necessary
export const loadMoreProducts = ({
	loading,
	offset,
	limit,
	products,
	setLoading,
	setOffset,
	setDisplayedProducts,
	mapToIMonitorCard,
	collection,
	fetchEbayData = false
}: LoadMoreProductsProps & { fetchEbayData?: boolean }) => {
	if (loading) return;

	const nextOffset = offset + limit;

	// Check if we have more products to load
	if (nextOffset >= products.length) return;

	setLoading(true);

	setTimeout(async () => {
		// Fetch additional eBay products if needed
		let ebayProducts: IEbay[] = [];
		if (fetchEbayData) {
			ebayProducts = await fetchProducts<IEbay>('Ebay', { type: collectionToType[collection] });
		}

		setDisplayedProducts((prevProducts) => {
			// Slice the next set of products from the list
			const newProducts = products.slice(nextOffset, nextOffset + limit).map((product) => {
				// Match with eBay products if needed
				if (fetchEbayData) {
					const matchingEbayProduct = ebayProducts.find(
						(ebayProduct) =>
							ebayProduct.product_name.toLowerCase() === product.product_name.toLowerCase() &&
							ebayProduct.region.toLowerCase() === product.region.toLowerCase()
					);

					// If a match is found, calculate estimated profit
					if (matchingEbayProduct) {
						product.estimatedProfit = matchingEbayProduct.mean_price - (product.price || 0);
						product.ebayMeanPrice = matchingEbayProduct.mean_price;
						product.ebayMaxPrice = matchingEbayProduct.max_price;
					}
				}
				return mapToIMonitorCard(product);
			});

			// Update offset and reset loading state
			setOffset(nextOffset);
			setLoading(false);

			return [...prevProducts, ...newProducts]; // Append new products
		});
	}, 1000);
};
