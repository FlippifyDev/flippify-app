'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Card from './ElectronicsCard';
import { IElectronics } from '@/app/api/monitors/electronicsModel';
import { IEbay } from '@/app/api/monitors/ebayModel';
import { fetchProducts } from '@/app/api/monitors/fetchProducts';
import LayoutProductsSkeleton from '../../layout/LayoutProductsSkeleton';
import { IoSearch } from "react-icons/io5";



export default function ElectronicsPage() {
  const [products, setProducts] = useState<IElectronics[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<IElectronics[]>([]);
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
        fetchProducts<IElectronics>("Electronics", {"stock_available": true, "$expr": { "$lt": ["$price", "$rrp"] }}),
        fetchProducts<IEbay>("Ebay", {"type": "Electronics"})
      ]);

      const updatedProducts = allProducts.map(product => {
        const matchingEbayProduct = ebayProducts.find(ebayProduct =>
          ebayProduct.product_name.toLowerCase() === product.product_name.toLowerCase() &&
          ebayProduct['region'].toLowerCase() === product['region'].toLowerCase()
        );

        if (matchingEbayProduct) {
            product.estimatedProfit = matchingEbayProduct.mean_price - (product.price || 0);
            product.ebayMeanPrice = matchingEbayProduct.mean_price;
            product.ebayMaxPrice = matchingEbayProduct.max_price;
        } else {
            product.estimatedProfit = product.rrp - (product.price || 0);
        }
        return product;
      });

      setProducts(updatedProducts);
      setDisplayedProducts(sortByRoiAndStock(updatedProducts).slice(0, limit)); // Display the first batch
    }

    loadProducts();
  }, []);

  // Function to sort products by ROI and stock availability
  const sortByRoiAndStock = (products: IElectronics[]) => {
    return products
      .sort((a, b) => {
        // Check if either product is missing essential data
        const missingDataA = !a.price || !a.rrp || a.ebayMeanPrice === undefined || a.ebayMaxPrice === undefined;
        const missingDataB = !b.price || !b.rrp || b.ebayMeanPrice === undefined || b.ebayMaxPrice === undefined;
  
        if (missingDataA && !missingDataB) return 1;  // Move products with missing data to the end
        if (!missingDataA && missingDataB) return -1; // Move products with missing data to the end
  
        // Check if stock is available
        const inStockA = a.stock_available ? 1 : 0;
        const inStockB = b.stock_available ? 1 : 0;
  
        // If stock status differs, prioritize in-stock products (true > false)
        if (inStockA !== inStockB) return inStockB - inStockA;
  
        // Calculate ROI for each product
        const roiA = a.estimatedProfit && a.price ? (a.estimatedProfit / a.price) : 0;
        const roiB = b.estimatedProfit && b.price ? (b.estimatedProfit / b.price) : 0;
  
        // If both have the same ROI, no need to re-sort by stock as it's handled above
        if (roiA === roiB) return 0;
  
        // Sort descending by ROI
        return roiB - roiA;
      });
  };;

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
        const device = product.device?.toLowerCase() || '';
        const region = product.region?.toLowerCase() || '';

        // Split the query into individual terms and check if any term matches
        const queryTerms = lowercasedQuery.split(/\s+/);

        return queryTerms.every(term => 
          productName.includes(term) ||
          website.includes(term) ||
          device.includes(term) ||
          region.includes(term)
        );
      });
    } else {
      // If no search query, sort by estimated profit
      filtered = sortByRoiAndStock(products);
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
