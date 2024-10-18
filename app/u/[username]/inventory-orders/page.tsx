import React from 'react';
import Layout from '../../components/layout/Layout';
import InventoryOrdersContent from '../../components/tools/inventory-orders/InventoryOrdersContent';
import ThemeSetter from '@/app/components/ThemeSetter';

export const metadata = {
  title: 'Inventory & Orders - Flippify',
  description: 'Keep track of your sales and profits with Flippify’s comprehensive Financial Hub. Monitor your performance and maximize your reselling success.',
};

export default function Dashboard() {
  return (
    <>
      <ThemeSetter theme="light" />
      <Layout requiredSubscriptions={['']}>
        <div className="w-full h-full">
          <InventoryOrdersContent />
        </div>
      </Layout>
    </>
  );
}
