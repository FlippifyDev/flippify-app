// Local Imports
import { IOrder, StoreType } from '@/models/store-data'
import { shortenText } from '@/utils/format';

// External Imports
import { useState } from 'react'
import { FaTruck } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";
import Image from 'next/image';
import { updateItem } from '@/services/firebase/update';
import { ordersCol } from '@/services/firebase/constants';
import { orderCacheKey } from '@/utils/constants';

interface IReadyToShipProps {
    item: IOrder;
    uid: string;
    setUpdatedStatus: (status: boolean) => void;
}

const ReadyToShip: React.FC<IReadyToShipProps> = ({ item, uid, setUpdatedStatus }) => {
    const [shipped, setShipped] = useState(false);

    const shipInValue = shipIn(item.sale?.date as string)

    function shipIn(saleDate: string): string {
        const sale = new Date(saleDate);
        const today = new Date();

        // Normalize both dates to remove time part
        sale.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        const suggestedShipBy = new Date(sale);
        suggestedShipBy.setDate(suggestedShipBy.getDate() + 2);

        const timeDiff = suggestedShipBy.getTime() - today.getTime();
        const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        if (daysLeft <= 0) return "Today";
        return `${daysLeft} day${daysLeft > 1 ? 's' : ''}`;
    }


    async function handleMarkAsShipped() {
        // Cache is updated in this function
        item.status = "InProcess";
        await updateItem({ uid, item, rootCol: ordersCol, subCol: item.storeType as StoreType, cacheKey: orderCacheKey });
        setShipped(true);
        setUpdatedStatus(true);
        setTimeout(() => {
            setShipped(false);
            setUpdatedStatus(false);
        }, 900);
    }


    return (
        <tbody>
            <tr>
                <td className="min-w-20">
                    <figure>
                        <Image
                            src={item.image ? item.image[0] : ""}
                            width={100}
                            height={100}
                            alt={"image"}
                            loading="lazy"
                            className="rounded-full w-12 h-12"
                            style={{ objectFit: "cover" }}
                        />
                    </figure>
                </td>
                <td>
                    {shortenText(item.name ?? "N/A")}
                </td>
                <td>
                    {item.sale?.quantity}
                </td>
                <td className='min-w-20 font-semibold'>
                    {item.storageLocation ? item.storageLocation : "N/A"}
                </td>
                <td className={`${shipInValue === "Today" ? "text-amber-600": ""} min-w-20`}>
                    {shipInValue}
                </td>
                <td>
                    <button
                        onClick={handleMarkAsShipped}
                        className='w-full flex justify-center text-lg'
                    >
                        <span className='hover:bg-gray-100 p-3 rounded-lg'>
                            {!shipped ? <FaTruck /> : <FaCheck />}
                        </span>
                    </button>
                </td>
            </tr>
        </tbody>
    )
}

export default ReadyToShip
