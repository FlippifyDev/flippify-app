import React from 'react';
import Layout from '@/app/u/components/layout/Layout';
import ThemeSetter from '@/app/components/ThemeSetter';
import Page from '@/app/u/components/tools/expenses/Page';

export const metadata = {
    title: 'Expenses - Flippify',
    description: '',
};

export default function FinancialHub() {
    return (
        <>
            <ThemeSetter theme="light" />
            <Layout anySubscriptions={['admin', 'member']}>
                <Page />
            </Layout>
        </>
    );
}
