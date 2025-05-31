function handleConnectStockX() {
    const CLIENT_ID = process.env.NEXT_PUBLIC_STOCKX_CLIENT_ID;
    const REDIRECT_URI = process.env.NEXT_PUBLIC_STOCKX_REDIRECT_URI;

    if (!CLIENT_ID || !REDIRECT_URI) {
        throw new Error("Missing stockx credentials");
    }

    const authUrl = `https://accounts.stockx.com/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=offline_access openid&audience=gateway.stockx.com`;

    window.location.href = authUrl;
}



export { handleConnectStockX };