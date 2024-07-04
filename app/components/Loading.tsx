import React from "react";
import jokes from "./loading_messages"
import GradientBackground from "../l/components/GradientBackground";


const Loading = () => {
  const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];


  return (
      <div className="z-0">
      <GradientBackground />
      
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="mt-4 text-white text-lg font-semibold z-30">
          {randomJoke}
        </div>
        <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-discordBlue"></div>
      </div>

    </div>
  );
};

export default Loading;
