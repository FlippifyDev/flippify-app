"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation"; // For navigation

interface CourseCardProps {
  image: string;
  link: string;
  type: "yourCourses" | "otherCourses";
  progress?: number; // Optional progress for "yourCourses"
}

const CourseCard: React.FC<CourseCardProps> = ({ image, link, type, progress = 0 }) => {
  const router = useRouter(); // Used for handling navigation

  const handleMoreInfoClick = () => {
    router.push(link); // Redirect to the specified course link
  };

  return (
    <motion.div
      className="group relative w-full max-w-md rounded-2xl overflow-hidden bg-white shadow-lg cursor-pointer transition-transform duration-500 hover:scale-105"
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Image container with opacity hover effect */}
      <div className="relative w-full h-auto">
        <img
          src={image}
          alt="Course"
          className="w-full rounded-t-2xl transition-opacity duration-300"
          style={{ display: "block", maxWidth: "100%", opacity: 0.7 }} // Set initial lower opacity
        />
        {/* Coming Soon Box */}
        <div className="absolute inset-0 flex items-center justify-center opacity-100">
          <div className="bg-white font-semibold text-black py-2 px-4 rounded-lg shadow-xl">
            Coming Soon
          </div>
        </div>
      </div>

      {/* White Section below the image */}
      {type === "yourCourses" ? (
        <div className="w-full bg-white p-4 flex flex-col items-center justify-center">
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
        <div className="w-full bg-white p-4 flex items-center justify-center">
          <p className="text-sm text-blue-600 cursor-pointer" onClick={handleMoreInfoClick}>
            More info &gt;
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default CourseCard;
