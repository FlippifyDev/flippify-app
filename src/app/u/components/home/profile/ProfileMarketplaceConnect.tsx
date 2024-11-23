

import React from 'react';
import ConnectAccount from "./ConnectAccount";

// Component to handle eBay and Amazon account connections
const ProfileMarketplaceConnect = () => {
	return (
		<div className="w-full h-full card bg-white rounded-xl">
			<div className='w-full border-b py-4 px-6 text-lg font-semibold'>
				Connect Accounts
			</div>
			<div className="flex flex-col gap-2">
				{/* eBay Connect Account Card */}
				<ConnectAccount
					name="eBay"
					image="https://i.imgur.com/neFciQD.png"
				/>

				{/* Amazon Connect Account Card */}
				<ConnectAccount
					name="Amazon"
					image="https://i.imgur.com/dVsl6w5.png"
				/>
			</div>
		</div>
	);
};

export default ProfileMarketplaceConnect;
