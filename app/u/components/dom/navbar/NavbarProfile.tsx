import NavbarProfileAvatar from "./NavbarProfileAvatar";
import { IoMdArrowDropdown } from "react-icons/io";
import React, { useState } from "react";
import NavbarNotificationBell from "./NavbarNotificationBell";

const NavbarProfile = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const toggleNotifications = () => {
    setNotificationsEnabled((prevState) => !prevState);
  };

  return (
    <div className="flex items-center bg-transparent p-1 group">
      <NavbarNotificationBell
        notificationsEnabled={notificationsEnabled}
        toggleNotifications={toggleNotifications}
      />
    	<NavbarProfileAvatar />
      	<IoMdArrowDropdown className="transform transition-transform duration-200 group-hover:rotate-90"/>
    </div>
  );
};

export default NavbarProfile;