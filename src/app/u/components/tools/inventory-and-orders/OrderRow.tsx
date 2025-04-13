"use client"

import { shortenText } from "@/utils/format";
import Image from "next/image";

import { useRouter } from "next/navigation";


interface OrderRowProps {
	name: string;
	quantitySold: number;
	totalSalePrice: number;
	totalPurchasePrice: number | null;
	totalShippingFees: number;
	totalOtherFees: number;
	username: string;
	image: string;
}

const OrderRow: React.FC<OrderRowProps> = ({
	name,
	quantitySold,
	totalSalePrice,
	totalPurchasePrice,
	totalShippingFees,
	totalOtherFees,
	username,
	image,
}) => {
	const router = useRouter();

	const profit = totalSalePrice - (totalPurchasePrice || 0) - totalShippingFees - totalOtherFees;
	const roi = totalPurchasePrice && totalPurchasePrice > 0 ? ((profit / totalPurchasePrice) * 100).toFixed(2) : 0;

	// Handle row click
	const handleRowClick = () => {
        router.push(`/u/${username}/tools/inventory-and-orders/order-info?name=${encodeURIComponent(name)}`);
	};

	return (
		<tr onClick={handleRowClick} className="cursor-pointer hover:bg-gray-100">
            <td className="min-w-20">
				<Image src={image} width={100} height={100} alt={"image"} className="rounded-full w-12 h-12" loading="lazy" style={{ objectFit: 'cover' }} />
			</td>
			<td>{shortenText(name)}</td>
			<td>{quantitySold}</td>
            <td>{totalPurchasePrice?.toFixed(2) || 'N/A'}</td>
			<td>{totalSalePrice.toFixed(2)}</td>
			<td>{profit.toFixed(2)}</td>
            <td>{totalPurchasePrice ? `${roi}%`: "N/A"}</td>
		</tr>
	);
};

export default OrderRow;
