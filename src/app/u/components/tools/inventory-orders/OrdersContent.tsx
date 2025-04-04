"use client";

// Local Imports
import OrderRow from "./OrderRow";
import { IEbayOrder } from "@/models/store-data";
import { currencySymbols } from "@/config/currency-config";
import { retrieveUserOrders } from "@/services/firebase/retrieve";

// External Imports
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import LoadingSpinner from "@/app/components/LoadingSpinner";

interface CombinedOrder {
    image: string;
    itemName: string;
    quantitySold: number;
    totalSalePrice: number;
    totalPurchasePrice: number | null;
    totalShippingFees: number;
    totalOtherFees: number;
    orders: Array<IEbayOrder>;
}

const OrdersContent: React.FC = () => {
    const [combinedOrderData, setCombinedOrderData] = useState<{ [key: string]: CombinedOrder }>({});


    const [error, setError] = useState<string | null>(null);
    const { data: session } = useSession();
    const username = session?.user.username as string;
    const currency = session?.user.preferences.currency || "GBP";

    // Use the custom hook to get sales data
    const [salesData, setSalesData] = useState<IEbayOrder[]>([]);

    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 12;

    // Calculate total pages based on orders length
    const orderDataArray = Object.entries(combinedOrderData).map(([itemId, order]) => ({
        itemId,
        ...order,
    }));
    const totalPages = Math.ceil(orderDataArray.length / ordersPerPage);

    // Get orders for the current page
    const paginatedOrders = orderDataArray.slice(
        (currentPage - 1) * ordersPerPage,
        currentPage * ordersPerPage
    );

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchOrderData = async () => {
            setLoading(true);
            const orders = await retrieveUserOrders(
                session?.user.id as string,
                "2023-01-01T00:00:00Z",
                session?.user.connectedAccounts.ebay?.ebayAccessToken as string
            );
            if (orders) {
                setSalesData(orders);
            }
            setLoading(false);
        };

        if (session?.user) {
            fetchOrderData();
        }
    }, [session?.user]);

    useEffect(() => {
        if (salesData.length > 0) {
            formatOrderData(salesData);
        }
    }, [salesData]);

    const formatOrderData = (unformattedOrderData: IEbayOrder[]) => {
        const combinedOrders: { [key: string]: CombinedOrder } = {};

        unformattedOrderData.forEach(order => {
            const { itemName } = order;

            if (!combinedOrders[itemName]) {
                combinedOrders[itemName] = {
                    image: order.image[0],
                    itemName: order.itemName,
                    quantitySold: order.sale.quantity,
                    totalSalePrice: order.sale.price,
                    totalPurchasePrice: order.purchase.price,
                    totalShippingFees: order.shipping.fees ?? 0,
                    totalOtherFees: order.additionalFees ?? 0,
                    orders: [order],
                };
            } else {
                combinedOrders[itemName].quantitySold += order.sale.quantity;
                combinedOrders[itemName].totalSalePrice += order.sale.price;
                combinedOrders[itemName].totalShippingFees += order.shipping.fees ?? 0;
                combinedOrders[itemName].totalOtherFees += order.additionalFees ?? 0;

                if (order.purchase.price !== null) {
                    combinedOrders[itemName].totalPurchasePrice =
                        (combinedOrders[itemName].totalPurchasePrice || 0) + (order.purchase.price || 0);
                }

                combinedOrders[itemName].orders.push(order);
            }
        });

        setCombinedOrderData((prevData) => {
            if (JSON.stringify(prevData) !== JSON.stringify(combinedOrders)) {
                return combinedOrders;
            }
            return prevData;
        });
    };


    // Handle page change
    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return error ? (
        <div className="text-red-500">
            <p>Error: {error}</p>
            <p>Unable to load inventory or orders. Please try again later.</p>
        </div>
    ) : (
        <div className="w-full overflow-x-auto">
            <table className="table w-full">
                <thead>
                    <tr className="bg-tableHeaderBackground">
                        <th></th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Cost ({currencySymbols[currency]})</th>
                        <th>Sold For ({currencySymbols[currency]})</th>
                        <th>Profit ({currencySymbols[currency]})</th>
                        <th>ROI (%)</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedOrders.length > 0 ? (
                        paginatedOrders.map((order, index) => {
                            const salePrice = order.totalSalePrice;
                            const quantity = order.quantitySold;
                            const totalPurchasePrice = order.totalPurchasePrice || null;

                            return (
                                <OrderRow
                                    key={index}
                                    itemName={order.itemName}
                                    quantitySold={quantity}
                                    totalSalePrice={salePrice}
                                    totalPurchasePrice={totalPurchasePrice}
                                    totalShippingFees={order.totalShippingFees}
                                    totalOtherFees={order.totalOtherFees}
                                    username={username}
                                    image={order.image}
                                />
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={12}>
                                <div className="w-full flex justify-center items-center">
                                    {loading ? <LoadingSpinner /> : "No orders available."}
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="fixed bottom-0 right-0 p-2">
                    <div className="flex flex-col items-center">
                        {/* Pagination Buttons */}
                        <div className="inline-flex mt-2 xs:mt-0">
                            {/* Prev Button */}
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`flex items-center justify-center px-5 h-12 text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 rounded-s`}
                            >
                                Prev
                            </button>
                            {/* Show entries info dynamically */}
                            <div className="flex items-center bg-gray-900 justify-center px-4 h-12 text-sm text-white space-x-1">
                                <span className="font-semibold text-white">
                                    {Math.min((currentPage - 1) * ordersPerPage + 1, salesData.length)}
                                </span>
                                <span>-</span>
                                <span className="font-semibold text-white">
                                    {Math.min(currentPage * ordersPerPage, orderDataArray.length)}
                                </span>
                                <span>of</span>
                                <span className="font-semibold text-white">{orderDataArray.length}</span>
                            </div>
                            {/* Next Button */}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`flex items-center justify-center px-5 h-12 text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 rounded-e`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrdersContent;
