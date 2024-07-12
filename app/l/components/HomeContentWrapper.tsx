'use client';

import { useEffect } from 'react';
import HomeContent from './HomeContent';

const HomeContentWrapper = () => {
  useEffect(() => {
    const scrollToSection = localStorage.getItem('scrollTo');
    if (scrollToSection) {
      localStorage.removeItem('scrollTo');
      const element = document.getElementById(scrollToSection);
      if (element) {
        window.scrollTo({
          top: element.offsetTop - 50, // Adjust offset as needed
          behavior: 'smooth'
        });
      }
    }
  }, []);

  return <HomeContent />;
};

export default HomeContentWrapper;
