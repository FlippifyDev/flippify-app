import UserProfile from "./UserProfile";
import Sidebar from "./Sidebar";
import ThemeController from "./ThemeController";


import React from "react";

const Navbar = () => {
  return (
    <div className="navbar bg-base-100 z-50">
      <div className="flex-1 flex items-center justify-between z-50">
        <Sidebar />
      </div>
      <ThemeController/>
      <UserProfile />
    </div>
  );
};

export default Navbar;
