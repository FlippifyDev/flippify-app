"use client"

import { currencySymbols } from '@/src/config/currency-config';
import { useListedData } from '@/src/hooks/useListedData';
import { formatTableDate } from '@/src/utils/format-table-date';

import { useSession } from "next-auth/react";
import Image from 'next/image';

const InventoryContent = () => {
	const { data: session } = useSession();
	const customerId = session?.user.customerId as string;
	const ebayAccessToken = session?.user.ebay?.ebayAccessToken;
	const currency = session?.user.currency || "GBP";

	const { listedData } = useListedData(ebayAccessToken, customerId);

	return (
		<div className="w-full mx-6 mb-4 py-4 h-full overflow-x-auto">
			<table className="table w-full">
				<thead>
					<tr>
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
								<tr key={index} className="hover:bg-gray-100 cursor-pointer">
									<td>
									<Image src={item.image} width={100} height={100} alt={"image"} className="rounded-full w-16 h-16" style={{ objectFit: 'cover' }} />
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
