import NavbarProfile from "./NavbarProfile";

import React from "react";

const Navbar = () => {
  return (
    <div className="navbar active:scale-90 transition-transform select-none">
      <div className="flex-1 flex items-center justify-between shadow-planCardShadow bg-white bg-opacity-90 rounded-2xl text-lightModeText">
        <NavbarProfile />
      </div>
    </div>
  );
};

export default Navbar;