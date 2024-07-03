import React from "react";
import UserProfile from "./UserProfile";
import Sidebar from "./Sidebar";

const Navbar = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-grow">
        <div className="navbar active:scale-90 transition-transform drop-shadow-2xl select-none">
          <div className="flex-1 flex items-center justify-between bg-base-100 bg-opacity-90 rounded-2xl text-white">
            <UserProfile />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;