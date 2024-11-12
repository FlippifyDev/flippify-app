'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Card from './RestockInfoCard'; // Assuming this component displays restock info
import { IRestockInfo } from '@/src/models/mongodb/monitors/restockinfo';
import fetchProducts from '@/src/services/mongodb/fetch-monitor-products';
import LayoutProductsSkeleton from '../../layout/LayoutProductsSkeleton';
import { IoSearch } from "react-icons/io5";

export default function RestockInfoPage() {
	const [products, setProducts] = useState<IRestockInfo[]>([]);
	const [displayedProducts, setDisplayedProducts] = useState<IRestockInfo[]>([]);
	const [loading, setLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [searchQueryToSubmit, setSearchQueryToSubmit] = useState<string>(''); // State for submitted search query
	const [offset, setOffset] = useState(0);
	const limit = 20; // Number of products to display at a time

	// Fetch all products initially
	useEffect(() => {
		async function loadProducts() {
			const restockInfoProducts = await fetchProducts<IRestockInfo>("RestockInfo");

			const updatedProducts = restockInfoProducts.map(product => {
				if (product.ebay_mean_price) {
					product.estimatedProfit = product.ebay_mean_price - (product.price || 0);
				} else {
					product.estimatedProfit = 0; // No eBay data available, set estimated profit to 0
				}
				return product;
			});

			setProducts(updatedProducts);
			setDisplayedProducts(sortByRoiStockAndTimestamp(updatedProducts).slice(0, limit)); // Display the first batch
		}

		loadProducts();
	}, []);

	// Function to sort products by timestamp and stock availability
	const sortByRoiStockAndTimestamp = (products: IRestockInfo[]) => {
		return products
			.sort((a, b) => {
				// Check if either product is missing essential data
				const missingDataA = !a.price || a.ebay_mean_price === undefined;
				const missingDataB = !b.price || b.ebay_mean_price === undefined;

				if (missingDataA && !missingDataB) return 1;  // Move products with missing data to the end
				if (!missingDataA && missingDataB) return -1; // Move products with missing data to the end

				// Check if stock is available
				const inStockA = a.stock_available ? 1 : 0;
				const inStockB = b.stock_available ? 1 : 0;

				// If stock status differs, prioritize in-stock products (true > false)
				if (inStockA !== inStockB) return inStockB - inStockA;

				// Compare by timestamp (most recent first)
				const timestampA = new Date(a.timestamp).getTime(); // Convert to timestamp if needed
				const timestampB = new Date(b.timestamp).getTime();

				if (timestampA !== timestampB) {
					return timestampB - timestampA; // Sort descending by timestamp (newest first)
				}

				// Calculate ROI for each product
				const roiA = a.estimatedProfit && a.price ? (a.estimatedProfit / a.price) : 0;
				const roiB = b.estimatedProfit && b.price ? (b.estimatedProfit / b.price) : 0;

				// Sort descending by ROI
				return roiB - roiA;
			});
	};

	const loadMoreProducts = useCallback(() => {
		if (loading) return; // Prevent further loading if it's already in progress

		const nextOffset = offset + limit; // Correctly increment the offset

		// Prevent loading if we already have all products
		if (offset >= products.length) return;

		setLoading(true);

		setTimeout(() => {
			setDisplayedProducts(prevProducts => {
				const newProducts = products.slice(nextOffset, nextOffset + limit);
				// Update the offset to the new position
				setOffset(nextOffset);

				// Stop loading and append new products
				setLoading(false);
				return [...prevProducts, ...newProducts];
			});
		}, 1000); // Simulate network delay
	}, [loading, offset, products, limit]);

	// Infinite scrolling logic
	useEffect(() => {
		const handleScroll = () => {
			if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight && !loading) {
				loadMoreProducts();
			}
		};

		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, [loading, loadMoreProducts]);

	// Filter products based on submitted search query
	useEffect(() => {
		let filtered = products;

		if (searchQueryToSubmit.trim() !== '') {
			const lowercasedQuery = searchQueryToSubmit.toLowerCase();
			filtered = products.filter(product => {
				const productName = product.product_name?.toLowerCase() || '';
				const website = product.website?.toLowerCase() || '';
				const region = product.region?.toLowerCase() || '';

				// Split the query into individual terms and check if any term matches
				const queryTerms = lowercasedQuery.split(/\s+/);

				return queryTerms.every(term =>
					productName.includes(term) ||
					website.includes(term) ||
					region.includes(term)
				);
			});
		} else {
			// If no search query, sort by estimated profit
			filtered = sortByRoiStockAndTimestamp(products);
		}

		// Reset pagination and display filtered products
		setOffset(0);
		setDisplayedProducts(filtered.slice(0, limit));
	}, [searchQueryToSubmit, products]);

	const handleSearchSubmit = () => {
		setSearchQueryToSubmit(searchQuery);
	};

	return (
		<div className="p-5 w-full h-full">
			{/* Search Input */}
			<label className="input input-bordered flex items-center gap-2 w-80 mb-8 text-xl">
				<input
					type="text"
					placeholder="Search"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							handleSearchSubmit();
						}
					}}
					className="grow border-0 input input-bordered"
				/>
				<IoSearch />
			</label>

			{/* Products List */}
			{displayedProducts.length > 0 ? (
				<div className="flex flex-wrap gap-10 justify-center p-4">
					{displayedProducts.map((product, index) => (
						<Card key={`${product._id.toString()}-${index}`} product={product} />
					))}
					{loading && <LayoutProductsSkeleton />}
				</div>
			) : (
				<LayoutProductsSkeleton />
			)}
		</div>
	);
}
