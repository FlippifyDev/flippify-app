
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { User } from '@/models/mongodb/users';
import { refreshEbayToken } from '@/services/ebay/refresh-token';
import fetch from 'node-fetch';

interface EbayError {
	message?: string;
	error?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	try {
		const session = await getSession({ req });

		if (!session || !session.user?.stripeCustomerId) {
			return res.status(401).json({ error: 'User not authenticated' });
		}

		const stripeCustomerId = session.user.stripeCustomerId;
		const user = await User.findOne({ stripe_customer_id: stripeCustomerId });

		if (!user || !user.ebay || !user.ebay.ebayAccessToken || !user.ebay.ebayTokenExpiry) {
			return res.status(400).json({ error: 'eBay tokens not found' });
		}

		let { ebayAccessToken, ebayTokenExpiry } = user.ebay;

		if (Date.now() >= ebayTokenExpiry) {
			ebayAccessToken = await refreshEbayToken(stripeCustomerId);
		}

		if (!ebayAccessToken) {
			return res.status(400).json({ error: 'Unable to fetch eBay Access Token' });
		}

		const ebay_orders_api_url = process.env.EBAY_ORDERS_API_URL;
		if (!ebay_orders_api_url) {
			return res.status(400).json({ error: 'Failed to find ebay inventory api' });
		}

		const response = await fetch(ebay_orders_api_url, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${ebayAccessToken}`,
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			},
		});

		if (!response.ok) {
			const errorResponse = await response.json() as EbayError;
			console.error('Error fetching orders:', errorResponse);
			const errorMessage = errorResponse.message || errorResponse.error || 'Failed to fetch orders data';
			return res.status(500).json({ error: errorMessage });
		}

		const data = await response.json();
		return res.status(200).json(data);
	} catch (error: any) {
		console.error('Error fetching eBay orders:', error.message || 'Unknown error');
		return res.status(500).json({ error: error.message || 'Unknown error occurred' });
	}
}
