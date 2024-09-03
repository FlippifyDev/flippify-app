import LayoutLoadingSkeleton from "../../components/layout/LayoutLoadingSkeleton";
import ThemeSetter from "@/app/components/ThemeSetter";
import Layout from "../../components/layout/Layout";

export default function LoadingPage() {
    return (
        <>
            <ThemeSetter theme="light" />
            <Layout requiredSubscriptions={['admin']}>
                <LayoutLoadingSkeleton />
            </Layout>
        </>
    );
}