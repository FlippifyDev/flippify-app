"use client";

// Local Imports
import SideBarButton from "./SideBarButton";


import { IoMenu } from "react-icons/io5";



const Sidebar = () => {
  return (
    <div className="drawer">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <label htmlFor="my-drawer" className="btn btn-ghost text-xl">
          <IoMenu />
        </label>
      </div>

      <div className="drawer-side">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4 flex flex-col">
          {/* Sidebar content here */}
          <li>
            <SideBarButton text="Dashboard" redirect="/dashboard" />
          </li>
          <li>
            <SideBarButton text="Products" redirect="products" />
          </li>
          <li>
            <SideBarButton text="Alerts" redirect="alerts" />
          </li>
          <li>
            <SideBarButton text="Plans" redirect="plans" />
          </li>
          <li className="mt-auto">
            <a className="hover:bg-violet-800 focus:bg-violet-900 ">
              Legal
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;