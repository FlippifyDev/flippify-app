import React from 'react';
import Layout from '../../../components/layout/Layout';
import OrderDetails from '../../../components/tools/inventory-orders/OrderDetails';

import ThemeSetter from '@/src/app/components/ThemeSetter';


export default function Dashboard() {
	return (
		<>
			<ThemeSetter theme="light" />
			<Layout requiredSubscriptions={['']}>
				<div className="w-full h-full">
					<OrderDetails />
				</div>
			</Layout>
		</>
	);
}
