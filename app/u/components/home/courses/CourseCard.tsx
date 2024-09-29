"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface CourseCardProps {
  image: string; // The image prop for background
}

const CourseCard: React.FC<CourseCardProps> = ({ image }) => {
  return (
    <motion.div
      className="group relative w-full h-80 md:h-[500px] rounded-2xl overflow-hidden bg-white shadow-lg cursor-pointer transition-transform duration-500 hover:scale-105"
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Course Image */}
      <div
        className="w-full h-3/5 bg-cover bg-center"
        style={{
          backgroundImage: `url(${image})`,
        }}
      />

      {/* White Section below the image */}
      <div className="w-full h-2/5 bg-white p-4 flex items-center justify-center">
        <p className="text-lg font-semibold text-gray-800">Coming Soon</p>
      </div>
    </motion.div>
  );
};

export default CourseCard;
