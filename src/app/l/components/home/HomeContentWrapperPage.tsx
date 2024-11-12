'use client';

import { useEffect } from 'react';
import HomeContent from './HomeContent';

const HomeContentWrapperPage = () => {
	useEffect(() => {
		const scrollToSection = localStorage.getItem('scrollTo');
		if (scrollToSection) {
			localStorage.removeItem('scrollTo');
			const element = document.getElementById(scrollToSection);
			if (element) {
				window.scrollTo({
					top: element.offsetTop - 50,
					behavior: 'smooth'
				});
			}
		}
	}, []);

	return <HomeContent />;
};

export default HomeContentWrapperPage;
