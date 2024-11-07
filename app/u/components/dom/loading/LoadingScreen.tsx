import React from "react";

const LoadingScreen: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <div className="loader border-t-4 border-houseBlue rounded-full w-12 h-12 animate-spin"></div>
      <p className="mt-4 text-gray-700">{message}</p>
    </div>
  </div>
);

export default LoadingScreen;
