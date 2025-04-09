import Page from '@/app/u/components/tools/shipping-and-fulfillment/Page';
import Layout from '@/app/u/components/layout/Layout';
import ThemeSetter from '@/app/components/ThemeSetter';

export const metadata = {
    title: 'Shipping & Fulfillment - Flippify',
    description: '',
};

export default function ShippingAndFulfillment() {
    return (
        <>
            <ThemeSetter theme="light" />
            <Layout requiredSubscriptions={['accessGranted']}>
                <Page />
            </Layout>
        </>
    );
}
