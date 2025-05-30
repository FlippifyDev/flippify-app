
// OAuth scopes to give us permission to access users ebay information
const SCOPES = [
	"https://api.ebay.com/oauth/api_scope", // View public data from eBay
	"https://api.ebay.com/oauth/api_scope/sell.marketing.readonly", // View your eBay marketing activities
	"https://api.ebay.com/oauth/api_scope/sell.marketing", // View and manage your eBay marketing activities
	"https://api.ebay.com/oauth/api_scope/sell.inventory.readonly", // View your inventory and offers
	"https://api.ebay.com/oauth/api_scope/sell.inventory", // View and manage your inventory and offers
	"https://api.ebay.com/oauth/api_scope/sell.account.readonly", // View your account settings
	"https://api.ebay.com/oauth/api_scope/sell.account", // View and manage your account settings
	"https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly", // View your order fulfillments
	"https://api.ebay.com/oauth/api_scope/sell.fulfillment", // View and manage your order fulfillments
	"https://api.ebay.com/oauth/api_scope/sell.analytics.readonly", // View your selling analytics data
	"https://api.ebay.com/oauth/api_scope/sell.finances", // View and manage your payment and order information
	"https://api.ebay.com/oauth/api_scope/sell.payment.dispute", // View and manage disputes and related details
	"https://api.ebay.com/oauth/api_scope/commerce.identity.readonly", // View a user's basic information
	"https://api.ebay.com/oauth/api_scope/sell.reputation", // View and manage your reputation data
	"https://api.ebay.com/oauth/api_scope/sell.reputation.readonly", // View your reputation data
	"https://api.ebay.com/oauth/api_scope/commerce.notification.subscription", // View and manage your event notification subscriptions
	"https://api.ebay.com/oauth/api_scope/commerce.notification.subscription.readonly", // View your event notification subscriptions
	"https://api.ebay.com/oauth/api_scope/sell.stores", // View and manage eBay stores
	"https://api.ebay.com/oauth/api_scope/sell.stores.readonly", // View eBay stores
]


const handleConnectEbay = () => {
	const CLIENT_ID = process.env.NEXT_PUBLIC_EBAY_CLIENT_ID;
	const REDIRECT_URI = process.env.NEXT_PUBLIC_EBAY_REDIRECT_URI;

	if (!CLIENT_ID || !REDIRECT_URI) {
		throw new Error("Missing eBay credentials");
	}

	const ebayAuthUrl = `https://auth.ebay.com/oauth2/authorize?client_id=${encodeURIComponent(
		CLIENT_ID
	)}&redirect_uri=${encodeURIComponent(
		REDIRECT_URI
	)}&response_type=code&scope=${encodeURIComponent(SCOPES.join(" "))}&prompt=login`; // Forces login screen
    console.log()
	window.location.href = ebayAuthUrl;
};


export { handleConnectEbay };