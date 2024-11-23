"use client"

import React, { useState } from 'react';
import Image from 'next/image';

interface ImageModalProps {
	src: string;
	alt: string;
	width: number;
	height: number;
	className?: string;
}

const ImageModal: React.FC<ImageModalProps> = ({ src, alt, width, height, className }) => {
	const defaultImage = "https://i.imgur.com/pXG2DV3.jpeg";
	const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
	const [modalImage, setModalImage] = useState<string>(defaultImage); // Image to display in modal

	// Function to open the modal with the image
	const handleImageClick = (src: string) => {
		setModalImage(src);
		setIsModalOpen(true);
	};

	// Function to close the modal
	const closeModal = () => {
		setIsModalOpen(false);
		setModalImage(defaultImage);
	};

	return (
		<>
			<div
				tabIndex={0}
				role="button"
				className="flex flex-col items-center avatar h-full w-full"
				onClick={() => handleImageClick(src)}
			>
				<Image src={src} alt={alt} width={width} height={height} className={className} />
			</div>
			{isModalOpen && modalImage && (
				<div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
					<div className="relative">
						{/* Close button */}
						<button
							onClick={closeModal}
							className="absolute top-[-40px] right-[-40px] text-white text-3xl font-bold bg-opacity-60 rounded-full p-2"
						>
							✕
						</button>

						{/* Fullscreen image using Next.js Image */}
						<div className="relative max-h-[90vh] max-w-[90vw]">
							<Image
								src={src}
								alt="Full View"
								layout="intrinsic"
								width={300}
								height={300} 
								objectFit="contain"
								sizes="(max-width: 90vw) 90vw, (max-height: 90vh) 90vh"
								priority
							/>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default ImageModal;
