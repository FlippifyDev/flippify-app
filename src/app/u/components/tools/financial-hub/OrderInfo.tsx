import Card from './Card'
import { IEbayOrder } from '@/models/store-data';


interface IOrderInfoProps {
    orders: IEbayOrder[];
    loading: boolean;
}


function findOrderInfo(orders: IEbayOrder[]) {
    let missingInfoCount = 0;
    let nonCompletedOrders = 0;
    orders.forEach((order) => {
        if (!order.purchase.price || !order.purchase.date || !order.purchase.platform || !order.purchase.quantity) {
            missingInfoCount++;
        }
        if (order.status !== 'Completed') {
            nonCompletedOrders++;
        }
    });
    return { missingInfoCount, nonCompletedOrders };
}

const OrderInfo: React.FC<IOrderInfoProps> = ({ orders, loading }) => {
    const { missingInfoCount, nonCompletedOrders } = findOrderInfo(orders);

    return (
        <Card title="Order Info">
            <div className='flex flex-col sm:flex-row'>
                <div className="w-full text-center">
                    <h1 className="text-2xl font-semibold">
                        {loading ? '...' : missingInfoCount}
                    </h1>
                    <h3 className="text-sm text-gray-500">Orders missing info</h3>
                </div>
                <div className="w-full text-center">
                    <h1 className="text-2xl font-semibold">
                        {loading ? '...' : nonCompletedOrders}
                    </h1>
                    <h3 className="text-sm text-gray-500">Orders not completed</h3>
                </div>
            </div>
        </Card>
    )
}

export default OrderInfo
