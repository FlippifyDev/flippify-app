import React from 'react';
import Image from 'next/image';
import { IRetiringSet } from '@/app/api/monitors/retiringSetsModel';
import Link from 'next/link';
import AnimationArrow from '../../../components/AnimationArrow';

interface CardProps {
  product: IRetiringSet;
}

const RetiringSetsCard: React.FC<CardProps> = ({ product }) => {
  let estimatedProfit;
  let price;

  if (product.price !== null) {
    estimatedProfit = product.rrp - product.price
    price = "£" + product.price.toString() 
  } else {
    estimatedProfit = 0
    price = "Not Found"
  }

  const profitClass = estimatedProfit > 0 ? 'text-green-500 font-semibold' : 'text-red-500 font-semibold';
  const stockAvailable = product.stock_available ? "In Stock" : "Out of Stock";
  const stockClass = stockAvailable === "In Stock" ? 'mt-2 p-2 text-sm text-green-500 font-semibold' : 'p-2 text-sm text-red-500 font-semibold';

  return (
    <div className="grid grid-rows-10 bg-white shadow-lg rounded-lg overflow-hidden w-86 p-2 h-[28rem]">
      {/* Title Section */}
      <div className='row-span-3 grid grid-cols-12 p-2 gap-2'>
        <div className='col-span-8'>
          <h5 className='text-sm mb-2'>{product.website} {product.region.toUpperCase()}</h5>
          <h2 className='text-lg font-semibold'>{product.product_name}</h2>
          
        </div>
        <div tabIndex={0} role="button" className="flex items-start avatar col-span-4">
          <div className="w-24 rounded-lg border-2">
            <Image src={product.image} alt={product.product_name} width={500} height={500}/>
          </div>
        </div>
      </div>
      <h5 className={stockClass}>{stockAvailable}</h5>

      <section className='row-span-7 flex flex-col justify-end'>
        {/* Table Section */}
        <div className="p-2">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Price</td>
                  <td>{price}</td>
                </tr>
                <tr>
                  <td>RRP</td>
                  <td>£{product.rrp}</td>
                </tr>
                <tr>
                  <td>Retirement Date</td>
                  <td>{product.retirement_date}</td>
                </tr>
                <tr>
                  <td>Estimated Profit</td>
                  <td className={profitClass}>£{estimatedProfit.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>

          </div>
        </div>
                
        {/* Links Section */}
        <div className='flex flex-row px-1 sm:px-2'>
          <div className='w-7/12 sm:w-1/2'>
            <Link 
              href={`https://www.ebay.co.uk/sch/i.html?_nkw=${encodeURIComponent(product.product_name)}&_sacat=0&rt=nc&LH_Sold=1&LH_Complete=1`}
              target='_blank'
              className="flex justify-start text-blue-600 hover:text-blue-800 font-semibold text-sm px-3 py-2.5 text-center items-center"
              >
                eBay Sell History
            </Link>
          </div>

          <div className='w-5/12 sm:w-1/2 items-end'>
            <Link 
                href={product.link}
                target='_blank'
                className="relative flex justify-end text-blue-600 hover:text-blue-800 font-semibold text-sm px-3 py-2.5 text-center group"
              >
                <span className='mr-1'>Get Deal</span>
                <span><AnimationArrow /></span>
              </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RetiringSetsCard;