'use client';

import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

const LayoutGradientBackground = () => {
	const controls = useAnimation();

	useEffect(() => {
		let isMounted = true;

		const sequence = async () => {
			while (isMounted) {
				try {
					await controls.start({
						background: [
							'linear-gradient(120deg, #17529C 0%, #7caed0 100%)',  // Darkened houseBlue with a cooler soft blue
							'linear-gradient(120deg, #195fb8 0%, #389CE6 100%)',  // Darker, more balanced blues
							'linear-gradient(120deg, #177ec8 0%, #22436B 100%)',  // Darker houseHoverBlue and complementary tones
							'linear-gradient(120deg, #177ec8 0%, #22436B 100%)',  // Deeper shades for contrast
							'linear-gradient(120deg, #195fb8 0%, #389CE6 100%)',  // Return to houseBlue with a darker variant
							'linear-gradient(120deg, #17529C 0%, #7caed0 100%)',  // Smooth loop to the starting point
						],
						transition: {
							duration: 5,
							ease: 'linear',
						},
					});
					await new Promise((resolve) => setTimeout(resolve, 50)); // Wait for 50 milliseconds before starting the next animation
				} catch (error) {
					console.error('Error starting animation:', error);
					break;
				}
			}
		};

		sequence();

		return () => {
			isMounted = false;
		};
	}, [controls]);

	return (
		<div>
			<motion.div className='absolute inset-0' animate={controls} />
		</div>
	);
};

export default LayoutGradientBackground;
