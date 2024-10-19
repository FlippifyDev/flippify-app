import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ISneakerReleaseInfo } from '@/app/api/monitors/sneakerReleaseInfoModel';
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


const getTimeRemaining = (releaseDate: Date) => {
    const now = new Date();
    const timeRemaining = releaseDate.getTime() - now.getTime();

    if (timeRemaining > 0) {
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else {
        return 'Released!';
    }
};


const truncateTitle = (title: string, maxLength: number) => {
    if (title.length > maxLength) {
        return title.slice(0, maxLength - 3) + '...'; // Truncate and add ellipsis
    }
    return title;
};

interface CardProps {
    product: ISneakerReleaseInfo;
}

const RetiringSetsCard: React.FC<CardProps> = ({ product }) => {
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
    const [modalImage, setModalImage] = useState<string | null>(null); // Image to display in modal
    const [timeRemaining, setTimeRemaining] = useState<string>(''); // Countdown timer state

    const truncatedTitle = truncateTitle(product.product_name, 60); 

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

    // Countdown timer logic
    useEffect(() => {
        const intervalId = setInterval(() => {
            const countdown = getTimeRemaining(new Date(product.release_date));
            setTimeRemaining(countdown);
        }, 1000);

        return () => clearInterval(intervalId); // Cleanup the interval on component unmount
    }, [product.release_date]);

    return (
        <div className="grid grid-rows-10 bg-white shadow-lg rounded-lg overflow-hidden w-86 pt-2 pb-0 h-[26rem]">
            {/* Title Section */}
            <section className='row-span-3 grid grid-cols-12 p-2 gap-2 mx-2'>
                <div className='col-span-8'>
                    <h5 className='text-sm mb-2 text-gray-600 font-semibold'>Releasing on {product.website}</h5>
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
                        <Image src={product.image} alt={truncatedTitle} width={100} height={100} />
                    </div>
                    <h5 className="mt-1 text-[13px] text-gray-500 font-semibold">{formatTimestamp(product.timestamp)}</h5>
                </div>
            </section>

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
                                    <td>Time Until Release</td>
                                    <td className='text-end'>{timeRemaining}</td>
                                </tr>
                                <tr>
                                    <td>Release Date</td>
                                    <td className='text-end'>{new Date(product.release_date).toLocaleDateString()}</td>
                                </tr>
                                <tr>
                                    <td>Number of Raffles</td>
                                    <td className='text-end'>{product.no_raffles}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>       
            </section>

            {/* Links Section */}
            <section className='flex flex-row justify-center rounded-b-lg w-full h-[3rem] mt-4'>
                <Link
                    href={product.link}
                    target="_blank" 
                    rel="noopener noreferrer" // Security attributes for external links
                    className="w-full bg-houseBlue text-white text-center group flex items-center justify-center hover:bg-houseHoverBlue transform transition duration-200"
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
