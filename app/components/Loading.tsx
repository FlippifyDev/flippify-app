import React from "react";
import Image from "next/image";

//https://i.imgur.com/vdLCoNO.png
const Loading = () => {
  return (
    <div
      className="flex justify-center items-center h-screen"
      style={{ backgroundImage: "url('https://i.imgur.com/2dItFcN.png')" }}
    >
      <div className="relative flex justify-center items-center">
          <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-purple-500"></div>
          <Image src="https://i.imgur.com/vdLCoNO.png" alt="Loading" className="rounded-full h-28 w-28" width={28} height={28}/>
      </div>
    </div>
  );
};

export default Loading;
