'use client';

import React from 'react';
import Link from 'next/link';
import { CiShoppingTag } from "react-icons/ci";

const ViewPrices = () => {
    return(
        <div className="card-actions justify-end">
            <Link href='/l/pricing'><button className="btn btn-primary bg-discordBlue border-discordBlue text-white"><CiShoppingTag className="text-xl"/>View Prices</button></Link>
        </div>
    )
}

export default ViewPrices;