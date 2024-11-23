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
export const loadMoreProducts = async ({
	loading,
	offset,
	limit,
	setLoading,
	setOffset,
	setDisplayedProducts,
	mapToIMonitorCard,
	collection,
	query = {},
	fetchEbayData = false
}: LoadMoreProductsProps & { fetchEbayData?: boolean; query?: object }) => {
	if (loading) return;

	setLoading(true);

	// Calculate the new offset
	const nextOffset = offset + limit;

	try {
		// Fetch more products from the specified collection using the new offset and limit
		const additionalProducts = await fetchProducts<ISortingDoc>(collection, {
			...query,
			limit,
			skip: nextOffset, // Use skip for pagination
		});

		// Optional: Fetch eBay data for the new products
		let ebayProducts: IEbay[] = [];
		if (fetchEbayData) {
			ebayProducts = await fetchProducts<IEbay>('Ebay', { type: collectionToType[collection] });
		}

		// Merge eBay data with the additional products
		const processedProducts = additionalProducts.map((product) => {
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

		// Map the new products to the monitor card format
		const newProducts = processedProducts.map(mapToIMonitorCard);
		console.log(newProducts)

		// Update the state with the new products
		setDisplayedProducts((prevProducts) => [...prevProducts, ...newProducts]);

		// Update the offset for the next batch
		setOffset(nextOffset);
	} catch (error) {
		console.error("Error fetching more products:", error);
	} finally {
		// Reset loading state
		setLoading(false);
	}
};
