import React from "react";

const Loading = () => {
  return (
    <div
      className="flex justify-center items-center h-screen"
      style={{ backgroundImage: "url('https://i.imgur.com/2dItFcN.png')" }}
    >
      <div className="relative w-24 h-24 animate-spin rounded-full bg-gradient-to-r from-white via-blue-500 to-purple-400">
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-2 border-black bg-center bg-cover"
          style={{
            backgroundImage: "url('https://i.imgur.com/vdLCoNO.png')",
          }}
        ></div>
      </div>
    </div>
  );
};

export default Loading;
