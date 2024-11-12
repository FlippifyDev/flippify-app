import LayoutLoadingSkeleton from "../../components/layout/LayoutLoadingSkeleton";
import LayoutProductsSkeleton from "../../components/layout/LayoutProductsSkeleton";
import ThemeSetter from "@/src/app/components/ThemeSetter";
import Layout from "../../components/layout/Layout";

export default function LoadingPage() {
	return (
		<>
			<ThemeSetter theme="light" />
			<Layout requiredSubscriptions={['admin']}>
				<LayoutProductsSkeleton />
			</Layout>
		</>
	);
}