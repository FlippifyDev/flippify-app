import React from 'react';
import Image from 'next/image';

interface ImageModalProps {
	imageUrl: string;
	onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
	return (
		<div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
			<div className="relative">
				{/* Close button */}
				<button
					onClick={onClose}
					className="absolute top-[-40px] right-[-40px] text-white text-3xl font-bold bg-opacity-60 rounded-full p-2"
				>
					✕
				</button>

				{/* Fullscreen image using Next.js Image */}
				<div className="relative max-h-[90vh] max-w-[90vw]">
					<Image
						src={imageUrl}
						alt="Full View"
						layout="intrinsic" // Makes the image size intrinsic to its natural size
						width={300} // You can use a placeholder width value
						height={300} // Same for height, will scale down/up automatically
						objectFit="contain" // Ensures the image fits in the modal
						sizes="(max-width: 90vw) 90vw, (max-height: 90vh) 90vh" // Optimizes image loading
						priority // Ensure the image is loaded eagerly
					/>
				</div>
			</div>
		</div>
	);
};

export default ImageModal;
