"use client"

import { retrieveUserInventory } from '@/services/firebase/retrieve';
import { formatTableDate } from '@/utils/format-dates';
import { currencySymbols } from '@/config/currency-config';

import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import Image from 'next/image';


const InventoryContent = () => {
	const { data: session } = useSession();
	const currency = session?.user.preferences.currency || "GBP";

	const [listedData, setListedData] = useState<any[]>([]);

    useEffect(() => {
        const fetchInventoryData = async () => {
            const inventory = await retrieveUserInventory(session?.user.id as string, "2023-01-01T00:00:00Z", session?.user.connectedAccounts.ebay?.ebayAccessToken as string);
            if (inventory) {
                setListedData(inventory);
            }
        };

        if (session?.user) {
            fetchInventoryData();
        }
    }, [session?.user]);

	return (
		<div className="w-full h-full overflow-x-auto">
			<table className="table w-full">
				<thead>
					<tr className='bg-tableHeaderBackground'>
						<th></th>
						<th>Product</th>
						<th>Quantity</th>
						<th>Price</th>
						<th>Date Listed</th>
						<th>Item ID</th>
					</tr>
				</thead>
				<tbody>
					{listedData.length > 0 ? (
						listedData.map((item, index) => {
							return (
								<tr key={index} className="hover:bg-gray-100 cursor-pointer transition duration-100">
									<td>
										<Image src={item.image[0]} width={100} height={100} alt={"image"} loading="lazy" className="rounded-full w-12 h-12" style={{ objectFit: 'cover' }} />
									</td>
									<td>{item.itemName}</td>
									<td>{item.quantity}</td>
									<td>{currencySymbols[currency]}{item.price.toFixed(2)}</td>
									<td>
										{formatTableDate(item.dateListed)}
									</td>
									<td>{item.itemId}</td>
								</tr>
							);
						})
					) : (
						<tr>
							<td colSpan={12} className="text-center border">No inventory available.</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
}

export default InventoryContent
