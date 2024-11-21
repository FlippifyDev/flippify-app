'use client';

import React, { useEffect, useState } from 'react';

interface AlertProps {
	message: string;
	visible: boolean;
	onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, visible, onClose }) => {
	const [isAnimating, setIsAnimating] = useState(false);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		if (visible) {
			setIsAnimating(true);
			setIsVisible(true);
		} else if (!visible && isAnimating) {
			const timer = setTimeout(() => {
				setIsAnimating(false);
				setIsVisible(false);
				onClose();
			}, 500); // Duration of the slide-out animation
			return () => clearTimeout(timer);
		}
	}, [visible, isAnimating, onClose]);

	useEffect(() => {
		if (visible) {
			const timer = setTimeout(() => {
				setIsAnimating(false);
				onClose();
			}, 3000); // Hide alert after 3 seconds
			return () => clearTimeout(timer);
		}
	}, [visible, onClose]);

	if (!isVisible && !isAnimating) return null;

	return (
		<div
			className={`fixed top-16 left-1/2 transform mt-4 bg-white border border-gray-300 p-2 rounded-md shadow-lg z-50 ${isAnimating && visible ? 'animate-slide-in' : 'animate-slide-out'
				}`}
			style={{ transition: 'opacity 0.4s, transform 0.4s' }}
		>
			<div className="flex items-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					className="stroke-info h-6 w-6 shrink-0 mr-2"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					></path>
				</svg>
				<span>{message}</span>
			</div>
			<style jsx>{`
        @keyframes slideIn {
          0% {
            opacity: 0;
            transform: translateY(-20px) translateX(-50%);
          }
          100% {
            opacity: 1;
            transform: translateY(0) translateX(-50%);
          }
        }

        @keyframes slideOut {
          0% {
            opacity: 1;
            transform: translateY(0) translateX(-50%);
          }
          100% {
            opacity: 0;
            transform: translateY(-20px) translateX(-50%);
          }
        }

        .animate-slide-in {
          animation: slideIn 0.5s ease-in-out forwards;
        }

        .animate-slide-out {
          animation: slideOut 0.5s ease-in-out forwards;
        }
      `}</style>
		</div>
	);
};

export default Alert;
