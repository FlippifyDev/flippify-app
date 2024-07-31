"use client";

import Image from "next/image";
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Alert from './Alert'; // Adjust the import path as necessary

const NavbarProfileAvatar = () => {
  const { data: session } = useSession();
  const router = useRouter();
  
  // States for managing the alert visibility
  const [alertVisible, setAlertVisible] = useState(false);

  // Default discord avatar
  let avatar =
    "https://i.pinimg.com/originals/40/a4/59/40a4592d0e7f4dc067ec0cdc24e038b9.png";

  let referral_code = "None";

  if (session) {
    if (session.user?.image) {
      avatar = session.user.image;
    }
    if (session?.user.referral?.referral_code) {
        referral_code = session.user.referral.referral_code;
    }
  }

  useEffect(() => {
    if (!session) {
      router.push(`/l/home`);
    }
  }, [session, router]);

  const handleSignOut = () => {
    signOut();
  };

  const handleReferralCopy = () => {
    navigator.clipboard.writeText(referral_code).then(() => {
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 3000); // Hide alert after 3 seconds
    });
  };

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar"
      >
        <div className="w-10 rounded-full">
          <Image
            alt="Avatar"
            src={avatar}
            width={50}
            height={50}
            loading="lazy"
          />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
      >
        <li className="relative group">
          <a>
            Profile
          </a>
          <div className="absolute bottom-full mb-3 left-1/2 transform -translate-x-1/2 p-2 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
            Coming Soon
          </div>
        </li>
        <li>
          <a onClick={handleReferralCopy}>
            Referral
            <span className="badge">{referral_code}</span>
          </a>
        </li>
        <li>
          <a className="hover:bg-red-600 hover:text-white" onClick={handleSignOut}>Sign Out</a>
        </li>
      </ul>

      {/* Alert component */}
      <Alert
        message="Referral code copied to clipboard!"
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
      />
    </div>
  );
};

export default NavbarProfileAvatar;
