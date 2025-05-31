export async function handleDisconnect(store: string, setConnected: (val: boolean) => void) {
    try {
        const response = await fetch(`/api/disconnect?store=${store}`, { method: "POST" });
        if (response.ok) {
            setConnected(false);
        }
    } catch (error) {
        console.error(`Error disconnecting ${store}:`, error);
    }
};
