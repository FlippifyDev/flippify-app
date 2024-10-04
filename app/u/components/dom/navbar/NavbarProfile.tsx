import NavbarProfileAvatar from "./NavbarProfileAvatar";
import { IoMdArrowDropdown } from "react-icons/io";
import React from "react";
import NavbarNotificationBell from "./NavbarNotificationBell";

const NavbarProfile = () => {
  return (
    <div className="flex items-center bg-transparent p-1 group">
      <NavbarNotificationBell />
    	<NavbarProfileAvatar />
      	<IoMdArrowDropdown className="transform transition-transform duration-200 group-hover:rotate-90"/>
    </div>
  );
};

export default NavbarProfile;