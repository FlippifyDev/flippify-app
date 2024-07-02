import React from "react";
import UserProfile from "./UserProfile";
import Sidebar from "./Sidebar";
import ThemeController from "./ThemeController";

const Navbar = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-grow">
        <div className="navbar z-50">
          <div className="flex-1 flex items-center justify-between z-50 bg-base-100 bg-opacity-90 rounded-3xl border border-white text-white">
            <UserProfile />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;