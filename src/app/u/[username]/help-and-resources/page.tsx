import React from 'react';
import Layout from '../../components/layout/Layout';
import ThemeSetter from '@/app/components/ThemeSetter';
import LoadingAnimation from '../../components/dom/ui/LoadingAnimation';

export const metadata = {
    title: 'Help & Resources - Flippify',
    description: '',
};

export default function HelpAndResources() {
    return (
        <>
            <ThemeSetter theme="light" />
            <Layout requiredSubscriptions={['accessGranted']}>
                <LoadingAnimation text="This page is in development" type="typewriter" />
            </Layout>
        </>
    );
}
