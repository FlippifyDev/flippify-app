"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation'; // Change to 'next/navigation'

interface CourseCardProps {
  image: string;
  link: string;
  type: "yourCourses" | "otherCourses";
  progress?: number; // Progress bar (optional)
}

const CourseCard: React.FC<CourseCardProps> = ({ image, link, type, progress = 0 }) => {
  const router = useRouter(); // This now comes from 'next/navigation'

  const handleMoreInfoClick = () => {
    router.push(link); // This will redirect the user to the provided link
  };

  return (
    <motion.div
      className="group relative w-full h-auto rounded-2xl overflow-hidden bg-white shadow-lg cursor-pointer transition-transform duration-500 hover:scale-105"
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Course Image with Coming Soon Overlay */}
      <div
        className="relative w-full h-[250px] bg-cover bg-center opacity-50 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Coming Soon Overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white font-semibold text-black py-2 px-4 rounded-lg shadow-xl">
            Coming Soon
          </div>
        </div>
      </div>

      {/* White Section */}
      {type === "yourCourses" ? (
        <div className="w-full h-auto bg-white p-4 flex flex-col items-center justify-center">
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-700">Progress: {progress}%</p>
          <p className="text-sm text-blue-600 cursor-pointer mt-2" onClick={handleMoreInfoClick}>
            More info &gt;
          </p>
        </div>
      ) : (
        <div className="w-full h-[50px] bg-white p-4 flex items-center justify-center">
          <p className="text-sm text-blue-600 cursor-pointer" onClick={handleMoreInfoClick}>
            More info &gt;
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default CourseCard;
