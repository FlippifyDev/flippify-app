"use client";

// Local Imports
import { shortenText } from '@/utils/format';
import { updateOrderStatus } from '@/services/firebase/update';
import { IEbayOrder, OrderStatus } from '@/models/store-data';

// External Imports
import { RiHomeOfficeFill } from "react-icons/ri";
import { useState } from 'react'
import { FaTruck } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";
import Image from 'next/image';

interface IShipppedProps {
    item: IEbayOrder;
    uid: string;
    setUpdatedStatus: (status: boolean) => void;
}

const Shipped: React.FC<IShipppedProps> = ({ item, uid, setUpdatedStatus }) => {
    const [shipped, setShipped] = useState(false);
    const [completed, setCompleted] = useState(false);

    async function handleUpdateStatus(status: OrderStatus) {
        await updateOrderStatus(uid, item, status);

        if (status === "Shipped") {
            setShipped(true);
        } else if (status === "Completed") {
            setCompleted(true);
        }
        setUpdatedStatus(true);
        setTimeout(() => {
            setShipped(false);
            setCompleted(false);
            setUpdatedStatus(false);
        }, 2000);
    }


    return (
        <tbody>
            <tr>
                <td className="min-w-20">
                    <figure>
                        <Image
                            src={item.image[0]}
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
                    {shortenText(item.itemName)}
                </td>
                <td>
                    {item.sale.quantity}
                </td>
                <td>
                    <button
                        onClick={() => handleUpdateStatus("Active")}
                        className='w-full flex justify-center text-lg'
                    >
                        <span className='hover:bg-gray-100 p-3 rounded-lg'>
                            {!shipped ? <FaTruck className='scale-x-[-1]'/> : <FaCheck />}
                        </span>
                    </button>
                </td>
                <td>
                    <button
                        onClick={() => handleUpdateStatus("Completed")}
                        className='w-full flex justify-center text-lg'
                    >
                        <span className='hover:bg-gray-100 p-3 rounded-lg'>
                            {!completed ? <RiHomeOfficeFill className='text-xl'/> : <FaCheck />}
                        </span>
                    </button>
                </td>

            </tr>

        </tbody>
    )
}

export default Shipped
