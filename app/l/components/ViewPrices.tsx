'use client';

import React from 'react';
import Link from 'next/link';
import { CiShoppingTag } from "react-icons/ci";

const ViewPrices = () => {
    return(
        <div className="card-actions">
            <Link href='/l/pricing'>
                <button className="btn btn-primary bg-discordBlue border-discordBlue text-white flex items-center">
                    <CiShoppingTag className="text-xl" />
                    <span className="inline text-xs sm:text-sm">View Prices</span>
                </button>
            </Link>
      </div>
    )
}

export default ViewPrices;