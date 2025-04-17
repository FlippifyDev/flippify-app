import React from 'react';
import Layout from '../../../../components/layout/Layout';
import Order from '../../../../components/tools/inventory-and-orders/Order';

import ThemeSetter from '@/app/components/ThemeSetter';


export default function OrderInfo() {
    return (
        <>
            <ThemeSetter theme="light" />
            <Layout anySubscriptions={['admin', 'member']} removePadding>
                <Order />
            </Layout>
        </>
    );
}
