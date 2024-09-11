import React, { useState } from 'react';
import Image from 'next/image';
import { IDealWatch } from '@/app/api/monitors/dealWatchModel';
import Link from 'next/link';
import AnimationArrow from '../../../../components/AnimationArrow';
import ImageModal from '@/app/components/ImageModal';


// Utility function to format timestamp into a readable format
const formatTimestamp = (timestamp: Date) => {
  const now = new Date();
  const dealTime = new Date(timestamp);
  
  const diffMs = now.getTime() - dealTime.getTime(); // Difference in milliseconds
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)); // Difference in days
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60)); // Difference in hours
  const diffMinutes = Math.floor(diffMs / (1000 * 60)); // Difference in minutes
  
  // If the deal was found today, display hours/minutes ago
  if (diffDays === 0) {
    if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} min${diffMinutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  }

  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
};

const truncateTitle = (title: string, maxLength: number) => {
  if (title.length > maxLength) {
    return title.slice(0, maxLength - 3) + '...'; // Truncate and add ellipsis
  }
  return title;
};


interface CardProps {
  product: IDealWatch;
}

const DealWatchCard: React.FC<CardProps> = ({ product }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [modalImage, setModalImage] = useState<string | null>(null); // Image to display in modal

  const estimatedProfit = (product.estimatedProfit ?? 0) * 0.97;
  
  // Price display logic
  const price = product.price !== undefined ? `£${product.price.toFixed(2)}` : "Not Found";
  const ebayMeanPrice = product.ebay_mean_price !== undefined ? `£${product.ebay_mean_price.toFixed(2)}` : "Not Found";
  const ebayMaxPrice = product.ebay_max_price !== undefined ? `£${product.ebay_max_price.toFixed(2)}` : "Not Found";
  const profitClass = estimatedProfit > 0 ? 'text-houseBlue font-extrabold' : 'text-red-500 font-extrabold';

  const truncatedTitle = truncateTitle(product.product_name, 60); 

  function onEbaySellHistoryClick() {
    window.open(product.ebay_link, '_blank');
  }

  // Function to open the modal with the image
  const handleImageClick = (imageUrl: string) => {
    setModalImage(imageUrl);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setModalImage(null);
  };

  return (
    <div className="grid grid-rows-10 bg-white shadow-lg rounded-lg overflow-hidden w-86 pt-2 pb-0 h-[33rem]">
      {/* Title Section */}
      <section className='row-span-3 grid grid-cols-12 p-2 gap-2 mx-2'>
        <div className='col-span-8'>
          <h5 className='text-sm mb-2 text-gray-600 font-semibold'>{product.website} {product.region.toUpperCase()}</h5>
          <h2 className='text-lg font-semibold'>{truncatedTitle}</h2>
        </div>

        {/* Image Section with onClick to open the modal */}
        <div 
          tabIndex={0} 
          role="button" 
          className="flex flex-col items-center avatar col-span-4"
          onClick={() => handleImageClick(product.image)} // Open modal on click
        >
          <div className="w-24 rounded-lg border-2">
            <Image src={product.image} alt={truncatedTitle} width={500} height={500} />
          </div>
          <h5 className="mt-1 text-[13px] text-gray-500 font-semibold">{formatTimestamp(product.timestamp)}</h5>
        </div>

      </section>
      
      {/* Price Section */}
      <section className='row-span-7 flex flex-col justify-end mx-2'>
        <div className='flex flex-row justify-between items-center px-10'>
          {/* Buy Price Section */}
          <div className='flex flex-col items-center'>
            <div className='text-sm font-semibold text-gray-500 mb-1'>Buy Price</div>
            <div className='text-xl font-extrabold text-gray-800'>{price}</div>
          </div>

          {/* Separator */}
          <div className='border-l-2 border-gray-300 h-full mx-4'></div>

          {/* Profit Section */}
          <div className='flex flex-col items-center'>
            <div className='text-sm font-semibold text-gray-500 mb-1'>Profit</div>
            <div className={`text-xl ${profitClass}`}>£{estimatedProfit.toFixed(2)}</div>
          </div>
        </div>

        {/* Table Section */}
        <div className="sm:p-2">
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
                  <td>Sales This Week</td>
                  <td>{product.sold_last_7_days}</td>
                </tr>
                <tr>
                  <td>Sales This Month</td>
                  <td>{product.sold_last_month}</td>
                </tr>
                <tr>
                  <td>eBay Mean Price</td>
                  <td>{ebayMeanPrice}</td>
                </tr>
                <tr>
                  <td>eBay Max Price</td>
                  <td>{ebayMaxPrice}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
                
      </section>

      {/* Links Section */}
      <section className='flex flex-row justify-center rounded-b-lg w-full h-[3rem] mt-4'>
        <button onClick={onEbaySellHistoryClick} className="w-6/12 bg-houseBlue text-white text-center flex items-center justify-center hover:bg-houseHoverBlue transform transition duration-200">
          <span className='font-semibold text-xs sm:text-sm'>EBAY SELL HISTORY</span>
        </button>
        <div className='border-l-2 border-white h-full'></div>
        <Link
          href={product.link}
          target="_blank" 
          rel="noopener noreferrer" // Security attributes for external links
          className="w-6/12 bg-houseBlue text-white text-center group flex items-center justify-center hover:bg-houseHoverBlue transform transition duration-200"
        >
          <span className='mr-1 font-semibold text-xs sm:text-sm'>GET DEAL</span>
          <span className='hidden sm:inline'><AnimationArrow /></span>
        </Link>
      </section>

      {/* Modal for Image Preview */}
      {isModalOpen && modalImage && <ImageModal imageUrl={modalImage} onClose={closeModal} />}
    </div>
  );
};

export default DealWatchCard;

/*
          <button className="w-5/12 bg-houseBlue text-white text-center group flex items-center justify-center hover:bg-houseHoverBlue transform transition duration-200">
            <span className='mr-1 font-semibold text-sm'>GET DEAL</span>
            <span className='hidden sm:inline'><AnimationArrow /></span>        
          </button>

          ----------------------

        <div className='w-full'>
          <button onClick={onEbaySellHistoryClick} className="btn btn-outline btn-sm text-xs border-2 flex justify-start rounded-none">EBAY SELL HISTORY</button>
        </div>

        <div className='w-full'>
          <button onClick={onGetDealClick} className="btn btn-outline btn-sm text-xs border-2 group rounded-none px-2 gap-0">
            <span className='mr-1'>GET DEAL</span>
            <span className='hidden sm:inline'><AnimationArrow /></span>
          </button>
        </div>

        -------------------
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
*/