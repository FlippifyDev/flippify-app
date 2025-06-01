export async function request({ url }: { url: string }) {
    try {
        const res = await fetch(`/api/market-compare-proxy?url=${encodeURIComponent(url)}`);
        return await res.text();
    } catch (error) {
        console.error('Fetch error:', error);
        return { error: `${error}` };
    }
}