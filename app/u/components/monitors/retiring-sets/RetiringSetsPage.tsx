'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Card from './RetiringSetsCard';
import { IRetiringSet } from '@/app/api/monitors/retiringSetsModel';
import { IEbay } from '@/app/api/monitors/ebayModel';
import { fetchProducts } from '@/app/api/monitors/fetchProducts';
import LayoutProductsSkeleton from '../../layout/LayoutProductsSkeleton';
import { IoSearch } from "react-icons/io5";

export default function RetiringSetsPage() {
    const [products, setProducts] = useState<IRetiringSet[]>([]);
    const [displayedProducts, setDisplayedProducts] = useState<IRetiringSet[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [searchQueryToSubmit, setSearchQueryToSubmit] = useState<string>(''); // State for submitted search query
    const [offset, setOffset] = useState(0);
    const limit = 20; // Number of products to display at a time

    // Fetch all products initially
    useEffect(() => {
        async function loadProducts() {
            const [allProducts, ebayProducts] = await Promise.all([
                // Query the products with stock available and that are on sale
                fetchProducts<IRetiringSet>("RetiringSet", {"stock_available": true, "price": { "$ne": null }, "$expr": { "$lt": ["$price", "$rrp"] }}),
                fetchProducts<IEbay>("Ebay", {"type": "Retiring-Sets-Deals"})
            ]);

            // Compare and update RetiringSet products with matching eBay products
            const updatedProducts = allProducts.map(product => {
                const matchingEbayProduct = ebayProducts.find(ebayProduct =>
                    ebayProduct.product_name.toLowerCase() === product.product_name.toLowerCase() &&
                    ebayProduct['region'].toLowerCase() === product['region'].toLowerCase()
                );

                // If a matching eBay product is found, calculate estimated profit using eBay data
                if (matchingEbayProduct) {
                    product.estimatedProfit = matchingEbayProduct.mean_price - (product.price || 0);
                    product.ebayMeanPrice = matchingEbayProduct.mean_price;
                    product.ebayMaxPrice = matchingEbayProduct.max_price;
                } else {
                    // Otherwise, use the default rrp - price for profit calculation
                    product.estimatedProfit = product.rrp - (product.price || 0);
                }
                return product;
            });

            // Update the state with the products and display the first batch sorted by profit and stock
            setProducts(updatedProducts);
            setDisplayedProducts(sortByProfitAndStock(updatedProducts).slice(0, limit));
        }

        loadProducts();
    }, []);

    // Function to sort products by estimated profit and stock availability
    const sortByProfitAndStock = (products: IRetiringSet[]) => {
        return products
            .sort((a, b) => {
                // Check if stock is available
                const inStockA = a.stock_available;
                const inStockB = b.stock_available;

                // Prioritize in-stock products
                if (inStockA && !inStockB) return -1;
                if (!inStockA && inStockB) return 1;

                // Calculate profit based on eBay mean price if available, otherwise use estimatedProfit
                const profitA = a.ebayMeanPrice !== undefined ? a.ebayMeanPrice - (a.price || 0) : a.estimatedProfit || 0;
                const profitB = b.ebayMeanPrice !== undefined ? b.ebayMeanPrice - (b.price || 0) : b.estimatedProfit || 0;

                // Sort descending by the calculated profit
                return profitB - profitA;
            })
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
                const sku = product.sku?.toLowerCase() || '';
                const region = product.region?.toLowerCase() || '';

                // Split the query into individual terms and check if any term matches
                const queryTerms = lowercasedQuery.split(/\s+/);

                return queryTerms.every(term => 
                    productName.includes(term) ||
                    website.includes(term) ||
                    sku.includes(term) ||
                    region.includes(term)
                );
            });
        } else {
            // If no search query, sort by estimated profit
            filtered = sortByProfitAndStock(products);
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
