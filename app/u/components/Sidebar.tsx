"use client";

import SideBarButton from "./SideBarButton";
import SignOutButton from "./SignOutButton";
import BillingPortalButton from "./BillingPortalButton"

import { Lato } from 'next/font/google';
import Link from 'next/link';

import { IoMenu } from "react-icons/io5";
import { FaHouse } from "react-icons/fa6";
import { FaSearch, FaDiscord, FaCog } from "react-icons/fa";
import { BsPersonFillGear, BsClipboard2Fill } from "react-icons/bs";
import { PiSneakerMoveFill } from "react-icons/pi";
import { TbLegoFilled } from "react-icons/tb";

const lato = Lato({ weight: '900', style: 'italic', subsets: ['latin']});

const Sidebar = () => {
  return (
    <div className="drawer drawer-mobile lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay lg:hidden"
        ></label>
        <ul className="menu bg-base-100 opacity-90 border-r-2 text-base-content min-h-full w-64 p-4 flex flex-col justify-between">
          {/* Logo */}
          <div className="flex flex-col">
            <div className="flex justify-center mb-8"> 
              <a className={`${lato.className} text-white text-4xl`}>flippify</a>
            </div>

            {/* Main Menu Section */}
            <div>
              <a className="text-white text-lg font-bold">Dashboard</a>
            </div>
            <li>
              <SideBarButton text="Home" redirect="dashboard" symbol={<FaHouse className="text-lg" />}/>
            </li>
            <li>
              <SideBarButton text="Plans" redirect="plans" symbol={<FaSearch className="text-lg" />}/>
            </li>
            <li>
              <BillingPortalButton />
            </li>
            <li>
              <Link 
                href="https://discord.gg/gNPYfe7YFm" 
                className="text-greyText grid grid-cols-12 items-center gap-2 px-4 py-2 rounded-md transition-colors duration-600 ease-in-out hover:bg-gray-100 hover:text-gray-800 focus:outline-none">
                  <span className="col-span-2 text-lg"><FaDiscord/></span>
                  <span className="col-span-10 text-base">Discord</span>
                  </Link>
            </li>
          </div>

          {/* Display Users' Bots */}
          <div className="mt-8">
            <div>
              <a className="text-white text-lg font-bold">Your Bots</a>
            </div>
            <li>
              <SideBarButton text="Lego Retirement" redirect="lego-retirement" symbol={ <TbLegoFilled className="text-lg" /> } />
            </li>
            <li>
              <SideBarButton text="Sneakers" redirect="sneakers" symbol={ <PiSneakerMoveFill className="text-lg" /> }/>
            </li>
          </div>

          {/* Settings and Other*/}
          <div className="mt-auto flex flex-col">
            <li className="mt-auto">
              <SideBarButton text="Legal" redirect="legal" symbol={ <BsClipboard2Fill className="text-lg" /> } />
            </li>
            <li className="mt-auto">
              <SignOutButton />
            </li>
          </div>
        </ul>
      </div>
      <div className="drawer-content flex flex-col lg:ml-64">
        {/* Toggle button for smaller screens */}
        <label
          htmlFor="my-drawer-2"
          className="btn btn-primary text-white text-2xl bg-transparent border-transparent drawer-button lg:hidden hover:bg-transparent hover:border-transparent hover:scale-125 mr-auto"
        >
          <IoMenu />
        </label>
      </div>
    </div>
  );
};

export default Sidebar;