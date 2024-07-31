"use client";

import NavbarProfileAvatar from "./NavbarProfileAvatar";

import { IoMdArrowDropdown } from "react-icons/io";
import React from "react";

const NavbarProfile = () => {
	return (
		<div className="flex items-center bg-transparent p-1">
			<NavbarProfileAvatar />
			<IoMdArrowDropdown />
		</div>
	);
};

export default NavbarProfile;