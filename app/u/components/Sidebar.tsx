"use client"
import SignOutButton from "../components/SignOutButton"
import { IoMenu } from "react-icons/io5";
import { GiMoneyStack } from "react-icons/gi";
import { useRouter } from 'next/navigation';

import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Making bank',
  description: 'Money Money Money',
  
};

const Sidebar = () => {
  const handleLogout = () => {
    // Logic for logging out the user
    console.log('User logged out');
    <SignOutButton />
  };

  const handleNavigateToPlans = () => {
    router.push('/u/Plans');
  };

  const handleNavigationHome = () => {
    router.push('');

  };
  const router = useRouter();
  return (
   
    <div className="navbar bg-base-100">
      <title>Making bank <GiMoneyStack /></title>
    <div className="flex-1">
      {/*<a className="btn btn-ghost text-xl">sdasd</a> */}
      
      <div className="drawer">
  <input id="my-drawer" type="checkbox" className="drawer-toggle" />
  <div className="drawer-content">
    {/* Page content here */}
    
    
    <label htmlFor="my-drawer" className="btn btn-ghost text-xl"><IoMenu /></label>
  </div>
  
  <div className="drawer-side">
    <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
    <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4 flex flex-col">
      {/* Sidebar content here */}
      <li><button className="hover:bg-violet-800 focus:bg-violet-900" onClick={handleNavigationHome}>Home</button></li>
      <li><a className="hover:bg-violet-800 focus:bg-violet-900">Products</a></li>
      <li><a className="hover:bg-violet-800 focus:bg-violet-900">Alerts</a></li>
      <li><button className="hover:bg-violet-800 focus:bg-violet-900" onClick={handleNavigateToPlans}>Plans</button></li>
      <li className="mt-auto"><a className="hover:bg-violet-800 focus:bg-violet-900 ">Legal</a></li>
    </ul>
  </div>
</div>
    </div>
    <div className="flex-none">
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
          <div className="indicator">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="badge badge-sm indicator-item">8</span>
          </div>
        </div>
        <div
          tabIndex={0}
          className="card card-compact dropdown-content bg-base-100 z-[1] mt-3 w-52 shadow">
          <div className="card-body">
            <span className="text-lg font-bold">8 Items</span>
            <span className="text-info">Subtotal: $999</span>
            <div className="card-actions">
              <button className="btn btn-primary btn-block">View cart</button>
            </div>
          </div>
        </div>
      </div>
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
          <div className="w-10 rounded-full">
            <img
              alt="Tailwind CSS Navbar component"
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
          </div>
        </div>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow hover:bg-violet-600">
          <li>
            <a className="justify-between hover:bg-violet-900">
              Profile
              <span className="badge">Not work</span>
            </a>
          </li>
          <li><a className="hover:bg-violet-900">Settings</a></li>
          <li><a className="hover:bg-red-800"><SignOutButton /></a></li>
          {/*<button onClick={handleLogout} className="btn btn-ghost">Logout</button>*/}
        </ul>
      </div>
    </div>
  </div>
  );
}

export default Sidebar;