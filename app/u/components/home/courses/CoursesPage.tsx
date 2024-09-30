import React from "react";
import CourseCard from "./CourseCard";
import LayoutSubscriptionWrapper from "../../layout/LayoutSubscriptionWrapper";

const CoursesPageContent = () => {
  return (
    <div className="w-full h-full mb-2 flex flex-col lg:flex-row">
      {/* Left Section: Courses */}
      <div className="flex-1 flex flex-col space-y-2">
        {/* Your Courses Section */}
        <div className="container mx-auto px-4 pb-4 pt-2 border bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold pb-1">Your Courses</h2>

          {/* Flippify Fundamentals - Available to all subscriptions */}
          <LayoutSubscriptionWrapper requiredSubscriptions={["member"]}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <CourseCard
                image="https://i.imgur.com/ahFKtE7.png"
                link="/flippify-fundamentals"
                type="yourCourses"
              />
            </div>
          </LayoutSubscriptionWrapper>

          {/* The Retail Goldmine - Available to pro and elite subscriptions */}
          <LayoutSubscriptionWrapper anySubscriptions={["pro", "elite"]}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <CourseCard
                image="https://i.imgur.com/z2ztJqx.png"
                link="/the-retail-goldmine"
                type="yourCourses"
              />
            </div>
          </LayoutSubscriptionWrapper>

          {/* The Art of Reselling - Available to elite subscriptions */}
          <LayoutSubscriptionWrapper requiredSubscriptions={["elite"]}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <CourseCard
                image="https://i.imgur.com/bgsfbi2.png"
                link="/the-art-of-reselling"
                type="yourCourses"
              />
            </div>
          </LayoutSubscriptionWrapper>

          {/* Coming Soon */}
          <LayoutSubscriptionWrapper requiredSubscriptions={["!member"]}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <CourseCard
                image="https://i.imgur.com/d00eUMe.png"
                link="/coming-soon"
                type="yourCourses"
              />
            </div>
          </LayoutSubscriptionWrapper>
        </div>

        {/* Other Courses Section */}
        <div className="container mx-auto px-4 pb-4 pt-2 border bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold pb-1">Other Courses</h2>

          {/* Courses for Elite Members */}
          <LayoutSubscriptionWrapper requiredSubscriptions={["elite"]}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <CourseCard
                image="https://i.imgur.com/d00eUMe.png"
                link="/coming-soon"
                type="otherCourses"
              />
            </div>
          </LayoutSubscriptionWrapper>

          {/* Courses for Pro Members */}
          <LayoutSubscriptionWrapper requiredSubscriptions={["pro"]}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <CourseCard
                image="https://i.imgur.com/bgsfbi2.png"
                link="/the-art-of-reselling"
                type="otherCourses"
              />
            </div>
          </LayoutSubscriptionWrapper>

          {/* Courses for Standard Members */}
          <LayoutSubscriptionWrapper requiredSubscriptions={["standard"]}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <CourseCard
                image="https://i.imgur.com/z2ztJqx.png"
                link="/the-retail-goldmine"
                type="otherCourses"
              />
              <CourseCard
                image="https://i.imgur.com/bgsfbi2.png"
                link="/the-art-of-reselling"
                type="otherCourses"
              />
            </div>
          </LayoutSubscriptionWrapper>

          {/* For Non-Members */}
          <LayoutSubscriptionWrapper requiredSubscriptions={["!member"]}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <CourseCard
                image="https://i.imgur.com/ahFKtE7.png"
                link="/flippify-fundamentals"
                type="otherCourses"
              />
              <CourseCard
                image="https://i.imgur.com/z2ztJqx.png"
                link="/the-retail-goldmine"
                type="otherCourses"
              />
              <CourseCard
                image="https://i.imgur.com/bgsfbi2.png"
                link="/the-art-of-reselling"
                type="otherCourses"
              />
            </div>
          </LayoutSubscriptionWrapper>
        </div>
      </div>

      {/* Right Side Section: 1-on-1 Support */}
      <div className="lg:w-1/4 flex-shrink-0 bg-white shadow-lg rounded-lg px-4 py-6 ml-6">
        <h3 className="text-xl font-bold mb-4">Need 1-on-1 Support?</h3>
        <p className="text-gray-600 mb-4">Book a call with one of our experts for personalized assistance.</p>
        <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300">
          Book a 1-on-1 Call
        </button>
      </div>
    </div>
  );
};

export default CoursesPageContent;
