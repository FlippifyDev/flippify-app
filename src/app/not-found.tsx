import Layout from "./l/components/layout/Layout";

export default function NotFound() {
    return (
        <Layout>
            <div className="text-white min-h-screen p-2">
                <h1 className="text-4xl font-bold text-center mt-24 mb-12">404 - Page Not Found</h1>
                <p className="text-lg text-center mb-16">Sorry, the page you are looking for does not exist.</p>
            </div>
        </Layout>
    );
}
