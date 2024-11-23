import { useCallback, useEffect, useState } from 'react';

import { loadProducts, loadMoreProducts } from '@/src/utils/monitors/load-products';
import { IMonitorCard, ISortingDoc } from '@/src/models/mongodb/monitors/monitor-card';
import LayoutProductsSkeleton from '../layout/LayoutProductsSkeleton';
import { filterBySearch } from '@/src/utils/monitors/filter';
import SearchBar from '../dom/search/SearchBar';
import Card from './Card';

interface MonitorPageProps {
	collection: string;
	sortType: string;
	query?: object;
	fetchEbayData?: boolean;
	mapToIMonitorCard: (value: ISortingDoc) => IMonitorCard;
}

const MonitorPage: React.FC<MonitorPageProps> = ({
	collection,
	sortType,
	query,
	fetchEbayData,
	mapToIMonitorCard,
}) => {
	const [loading, setLoading] = useState(false);
	const [products, setProducts] = useState<ISortingDoc[]>([]);
	const [searchQueryToSubmit, setSearchQueryToSubmit] = useState<string>('');
	const [displayedProducts, setDisplayedProducts] = useState<IMonitorCard[]>([]);

	// Used to set which and how many documents are to be loaded
	const [offset, setOffset] = useState(0);
	const limit = 20;

	const loadMoreProductsCallback = useCallback(() => {
		// Trigger loadMoreProducts when user scrolls near the bottom
		if (
			window.innerHeight + document.documentElement.scrollTop >=
			document.documentElement.offsetHeight - 10 &&
			!loading
		) {
			loadMoreProducts({
				loading,
				offset,
				limit,
				setLoading,
				setOffset,
				setDisplayedProducts,
				mapToIMonitorCard,
				collection,
				query,
				fetchEbayData,
			});
		}
	}, [loading, offset, limit, setLoading, setOffset, setDisplayedProducts, mapToIMonitorCard, collection, query, fetchEbayData]);

	// Handle infinite scrolling
	useEffect(() => {
		const handleScroll = () => {
			console.log("Running scroll")
			if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight && !loading) {
				loadMoreProductsCallback();
			}
		};

		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, [loading, loadMoreProductsCallback]);

	// Filter products by search and update displayed products
	useEffect(() => {
		const filtered = filterBySearch(searchQueryToSubmit, products, sortType) as ISortingDoc[];

		setOffset(0); // Reset the offset when search query changes
		setDisplayedProducts(filtered.map(mapToIMonitorCard).slice(0, limit));
	}, [sortType, searchQueryToSubmit, products, mapToIMonitorCard, limit]);

	// Initial loading of products
	useEffect(() => {
		loadProducts({
			setProducts,
			setDisplayedProducts,
			limit,
			mapToIMonitorCard,
			collection,
			fetchEbayData,
			query,
		});
	}, [sortType, limit, collection, fetchEbayData, query, mapToIMonitorCard]);

	return (
		<div className="w-full h-full flex flex-col items-center sm:justify-start">
			{/* Search Input */}
			<SearchBar setSearchQueryToSubmit={setSearchQueryToSubmit} />

			{/* Products List */}
			{displayedProducts.length > 0 ? (
				<div className="flex flex-wrap gap-10 justify-center">
					{displayedProducts.map((product, index) => (
						<Card key={`${product.header}-${index}`} data={product} />
					))}
					{loading && <LayoutProductsSkeleton />}
				</div>
			) : (
				<LayoutProductsSkeleton />
			)}
		</div>
	);
};

export default MonitorPage;
