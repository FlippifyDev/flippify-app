"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface CourseCardProps {
  status: string;
  image: string; // The image prop for background
}

const CourseCard: React.FC<CourseCardProps> = ({ status, image }) => {
  return (
    <motion.div
      className="group relative w-full h-80 rounded-2xl overflow-hidden bg-white shadow-lg cursor-pointer transition-transform duration-500 hover:scale-105"
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} // Set image as background
    >
      {/* Coming Soon Tag */}
      <div className="absolute top-4 left-4 z-20 bg-houseBlue text-white px-3 py-1 rounded-full text-xs">
        {status}
      </div>

      {/* Background overlay for better readability of the tag */}
      <div className="absolute inset-0 bg-black bg-opacity-20 transition-opacity duration-500 group-hover:bg-opacity-40"></div>
    </motion.div>
  );
};

export default CourseCard;
