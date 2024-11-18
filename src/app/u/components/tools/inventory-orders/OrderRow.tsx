"use client"

import Image from "next/image";
import { currencySymbols } from "@/src/config/currency-config";

import { useRouter } from "next/navigation";


interface OrderRowProps {
	itemId: string;
	itemName: string;
	quantitySold: number;
	totalSalePrice: number;
	totalPurchasePrice: number | null;
	totalShippingFees: number;
	totalOtherFees: number;
	currency: string;
	username: string;
	image: string;
}

const OrderRow: React.FC<OrderRowProps> = ({
	itemId,
	itemName,
	quantitySold,
	totalSalePrice,
	totalPurchasePrice,
	totalShippingFees,
	totalOtherFees,
	currency,
	username,
	image,
}) => {
	const router = useRouter();

	const profit = totalSalePrice - (totalPurchasePrice || 0) - totalShippingFees - totalOtherFees;
	const roi = totalPurchasePrice && totalPurchasePrice > 0 ? ((profit / totalPurchasePrice) * 100).toFixed(2) : 0;

	// Handle row click
	const handleRowClick = () => {
		router.push(`/u/${username}/inventory-orders/${itemId}`);
	};

	return (
		<tr onClick={handleRowClick} className="cursor-pointer hover:bg-gray-100">
			<td>
				<Image src={image} width={100} height={100} alt={"image"} className="rounded-full w-12 h-12" loading="lazy" style={{ objectFit: 'cover' }} />
			</td>
			<td>{itemName}</td>
			<td>{quantitySold}</td>
			<td>{currencySymbols[currency]}{totalPurchasePrice?.toFixed(2) || 'N/A'}</td>
			<td>{currencySymbols[currency]}{totalSalePrice.toFixed(2)}</td>
			<td>{currencySymbols[currency]}{profit.toFixed(2)}</td>
			<td>{roi}%</td>
		</tr>
	);
};

export default OrderRow;
