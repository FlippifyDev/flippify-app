'use client';

import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

const GradientBackground: React.FC = () => {
  const controls = useAnimation();

  useEffect(() => {
    const sequence = async () => {
      while (true) {
        await controls.start({
          background: [
            'linear-gradient(120deg, #3E78B2 0%, #1B2A49 100%)',
            'linear-gradient(120deg, #4E0D3A 0%, #040404 100%)',
            'linear-gradient(120deg, #2B2D42 0%, #0A090C 100%)',
            'linear-gradient(120deg, #1E3A8A 0%, #020024 100%)',
            'linear-gradient(120deg, #4B0082 0%, #000000 100%)',
            'linear-gradient(120deg, #4B0082 0%, #020024 100%)',
            'linear-gradient(120deg, #1E3A8A 0%, #0A090C 100%)',
            'linear-gradient(120deg, #2B2D42 0%, #040404 100%)',
            'linear-gradient(120deg, #4E0D3A 0%, #1B2A49 100%)',
            'linear-gradient(120deg, #3E78B2 0%, #1B2A49 100%)',
          ],
          transition: {
            duration: 15,
            ease: 'linear'
          }
        });
      }
    };

    sequence();
  }, [controls]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-full h-full z-0"
      animate={controls}
    />
  );
};

export default GradientBackground;
