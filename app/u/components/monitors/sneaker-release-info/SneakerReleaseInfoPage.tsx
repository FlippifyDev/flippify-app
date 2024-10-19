'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Card from './SneakerReleaseInfoCard';
import { ISneakerReleaseInfo } from '@/app/api/monitors/sneakerReleaseInfoModel';
import { fetchProducts } from '@/app/api/monitors/fetchProducts';
import LayoutProductsSkeleton from '../../layout/LayoutProductsSkeleton';
import { IoSearch } from "react-icons/io5";

export default function SneakerReleaseInfoPage() {
    const [products, setProducts] = useState<ISneakerReleaseInfo[]>([]);
    const [displayedProducts, setDisplayedProducts] = useState<ISneakerReleaseInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [searchQueryToSubmit, setSearchQueryToSubmit] = useState<string>(''); // State for submitted search query
    const [offset, setOffset] = useState(0);
    const limit = 20; // Number of products to display at a time

    // Fetch all products initially
    useEffect(() => {
        async function loadProducts() {
            const allProducts = await fetchProducts<ISneakerReleaseInfo>("SneakerReleaseInfo");
            setProducts(allProducts);
            // Display products sorted by release date initially
            setDisplayedProducts(sortByReleaseDate(allProducts).slice(0, limit)); // Display the first batch
        }

        loadProducts();
    }, []);

    // Function to sort products by release date
    const sortByReleaseDate = (products: ISneakerReleaseInfo[]) => {
        return products.sort((a, b) => {
            return new Date(a.release_date).getTime() - new Date(b.release_date).getTime();
        });
    };

    const loadMoreProducts = useCallback(() => {
        if (loading) return; // Prevent further loading if it's already in progress
        
        const nextOffset = offset + limit; // Correctly increment the offset
        
        // Prevent loading if we already have all products
        if (nextOffset >= products.length) return;

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
            if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight && !loading) {
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
                const region = product.regions?.join(' ').toLowerCase() || ''; // Ensure regions are concatenated for search

                // Split the query into individual terms and check if any term matches
                const queryTerms = lowercasedQuery.split(/\s+/);

                return queryTerms.every(term => 
                    productName.includes(term) ||
                    website.includes(term) ||
                    region.includes(term)
                );
            });
        } else {
            // If no search query, sort by release date
            filtered = sortByReleaseDate(products);
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
                        <Card key={`${product._id}-${index}`} product={product} />
                    ))}
                    {loading && <LayoutProductsSkeleton />}
                </div>
            ) : (
                <LayoutProductsSkeleton />
            )}
        </div>
    );
}
