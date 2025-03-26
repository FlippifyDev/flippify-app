import React from 'react';
import Layout from '@/app/u/components/layout/Layout';
import ThemeSetter from '@/app/components/ThemeSetter';
import LoadingAnimation from '@/app/u/components/dom/ui/LoadingAnimation';

export const metadata = {
    title: 'User Listings - Flippify',
    description: '',
};

export default function NewListing() {
    return (
        <>
            <ThemeSetter theme="light" />
            <Layout requiredSubscriptions={['accessGranted']}>
                <LoadingAnimation text="This page is in development" type="typewriter" />
            </Layout>
        </>
    );
}
