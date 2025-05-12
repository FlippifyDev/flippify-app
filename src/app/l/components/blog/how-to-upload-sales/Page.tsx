"use client"

import React, { useEffect } from 'react'
import Hero from '../../dom/Hero'
import Image from 'next/image';

const Page = () => {

    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            const el = document.getElementById(hash.substring(1));
            if (el) {
                const yOffset = -100; // adjust based on your header height or margin
                const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        }
    }, []);
    return (
        <div className="min-h-screen w-full flex flex-col items-center overflow-x-auto scrollbar-hide">
            <div>
                <Hero
                    text={[
                        { text: "How to " },
                        { text: "upload", isGradient: true },
                        { text: "sales" }
                    ]}
                    description="Learn how to upload your sales data step-by-step using our CSV import tool. This guide walks you through formatting your spreadsheet, selecting the correct store type, and resolving common upload issues."
                    image="/blog/HowToUploadSales.svg"
                    imageAlt="Illustration showing the process of uploading sales data from a CSV file"
                    imageContainerClassName='pb-20 scale-125'
                    titleClassName="lg:w-3/5"
                />
            </div>

            <div className='max-w-6.5xl mx-auto px-6 sm:px-6 md:px-8 lg:px-10 xl:px-12 animate-fadeInBounce mt-[250px] xs:mt-[200px] sm:mt-[200px] md:mt-[250px] lg:mt-[270px] 2xl:mt-[320px]'>
                <h1 id="custom" className='text-3xl mb-5 font-semibold'>Custom Upload</h1>
                <p className='mb-5'>Think of the table below as a direct representation of a spreadsheet or CSV file you’ll be uploading. Each row corresponds to a column in your file—like "Title" or "Sale Price"—and each column in this table explains whether that field is required, what kind of data it should contain, and what value is used if it's left blank or not included. Use this guide to structure your spreadsheet correctly before uploading it.</p>
                <div className="bg-white flex flex-col border">
                    <table className="w-full">
                        {/* Table Header */}
                        <thead>
                            <tr className="border-b">
                                <th className="w-1/4 py-5 px-6 text-left text-gray-800 bg-gray-200 font-bold">Values</th>
                                <th className="w-1/4 py-5 px-6 text-center text-gray-700 bg-gray-50">
                                    <div className="text-xl font-bold">Required</div>
                                </th>
                                <th className="w-1/4 py-5 px-6 text-center text-gray-700 bg-gray-50">
                                    <div className="text-xl font-bold">Type</div>
                                </th>
                                <th className="w-1/4 py-5 px-6 text-center text-gray-700 bg-gray-50">
                                    <div className="text-xl font-bold">Default</div>
                                </th>
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody>
                            <tr className="border-b">
                                <td className="py-4 px-6 font-medium text-gray-800 bg-gray-100">
                                    Title
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">Yes</span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">Text</span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">None</span>
                                </td>
                            </tr>
                            <tr className="border-b">
                                <td className="py-4 px-6 font-medium text-gray-800 bg-gray-100">
                                    Item ID
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">No</span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">Text</span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">Random</span>
                                </td>
                            </tr>
                            <tr className="border-b">
                                <td className="py-4 px-6 font-medium text-gray-800 bg-gray-100">
                                    Transaction ID
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">No (Recommended)</span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">Text</span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">Random</span>
                                </td>
                            </tr>
                            <tr className="border-b">
                                <td className="py-4 px-6 font-medium text-gray-800 bg-gray-100">
                                    Order ID
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">No</span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">Text</span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">Random</span>
                                </td>
                            </tr>
                            <tr className="border-b">
                                <td className="py-4 px-6 font-medium text-gray-800 bg-gray-100">
                                    Sale Price
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">No</span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">Number</span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">null</span>
                                </td>
                            </tr>
                            <tr className="border-b">
                                <td className="py-4 px-6 font-medium text-gray-800 bg-gray-100">
                                    Sale Quantity
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">No</span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">Number</span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">1</span>
                                </td>
                            </tr>
                            <tr className="border-b">
                                <td className="py-4 px-6 font-medium text-gray-800 bg-gray-100">
                                    Sale Date
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">No (Recommended)</span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">Date</span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">Time of upload</span>
                                </td>
                            </tr>
                            <tr className="border-b">
                                <td className="py-4 px-6 font-medium text-gray-800 bg-gray-100">
                                    Sale Status
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">No</span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">Active | InProcess | Completed</span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">Completed</span>
                                </td>
                            </tr>
                            <tr className="border-b">
                                <td className="py-4 px-6 font-medium text-gray-800 bg-gray-100">
                                    Sale Marketplace
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">No</span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">Text</span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">null</span>
                                </td>
                            </tr>
                            <tr className="border-b">
                                <td className="py-4 px-6 font-medium text-gray-800 bg-gray-100">
                                    Sale Currency
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">No</span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">Text</span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">Your settings preference</span>
                                </td>
                            </tr>
                            <tr className="border-b">
                                <td className="py-4 px-6 font-medium text-gray-800 bg-gray-100">
                                    Purchase Price
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">No</span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">Number</span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">null</span>
                                </td>
                            </tr>
                            <tr className="border-b">
                                <td className="py-4 px-6 font-medium text-gray-800 bg-gray-100">
                                    Purchase Quantity
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">No</span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">Number</span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">1</span>
                                </td>
                            </tr>
                            <tr className="border-b">
                                <td className="py-4 px-6 font-medium text-gray-800 bg-gray-100">
                                    Purchase Date
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">No</span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">Date</span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">null</span>
                                </td>
                            </tr>
                            <tr className="border-b">
                                <td className="py-4 px-6 font-medium text-gray-800 bg-gray-100">
                                    Purchase Marketplace
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">No</span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">Text</span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">null</span>
                                </td>
                            </tr>
                            <tr className="border-b">
                                <td className="py-4 px-6 font-medium text-gray-800 bg-gray-100">
                                    Purchase Currency
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">No</span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">Text</span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">Your settings preference</span>
                                </td>
                            </tr>
                            <tr className="border-b">
                                <td className="py-4 px-6 font-medium text-gray-800 bg-gray-100">
                                    Shipping Fees
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">No</span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">Number</span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">null</span>
                                </td>
                            </tr>
                            <tr className="border-b">
                                <td className="py-4 px-6 font-medium text-gray-800 bg-gray-100">
                                    Shipping Service
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">No</span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">Text</span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">null</span>
                                </td>
                            </tr>
                            <tr className="border-b">
                                <td className="py-4 px-6 font-medium text-gray-800 bg-gray-100">
                                    Shipped At
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">No</span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">Date</span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">null</span>
                                </td>
                            </tr>
                            <tr className="border-b">
                                <td className="py-4 px-6 font-medium text-gray-800 bg-gray-100">
                                    Listing Date
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">No</span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">Date</span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">null</span>
                                </td>
                            </tr>
                            <tr className="border-b">
                                <td className="py-4 px-6 font-medium text-gray-800 bg-gray-100">
                                    Additional Fees
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">No</span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">Number</span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">null</span>
                                </td>
                            </tr>
                            <tr className="">
                                <td className="py-4 px-6 font-medium text-gray-800 bg-gray-100">
                                    Custom Tag
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">No</span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">Text</span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="text-gray-600">null</span>
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </div>

                <h2 className='mt-7 mb-5 text-2xl font-semibold'>Example CSV Document</h2>

                <div className="mb-12 border-2 border-white bg-gray-100/80 p-3 rounded-4xl shadow-lg">
                    <figure>
                        <Image
                            src="https://i.imgur.com/krM3B8i.png"
                            alt="Spreadsheet image of data to upload"
                            width={1500}
                            height={750}
                            loading="lazy"
                            className="rounded-3xl"
                        />
                    </figure>
                </div>
            </div>
        </div>
    )
}

export default Page
