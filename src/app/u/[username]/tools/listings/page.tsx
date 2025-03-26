import React from 'react';
import Layout from '../../../components/layout/Layout';
import ThemeSetter from '@/app/components/ThemeSetter';
import LoadingAnimation from '../../../components/dom/ui/LoadingAnimation';

export const metadata = {
    title: 'User Listings - Flippify',
    description: '',
};

export default function Listings() {
    return (
        <>
            <ThemeSetter theme="light" />
            <Layout requiredSubscriptions={['accessGranted']}>
                <LoadingAnimation text="This page is in development" type="typewriter" />
            </Layout>
        </>
    );
}
