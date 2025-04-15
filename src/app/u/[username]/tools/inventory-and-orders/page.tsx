import React from 'react';
import Layout from '@/app/u/components/layout/Layout';
import Page from '../../../components/tools/inventory-and-orders/Page';
import ThemeSetter from '@/app/components/ThemeSetter';

export const metadata = {
    title: 'Inventory & Orders - Flippify',
    description: 'Keep track of your sales and profits with Flippify’s comprehensive Financial Hub. Monitor your performance and maximize your reselling success.',
};

export default function InventoryAndOrders() {
    return (
        <>
            <ThemeSetter theme="light" />
            <Layout anySubscriptions={['admin', 'member']}>
                <Page />
            </Layout>
        </>
    );
}
