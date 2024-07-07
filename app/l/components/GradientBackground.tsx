'use client';

import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';


const GradientBackground = () => {
  const controls = useAnimation();

  useEffect(() => {
    let isMounted = true;

    const sequence = async () => {
      while (isMounted) {
        try {
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
          await new Promise(resolve => setTimeout(resolve, 50)); // Wait for 50 milliseconds before starting the next animation
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
      <motion.div
        className='absolute inset-0'
        animate={controls}
        >
      </motion.div>
    </div>
  );
};

export default GradientBackground;