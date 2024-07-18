"use client";

import React from "react";
import { Lato, Inter } from "next/font/google";

const lato = Lato({ weight: "900", style: "italic", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

const WaitlistForm = () => {
  return (
    <div className="bg-gray-100 p-8 rounded-lg shadow-md">
      <p className={`${inter.className} text-5xl font-bold text-center text-gray-900 mb-4`}>
        Join our
        <span className={`${lato.className} text-5xl text-gradient bg-gradient-to-tr from-blue-500 to-purple-500 bg-clip-text text-transparent`}> Waitlist</span>
      </p>
      <p className="text-lg text-gray-700 text-center mb-8">
        Gain early access to our All-In-One service tailored for resellers and join a thriving community.
      </p>
      <div className="flex justify-center">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300"
          onClick={handleJoinWaitlist}
        >
          Join Waitlist
        </button>
      </div>
      <p className="text-sm text-gray-600 text-center mt-4">
        Limited spots available! Reserve yours now.
      </p>
    </div>
  );
};

const handleJoinWaitlist = () => {
  // Implement logic to add user to the waitlist (e.g., update database)
  console.log("User joined the waitlist.");
  // Optionally, you can redirect user or show a success message
};

export default WaitlistForm;
