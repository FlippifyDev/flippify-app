import { currencySymbols } from '@/config/currency-config';
import { IMarketListedItem } from '@/models/market-compare';
import { platformToImage } from '@/services/market-compare/utils';
import Image from 'next/image';
import React from 'react'

interface Props {
    platform: string,
    item: IMarketListedItem,
    currency: string;
}
const MarketItemListed: React.FC<Props> = ({ platform, item, currency }) => {
    if (!item) return;
    
    const currencySymbol = currencySymbols[currency];

    return (
        <div className='w-full p-4 flex items-center'>
            <div>
                <figure className="border-[3px] rounded-full p-2 w-12 h-12 flex justify-center items-center bg-white">
                    <Image
                        src={platformToImage[platform as keyof typeof platformToImage]}
                        alt="Platform Image"
                        width={30}
                        height={30}
                        loading="lazy"
                        className="rounded-full object-cove "
                    />
                </figure>
            </div>
            <div className='px-8 w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 items-center gap-4'>
                <div className='col-span-1 text-center'>
                    <p className='text-sm text-gray-500 font-semibold'>Listed</p>
                    <p className='font-bold'>{(item.amount ?? 0) > 30 ? `+30` : `${item?.amount}`}</p>
                </div>
                <div className='col-span-1 text-center'>
                    <p className='text-sm text-gray-500 font-semibold'>Free shipping count</p>
                    <p className='font-bold'>{(item.freeDelieveryAmount ?? 0) > 30 ? `+30` : `${item.freeDelieveryAmount}`}</p>
                </div>
                <div className='col-span-1 text-center'>
                    <p className='text-sm text-gray-500 font-semibold'>Min Price</p>
                    <p className='font-bold'>{currencySymbol}{item.price?.min}</p>
                </div>
                <div className='col-span-1 text-center'>
                    <p className='text-sm text-gray-500 font-semibold'>Max Price</p>
                    <p className='font-bold'>{currencySymbol}{item.price?.max}</p>
                </div>
                <div className='col-span-1 text-center'>
                    <p className='text-sm text-gray-500 font-semibold'>Median Price</p>
                    <p className='font-bold'>{currencySymbol}{item.price?.median}</p>
                </div>
                <div className='col-span-1 text-center'>
                    <p className='text-sm text-gray-500 font-semibold'>Mean Price</p>
                    <p className='font-bold'>{currencySymbol}{item.price?.mean}</p>
                </div>
            </div>
        </div>
    )
}

export default MarketItemListed
