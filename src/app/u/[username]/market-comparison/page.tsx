import Layout from '../../components/layout/Layout';
import ThemeSetter from '@/app/components/ThemeSetter';
import Page from '../../components/tools/market-comparison/Page';

export const metadata = {
    title: 'Market Comparison - Flippify',
    description: 'Compare current listings and recently sold prices across multiple marketplaces to uncover the best deals and maximize your profits on Flippify.',
  };

export default function Plans() {
	return (
		<>
			<ThemeSetter theme="light" />
            <Layout requiredSubscriptions={['accessGranted']}>
                <Page />
			</Layout>
		</>
	);
}
