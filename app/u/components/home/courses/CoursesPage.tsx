import React from 'react';
import CourseCard from './CourseCard';
import { Lato, Inter } from "next/font/google";

const lato = Lato({ weight: "900", style: "italic", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

const CoursesPageContent = () => {
  const courses = [
    {
      status: 'Coming Soon',
      image: 'https://i.imgur.com/EOAUhYX.png', // Image for Flippify Fundamentals
    },
    {
      status: 'Coming Soon',
      image: 'https://i.imgur.com/fhlG48K.png', // Image for The Retail Goldmine
    },
    {
      status: 'Coming Soon',
      image: 'https://i.imgur.com/vUn4p6D.png', // Image for The Art of Reselling
    },
  ];

  return (
    <div className="w-full h-full mb-2">
      <div className="flex flex-col items-center space-y-5 text-center mt-20 mb-28">
        <div className="flex flex-wrap justify-center">
          <p
            className={`${lato.className} text-4xl sm:text-5xl w-4/5 sm:w-full text-gradient bg-gradient-to-tr from-houseBlue to-houseHoverBlue bg-clip-text text-transparent py-1`}
          >
            Courses
            <a
              className={`${inter.className} text-lightModeText text-4xl sm:text-5xl font-bold`}
            >
              {" "}For Everyone
            </a>
          </p>
        </div>
        <div className="flex justify-center w-4/5 sm:w-full">
          <p className="mx-4 mt-[-12px] mb-2 sm:mx-2 text-lightModeText text-md sm:text-lg text-center">
            Flexible Plans for Every Reseller: From Beginners to Experts
          </p>
        </div>
      </div>

      {/* Course Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-12">
        {courses.map((course, index) => (
          <CourseCard
            key={index}
            status={course.status}
            image={course.image} // Passing only status and image props now
          />
        ))}
      </div>
    </div>
  );
};

export default CoursesPageContent;
