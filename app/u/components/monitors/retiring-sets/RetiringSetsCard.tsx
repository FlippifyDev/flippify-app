import React, { useState } from 'react';
import Image from 'next/image';
import { IRetiringSet } from '@/app/api/monitors/retiringSetsModel';
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
  product: IRetiringSet;
}

const RetiringSetsCard: React.FC<CardProps> = ({ product }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [modalImage, setModalImage] = useState<string | null>(null); // Image to display in modal

  let estimatedProfit;
  let price;

  if (product.price !== null) {
    estimatedProfit = product.rrp - product.price
    price = "£" + product.price.toString() 
  } else {
    estimatedProfit = 0
    price = "Not Found"
  }

  const profitClass = estimatedProfit > 0 ? 'text-houseBlue font-extrabold' : 'text-red-500 font-extrabold';
  const stockAvailable = product.stock_available ? "In Stock" : "Out of Stock";
  const stockClass = stockAvailable === "In Stock" ? 'text-sm text-houseBlue font-semibold' : 'text-sm text-red-500 font-semibold';

  const truncatedTitle = truncateTitle(product.product_name, 60); 

  function onEbaySellHistoryClick() {
    const eBayURL = `https://www.ebay.co.uk/sch/i.html?_nkw=${encodeURIComponent(product.product_name)}&_sacat=0&rt=nc&LH_Sold=1&LH_Complete=1`
    window.open(eBayURL, '_blank');
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
    <div className="grid grid-rows-10 bg-white shadow-lg rounded-lg overflow-hidden w-86 pt-2 pb-0 h-[30rem]">
      {/* Title Section */}
      <section className='row-span-3 grid grid-cols-12 p-2 gap-2 mx-2'>
        <div className='col-span-8'>
          <h5 className='text-sm mb-2'>{product.website} {product.region.toUpperCase()}</h5>
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

      <section className='row-span-7 flex flex-col justify-end'>
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
                  <td>RRP</td>
                  <td>£{product.rrp}</td>
                </tr>
                <tr>
                  <td>Retirement Date</td>
                  <td>{product.retirement_date}</td>
                </tr>
                <tr>
                  <td>Stock</td>
                  <td className={stockClass}>{stockAvailable}</td>
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

export default RetiringSetsCard;